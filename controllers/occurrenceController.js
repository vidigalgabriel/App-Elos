const Occurrence = require('../models/Occurrence');
const Child = require('../models/Child');

module.exports.index = async (req, res) => {
  try {
    const occurrences = await Occurrence.find({})
      .populate('child')
      .populate('reporter');
    res.render('occurrences/index', { occurrences });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao listar ocorrências');
    res.redirect('/');
  }
};

module.exports.renderNewForm = async (req, res) => {
  try {
    const children = await Child.find({});
    res.render('occurrences/new', { children });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao carregar formulário');
    res.redirect('/occurrences');
  }
};

module.exports.createOccurrence = async (req, res) => {
  try {
    const { title, description, date, child } = req.body;
    const occurrence = new Occurrence({
      title,
      description,
      date,
      child,
      reporter: req.user._id
    });
    await occurrence.save();
    req.flash('success', 'Ocorrência criada com sucesso!');
    res.redirect('/occurrences');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao criar ocorrência');
    res.redirect('/occurrences/new');
  }
};

module.exports.showOccurrence = async (req, res) => {
  try {
    const { id } = req.params;
    const occurrence = await Occurrence.findById(id)
      .populate('child')
      .populate('reporter');
    if (!occurrence) {
      req.flash('error', 'Ocorrência não encontrada');
      return res.redirect('/occurrences');
    }
    res.render('occurrences/show', { occurrence });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao carregar ocorrência');
    res.redirect('/occurrences');
  }
};

module.exports.renderEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const occurrence = await Occurrence.findById(id);
    const children = await Child.find({});
    if (!occurrence) {
      req.flash('error', 'Ocorrência não encontrada');
      return res.redirect('/occurrences');
    }
    res.render('occurrences/edit', { occurrence, children });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao carregar formulário de edição');
    res.redirect('/occurrences');
  }
};

module.exports.updateOccurrence = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, child } = req.body;
    await Occurrence.findByIdAndUpdate(id, { title, description, date, child });
    req.flash('success', 'Ocorrência atualizada!');
    res.redirect(`/occurrences/${id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao atualizar ocorrência');
    res.redirect(`/occurrences/${req.params.id}/edit`);
  }
};

module.exports.deleteOccurrence = async (req, res) => {
  try {
    const { id } = req.params;
    await Occurrence.findByIdAndDelete(id);
    req.flash('success', 'Ocorrência deletada!');
    res.redirect('/occurrences');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao deletar ocorrência');
    res.redirect('/occurrences');
  }
};
