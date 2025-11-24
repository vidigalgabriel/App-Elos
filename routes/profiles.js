const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Child = require('../models/Child');
const Familia = require('../models/Familia');
const { isLoggedIn } = require('../middleware/authMiddleware');

router.get('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).lean();
  if (!user) {
    req.flash('error', 'Usuário não encontrado');
    return res.redirect('/');
  }

  const children = await Child.find({ guardian: id }).lean();
  const familia = await Familia.findOne({ userId: id }).populate('tutorSelecionado').lean();
  user.selectedTutor = familia?.tutorSelecionado || null;

  res.render('profiles/show', { user, children });
});

router.get('/:id/edit', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  if (req.user._id.toString() !== id && req.user.role !== 'admin') {
    req.flash('error', 'Sem permissão');
    return res.redirect(`/profiles/${id}`);
  }

  const user = await User.findById(id).lean();
  if (!user) {
    req.flash('error', 'Usuário não encontrado');
    return res.redirect('/');
  }

  const child = await Child.findOne({ guardian: id }).lean();
  const familia = await Familia.findOne({ userId: id }).populate('tutorSelecionado').lean();

  res.render('profiles/edit', { user, child, familia });
});

router.put('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  if (req.user._id.toString() !== id && req.user.role !== 'admin') {
    req.flash('error', 'Sem permissão');
    return res.redirect(`/profiles/${id}`);
  }

  const { name, email, childName, childBirthDate, childAge, childSpecialNeeds, tutorId } = req.body;
  await User.findByIdAndUpdate(id, { name, email });

  const existingChild = await Child.findOne({ guardian: id });
  if (childName?.trim()) {
    if (existingChild) {
      existingChild.name = childName;
      existingChild.birthDate = childBirthDate || existingChild.birthDate;
      existingChild.age = childAge || existingChild.age;
      existingChild.specialNeeds = childSpecialNeeds || existingChild.specialNeeds;
      await existingChild.save();
    } else {
      await Child.create({
        name: childName,
        birthDate: childBirthDate || null,
        age: childAge || null,
        specialNeeds: childSpecialNeeds || '',
        guardian: id
      });
    }
  }

  if (typeof tutorId !== 'undefined') {
    let familia = await Familia.findOne({ userId: id });
    if (!familia) {
      familia = await Familia.create({ userId: id, tutorSelecionado: tutorId || null });
    } else {
      familia.tutorSelecionado = tutorId || null;
      await familia.save();
    }
  }

  req.flash('success', 'Perfil atualizado');
  res.redirect(`/profiles/${id}`);
});

module.exports = router;
