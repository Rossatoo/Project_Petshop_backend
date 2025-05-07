const express = require('express');
const db = require('../db');
const router = express.Router();

//Register Pet
router.post('/', async (req, res) => {
  const { nome, especie, owner_id} = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO pet (nome, especie, owner_id) VALUES (?, ?, ?)',
      [nome, especie, owner_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).send('Erro ao cadastrar pet: ' + err);
  }
});

//Find Pets
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pet');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Erro ao buscar pets: ' + err);
  }
});

//Update Pet - Possui controle de Versão
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, especie, owner_id, versao } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE pet SET nome=?, especie=?, owner_id=?, versao=versao+1
       WHERE id=? AND versao=?`,
      [nome, especie, owner_id, versao]
    );

    if (result.affectedRows === 0) {
      return res.status(409).send('Registro foi modificado por outro processo.');
    }

    res.send('Pet atualizado com sucesso.');
  } catch (err) {
    res.status(500).send('Erro ao atualizar pet: ' + err);
  }
});

//Delete Pet
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM pet WHERE id = ?', [id]);
    res.send('Pet removido com sucesso.');
  } catch (err) {
    res.status(500).send('Erro ao remover pet: ' + err);
  }
});

module.exports = router;
