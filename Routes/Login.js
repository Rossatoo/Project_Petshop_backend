const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password} = req.body;
  try {
    const [result] = await db.query(
      'SELECT * FROM users WHERE email=?;',
      [email]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).send('Erro ao cadastrar pet: ' + err);
  }
});

module.exports = router;