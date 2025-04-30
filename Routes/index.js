const express = require('express');
const router = express.Router();

const petsRouter = require('./Pets');
const prontuariosRouter = require('./Prontuario');
const atendimentoRouter = require('./Atendimento');

router.use('/pets', petsRouter);
router.use('/prontuarios', prontuariosRouter);
router.use('/atendimentos', atendimentoRouter);

module.exports = router;
