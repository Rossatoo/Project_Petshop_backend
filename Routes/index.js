const express = require('express');
const router = express.Router();

const petsRouter = require('./Pets');
const prontuariosRouter = require('./Prontuario');
const atendimentoRouter = require('./Atendimento');
const usuarioRouter = require('./Users');
const loginRouter = require('./Login');

router.use('/usuarios', usuarioRouter);
router.use('/login', loginRouter);
router.use('/pets', petsRouter);
router.use('/prontuarios', prontuariosRouter);
router.use('/atendimentos', atendimentoRouter);

module.exports = router;
