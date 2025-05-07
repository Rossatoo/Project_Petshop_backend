const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const db = require('../db');
const router = express.Router();

//Register User
router.post('/', async (req, res) => {
  const { nome, email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const [result] = await db.query(
      'INSERT INTO users (nome, email, password) VALUES (?, ?, ?)',
      [nome, email, hashedPassword]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).send('Erro ao cadastrar usuario: ' + err);
  }
});



//Find Users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Erro ao buscar usuarios: ' + err);
  }
});

//Update Users - Possui controle de Versão
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, password } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE users SET nome=?, email=?, password=?, versao=versao+1
       WHERE id=? AND versao=?`,
      [nome, email, password, versao]
    );

    if (result.affectedRows === 0) {
      return res.status(409).send('Registro foi modificado por outro processo.');
    }

    res.send('Usuario atualizado com sucesso.');
  } catch (err) {
    res.status(500).send('Erro ao atualizar Usuario: ' + err);
  }
});

//Delete Pet
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.send('Usuario removido com sucesso.');
  } catch (err) {
    res.status(500).send('Erro ao remover Usuario: ' + err);
  }
});

module.exports = router;
