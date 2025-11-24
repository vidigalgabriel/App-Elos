const Location = require('../models/Location');
const Child = require('../models/Child');

module.exports.viewLocations = async (req, res) => {
  try {
    const children = await Child.find({ guardian: req.user._id });
    const locations = await Promise.all(
      children.map(async (child) => {
        const lastLocation = await Location.findOne({ child: child._id }).sort({ timestamp: -1 });
        return { child, location: lastLocation };
      })
    );
    res.render('familias/trajeto', { user: req.user, locations });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erro ao carregar trajetos');
    res.redirect('/familias/dashboard');
  }
};
