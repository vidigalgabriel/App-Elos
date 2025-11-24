module.exports.isLoggedIn = (req, res, next) => {
if (req.isAuthenticated()) {
return next();
}
req.flash('error', 'Você precisa estar logado para acessar essa página');
res.redirect('/users/login');
};
