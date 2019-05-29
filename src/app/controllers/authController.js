const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const crypto = require('crypto');

const authConfig = require('../../config/auth')

const router = express.Router();

function gerarToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'Usuário já existe!' });
        }
        const user = await User.create(req.body);
        user.password = undefined;

        return res.send({
            user,
            token: gerarToken({ id: user.id }),
        });
    } catch (err) {
        return res.status(400).send({ error: 'Falha ao registrar' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).send({ error: 'Usuário não encontrado!' });
    }
    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: 'Senha inválida!' });
    }

    user.password = undefined;

    res.send({
        user,
        token: gerarToken({ id: user.id })
    });
});

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).send({ error: 'Usuário não encontrado!' });
        }

        const  token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });
        
        console.log(token, now);

    } catch (err) {
        res.status(400).send({ error: 'Erro em Esqueci minha senha, tente novamente'});
    }

});
module.exports = app => app.use('/auth', router);