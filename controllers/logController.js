const Log = require('../models/Log');

module.exports.index = async (req, res) => {
  try {
    const logs = await Log.find({}).populate('user');
    res.render('logs/index', { logs });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao listar logs');
    res.redirect('/');
  }
};

module.exports.showLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findById(id).populate('user');
    if (!log) {
      req.flash('error', 'Log não encontrado');
      return res.redirect('/logs');
    }
    res.render('logs/show', { log });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao exibir log');
    res.redirect('/logs');
  }
};

module.exports.createLog = async (req, res) => {
  try {
    const log = new Log(req.body);
    log.user = req.user._id;
    await log.save();
    req.flash('success', 'Log criado com sucesso');
    res.redirect('/logs');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao criar log');
    res.redirect('/logs');
  }
};
