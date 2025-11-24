const Message = require('../models/Message');
const User = require('../models/User');

const getMessages = async (req, res) => {
  try {
    const user = req.user;
    let pairedUserId;

    if (user.role === 'familia') {
      pairedUserId = user.tutorId || null;
    } else if (user.role === 'tutor') {
      pairedUserId = req.query.familia || null;
    }

    if (!pairedUserId) {
      return res.render(`${user.role}/mensagens`, { user, messages: [], pairedUser: null });
    }

    const messages = await Message.find({
      $or: [
        { sender: user._id, receiver: pairedUserId },
        { sender: pairedUserId, receiver: user._id }
      ]
    }).sort({ createdAt: -1 }).populate('sender');

    const pairedUser = await User.findById(pairedUserId);

    res.render(`${user.role}/mensagens`, { user, messages, pairedUser });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao carregar mensagens');
    res.redirect(`/${req.user.role}/dashboard`);
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!content || !receiverId) {
      req.flash('error', 'Mensagem ou destinatário não fornecido.');
      return res.redirect('back');
    }

    await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content
    });

    const redirectUrl = req.user.role === 'familia' ? `/familias/mensagens?familia=${receiverId}` : `/tutors/mensagens?familia=${receiverId}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao enviar mensagem');
    res.redirect(`/${req.user.role}/mensagens`);
  }
};

module.exports = { getMessages, sendMessage };
