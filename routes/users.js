const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const Child = require('../models/Child');
const Record = require('../models/Record');
const Location = require('../models/Location');


router.get('/register', (req, res) => {
    res.render('users/register');
});


router.post('/register', async (req, res, next) => {
    try {
        const { 
            name, 
            email, 
            password, 
            role, 
            childName, 
            childBirthDate, 
            childSpecialNeeds, 
            faculdade, 
            idade, 
            observacoes, 
            experiencia 
        } = req.body;
        
        const user = new User({ name, email, role });

        const registeredUser = await User.register(user, password);

        if (registeredUser.role === 'tutor') {
            registeredUser.tutorData.faculdade = faculdade || '';
            registeredUser.tutorData.idade = idade || null;
            registeredUser.tutorData.observacoes = observacoes || '';
            
            await registeredUser.save(); 

        } else if (registeredUser.role === 'familia') {
            if (childName) {
                const child = new Child({
                    name: childName,
                    birthDate: childBirthDate,
                    specialNeeds: childSpecialNeeds,
                    guardian: registeredUser._id
                });
                if (req.body.childAge) child.age = req.body.childAge; 
                
                await child.save();
            }
        }
        
        req.login(registeredUser, err => {
            if (err) return next(err);

            req.flash('success', 'Cadastro realizado com sucesso!');
            
            if (registeredUser.role === 'tutor') {
                return res.redirect('/tutors/dashboard');
            } else if (registeredUser.role === 'familia') {
                return res.redirect('/familias/dashboard');
            } else {
                return res.redirect('/');
            }
        });
    } catch (e) {
        let errorMessage = e.message;
        if (e.name === 'UserExistsError') {
             errorMessage = 'Este email já está cadastrado.';
        }
        req.flash('error', errorMessage);
        res.redirect('/users/register');
    }
});


router.get('/login', (req, res) => {
    res.render('users/login');
});


router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
}), (req, res) => {
    req.flash('success', 'Bem-vindo!');

    if (req.user.role === 'tutor') {
        res.redirect('/tutors/dashboard');
    } else if (req.user.role === 'familia') {
        res.redirect('/familias/dashboard');
    } else {
        res.redirect('/');
    }
});



router.get('/dashboard', async (req, res) => {
    try {
        const user = req.user;
        const child = await Child.findOne({ guardian: user._id }).populate('assignedTutor');
        res.render('familias/dashboard', { user, child });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Erro ao carregar dashboard');
        res.redirect('/');
    }
});


router.get('/atribuicoes', async (req, res) => {
    try {
        const user = req.user;
        const tutors = await User.find({ role: 'tutor' });
        res.render('familias/buscarTutor', { user, tutors });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Erro ao carregar tutores');
        res.redirect('/users/dashboard');
    }
});


router.post('/selecionarTutor', async (req, res) => {
    try {
        const { tutorId } = req.body;
        const user = req.user;
        const tutor = await User.findById(tutorId);
        if (!tutor || tutor.role !== 'tutor') {
            req.flash('error', 'Tutor inválido');
            return res.redirect('/users/atribuicoes');
        }
        user.selectedTutor = tutor._id;
        await user.save();
        const child = await Child.findOne({ guardian: user._id });
        if (child) {
            child.assignedTutor = tutor._id;
            await child.save();
        }
        req.flash('success', 'Tutor selecionado com sucesso');
        res.redirect('/users/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Erro ao selecionar tutor');
        res.redirect('/users/atribuicoes');
    }
});


router.get('/registros', async (req, res) => {
    try {
        const user = req.user;
        const child = await Child.findOne({ guardian: user._id });
        const records = child
            ? await Record.find({ childId: child._id }).sort({ createdAt: -1 })
            : [];
        res.render('familias/registros', { user, child, records });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Erro ao carregar registros');
        res.redirect('/users/dashboard');
    }
});


router.post('/registros', async (req, res) => {
    try {
        const { type, descricao } = req.body;
        const user = req.user;
        const child = await Child.findOne({ guardian: user._id });
        if (!child) {
            req.flash('error', 'Nenhuma criança encontrada');
            return res.redirect('/users/registros');
        }
        await Record.create({
            childId: child._id,
            tutorId: child.assignedTutor,
            type,
            descricao,
            data: new Date()
        });
        req.flash('success', 'Registro adicionado');
        res.redirect('/users/registros');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Erro ao adicionar registro');
        res.redirect('/users/registros');
    }
});


router.get('/mapaRotas', async (req, res) => {
    try {
        const user = req.user;
        const child = await Child.findOne({ guardian: user._id }).populate('assignedTutor');
        const locations = child
            ? await Location.find({ childId: child._id }).sort({ createdAt: 1 })
            : [];
        res.render('familias/trajeto', { user, child, locations });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Erro ao carregar mapa de trajetos');
        res.redirect('/users/dashboard');
    }
});


module.exports = router;