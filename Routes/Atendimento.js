const express = require('express');
const router = express.Router();
const OrquestradorAtendimento = require('../OrquestradorAtendimento');

router.post('/', async (req, res) => {
  const { pet, prontuario } = req.body;
  try {
    await OrquestradorAtendimento.registrarAtendimento(pet, prontuario);
    res.status(201).send('Atendimento registrado com sucesso!');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
