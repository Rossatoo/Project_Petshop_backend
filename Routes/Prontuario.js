const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { descricao, diagnostico, id_pet } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      `INSERT INTO prontuario (descricao, diagnostico, id_pet)
       VALUES (?, ?, ?)`,
      [descricao, diagnostico, id_pet]
    );
    await conn.commit();
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).send('Erro ao cadastrar prontuário: ' + err);
  } finally {
    conn.release();
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM prontuario');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Erro ao buscar prontuários: ' + err);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, diagnostico, id_pet, versao } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE prontuario SET descricao=?, diagnostico=?, id_pet=?, versao=versao+1
       WHERE id=? AND versao=?`,
      [descricao, diagnostico, id_pet, id, versao]
    );

    if (result.affectedRows === 0) {
      return res.status(409).send('Registro foi modificado por outro processo.');
    }

    res.send('Prontuário atualizado com sucesso.');
  } catch (err) {
    res.status(500).send('Erro ao atualizar prontuário: ' + err);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM prontuario WHERE id = ?', [id]);
    res.send('Prontuário removido com sucesso.');
  } catch (err) {
    res.status(500).send('Erro ao remover prontuário: ' + err);
  }
});

module.exports = router;
