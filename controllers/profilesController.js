const User = require('../models/User');
const Child = require('../models/Child');

module.exports.showProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate('selectedTutor')
      .lean();
    if (!user) return res.status(404).send('Usuário não encontrado');

    if (user.role === 'familia') {
      const child = await Child.findOne({ guardian: user._id }).lean();
      user.child = child || null;
    }

    res.render('profiles/show', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar perfil');
  }
};

module.exports.editProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).send('Usuário não encontrado');

    let child = null;
    if (user.role === 'familia') {
      child = await Child.findOne({ guardian: user._id }).lean();
    }

    res.render('profiles/edit', { user, child });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar edição');
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = {
      name: req.body.name,
      email: req.body.email
    };

    if (req.body.role === 'tutor') {
      updates.tutorData = {
        faculdade: req.body.faculdade || '',
        idade: req.body.idade || null,
        observacoes: req.body.observacoes || ''
      };
    }

    await User.findByIdAndUpdate(userId, updates);

    if (req.body.role === 'familia') {
      const child = await Child.findOne({ guardian: userId });
      if (child) {
        child.name = req.body.childName || child.name;
        child.age = req.body.childAge || child.age;
        child.birthDate = req.body.childBirthDate || child.birthDate;
        child.specialNeeds = req.body.childSpecialNeeds || child.specialNeeds;
        await child.save();
      }
    }

    res.redirect(`/profiles/${userId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar perfil');
  }
};
