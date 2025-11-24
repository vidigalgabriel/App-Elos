const User = require('../models/User');
const Child = require('../models/Child');
const Record = require('../models/Record');
const Message = require('../models/Message');

const TutorController = {};

TutorController.dashboard = (req, res) => {
  console.log('Renderizando dashboardTutor para', req.user.name);
  res.render('tutors/dashboardTutor', { user: req.user });
};

TutorController.atribuicoes = async (req, res) => {
  try {
    const child = await Child.findOne({ assignedTutor: req.user._id }).populate('guardian');
    res.render('tutors/atribuicoes', { user: req.user, child });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao carregar atribuições');
    res.redirect('/tutors/dashboard');
  }
};

TutorController.registrosForm = async (req, res) => {
  try {
    const child = await Child.findOne({ assignedTutor: req.user._id });
    const registros = child ? await Record.find({ childId: child._id }).sort({ data: -1 }) : [];
    res.render('tutors/registros', { user: req.user, child, registros });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao carregar registros');
    res.redirect('/tutors/dashboard');
  }
};

TutorController.iniciarRastreio = async (req, res) => {
  try {
    const child = await Child.findOne({ assignedTutor: req.user._id });
    if (!child) {
      req.flash('error', 'Nenhuma criança atribuída.');
      return res.redirect('/tutors/mapa-rotas');
    }
    child.tracking = true;
    child.location = { latitude: null, longitude: null };
    await child.save();
    req.flash('success', 'Rastreio iniciado.');
    res.redirect('/tutors/mapa-rotas');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao iniciar rastreio.');
    res.redirect('/tutors/mapa-rotas');
  }
};

TutorController.finalizarRastreio = async (req, res) => {
  try {
    const child = await Child.findOne({ assignedTutor: req.user._id });
    if (!child) {
      req.flash('error', 'Nenhuma criança atribuída.');
      return res.redirect('/tutors/mapa-rotas');
    }
    child.tracking = false;
    await child.save();
    req.flash('success', 'Rastreio finalizado.');
    res.redirect('/tutors/mapa-rotas');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao finalizar rastreio.');
    res.redirect('/tutors/mapa-rotas');
  }
};

TutorController.atualizarPosicao = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const child = await Child.findOne({ assignedTutor: req.user._id });
    if (!child || !child.tracking) return res.status(400).json({ error: 'Rastreio não iniciado' });
    child.location = { latitude, longitude };
    await child.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar posição' });
  }
};

TutorController.registrarInformacao = async (req, res) => {
  try {
    const child = await Child.findOne({ assignedTutor: req.user._id });
    if (!child) {
      req.flash('error', 'Nenhuma criança atribuída');
      return res.redirect('/tutors/registros');
    }

    const { tipo, descricao, data } = req.body;
    if (!tipo || !descricao || !data) {
      req.flash('error', 'Campos incompletos');
      return res.redirect('/tutors/registros');
    }

    const parsedDate = new Date(data);
    if (isNaN(parsedDate.getTime())) {
      req.flash('error', 'Data inválida');
      return res.redirect('/tutors/registros');
    }

    await Record.create({
      tutorId: req.user._id,
      childId: child._id,
      type: tipo,
      descricao,
      data: parsedDate
    });

    req.flash('success', 'Informação registrada');
    res.redirect('/tutors/registros');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao registrar informação');
    res.redirect('/tutors/registros');
  }
};

TutorController.mapaRotas = async (req, res) => {
  try {
    const child = await Child.findOne({ assignedTutor: req.user._id });
    const locations = child && child.location
      ? [{ latitude: child.location.latitude, longitude: child.location.longitude }]
      : [];
    res.render('tutors/mapaRotas', { user: req.user, locations, tracking: child ? child.tracking : false });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao carregar mapa de rotas');
    res.redirect('/tutors/dashboard');
  }
};

TutorController.mensagens = async (req, res) => {
  try {
    const child = await Child.findOne({ assignedTutor: req.user._id }).populate('guardian');
    if (!child || !child.guardian) {
      return res.render('tutors/mensagens', { user: req.user, pairedUser: null, messages: [] });
    }

    const pairedUser = child.guardian;
    if (req.method === 'GET') {
      const messages = await Message.find({
        $or: [
          { sender: req.user._id, receiver: pairedUser._id },
          { sender: pairedUser._id, receiver: req.user._id }
        ]
      }).sort({ createdAt: -1 }).populate('sender receiver');
      return res.render('tutors/mensagens', { user: req.user, pairedUser, messages });
    }

    const { content } = req.body;
    if (!content) {
      req.flash('error', 'Mensagem vazia');
      return res.redirect('/tutors/mensagens');
    }

    await Message.create({ sender: req.user._id, receiver: pairedUser._id, content });
    req.flash('success', 'Mensagem enviada');
    res.redirect('/tutors/mensagens');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao processar mensagens');
    res.redirect('/tutors/dashboard');
  }
};

TutorController.getMensagensApi = async (req, res) => {
  try {
    const child = await Child.findOne({ assignedTutor: req.user._id }).populate('guardian');
    if (!child || !child.guardian) {
      return res.json([]);
    }
    const pairedUser = child.guardian;

    const query = {
      $or: [
        { sender: req.user._id, receiver: pairedUser._id },
        { sender: pairedUser._id, receiver: req.user._id }
      ]
    };

    if (req.query.lastMessageTimestamp) {
      query.createdAt = { $gt: new Date(req.query.lastMessageTimestamp) };
    }

    const messages = await Message.find(query).sort({ createdAt: 'asc' });
    res.json(messages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
};

TutorController.perfil = (req, res) => {
  res.redirect(`/profiles/${req.user._id}`);
};

module.exports = TutorController;