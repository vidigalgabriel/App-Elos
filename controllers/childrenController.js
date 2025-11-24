const Child = require('../models/Child');

module.exports.index = async (req, res) => {
  try {
    const children = await Child.find({}).populate('guardian');
    res.render('childrens/index', { children });
  } catch (err) {
    req.flash('error', 'Erro ao listar crianças');
    res.redirect('/');
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render('childrens/new');
};

module.exports.createChild = async (req, res) => {
  try {
    const { name, birthDate, specialNeeds } = req.body;
    const child = new Child({
      name,
      birthDate: birthDate || null,
      specialNeeds: specialNeeds || '',
      guardian: req.user._id
    });
    await child.save();
    req.flash('success', 'Criança criada com sucesso!');
    res.redirect('/childrens');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao criar criança');
    res.redirect('/childrens/new');
  }
};

module.exports.showChild = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await Child.findById(id).populate('guardian');
    if (!child) {
      req.flash('error', 'Criança não encontrada');
      return res.redirect('/childrens');
    }
    res.render('childrens/show', { child });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao carregar detalhes da criança');
    res.redirect('/childrens');
  }
};

module.exports.renderEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await Child.findById(id);
    if (!child) {
      req.flash('error', 'Criança não encontrada');
      return res.redirect('/childrens');
    }
    res.render('childrens/edit', { child });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao carregar formulário de edição');
    res.redirect('/childrens');
  }
};

module.exports.updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, birthDate, specialNeeds } = req.body;
    await Child.findByIdAndUpdate(id, {
      name,
      birthDate: birthDate || null,
      specialNeeds: specialNeeds || ''
    });
    req.flash('success', 'Criança atualizada com sucesso!');
    res.redirect(`/childrens/${id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao atualizar criança');
    res.redirect(`/childrens/${req.params.id}/edit`);
  }
};

module.exports.deleteChild = async (req, res) => {
  try {
    const { id } = req.params;
    await Child.findByIdAndDelete(id);
    req.flash('success', 'Criança deletada com sucesso!');
    res.redirect('/childrens');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao deletar criança');
    res.redirect('/childrens');
  }
};
