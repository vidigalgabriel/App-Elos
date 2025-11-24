const express = require('express');
const router = express.Router();
const tutorsController = require('../controllers/tutorController');
const { isLoggedIn } = require('../middleware/authMiddleware');


router.get('/dashboard', isLoggedIn, tutorsController.dashboard);


router.get('/atribuicoes', isLoggedIn, tutorsController.atribuicoes);

router.get('/mensagens', isLoggedIn, tutorsController.mensagens);
router.post('/mensagens/send', isLoggedIn, tutorsController.enviarMensagem);


router.get('/registros', isLoggedIn, tutorsController.registrosForm);
router.post('/registros', isLoggedIn, tutorsController.registrarInformacao);


router.get('/mapa-rotas', isLoggedIn, tutorsController.mapaRotas);


router.get('/perfil', isLoggedIn, (req, res) => {
    res.redirect(`/profiles/${req.user._id}`);
});

module.exports = router;
