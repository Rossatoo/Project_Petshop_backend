const db = require('./db');

class OrquestradorAtendimento {
  static async registrarAtendimento(dadosPet, dadosProntuario) {
    const conexao = await db.getConnection(); // pega a conexão para controle transacional
    try {
      await conexao.beginTransaction();

      let idPet;

      // Verifica se o pet já existe (por nome, espécie e dono, por exemplo)
      const [petExistente] = await conexao.query(
        'SELECT id_pet FROM pet WHERE nome = ? AND especie = ? AND raca = ?',
        [dadosPet.nome, dadosPet.especie, dadosPet.raca]
      );

      if (petExistente.length > 0) {
        idPet = petExistente[0].id_pet;
      } else {
        // Cria o pet
        const [resultadoPet] = await conexao.query(
          `INSERT INTO pet (nome, especie, raca, idade, peso) VALUES (?, ?, ?, ?, ?)`,
          [dadosPet.nome, dadosPet.especie, dadosPet.raca, dadosPet.idade, dadosPet.peso]
        );
        idPet = resultadoPet.insertId;
      }

      // Cria o prontuário (a data será gerada automaticamente pelo banco)
      await conexao.query(
        `INSERT INTO prontuario (descricao, diagnostico, id_pet) VALUES (?, ?, ?)`,
        [dadosProntuario.descricao, dadosProntuario.diagnostico, idPet]
      );

      await conexao.commit();
      console.log('Atendimento registrado com sucesso!');
    } catch (erro) {
      await conexao.rollback();
      console.error('Erro ao registrar atendimento:', erro.message);
      throw new Error('Erro ao registrar atendimento: ' + erro.message);
    } finally {
      conexao.release();
    }
  }
}

module.exports = OrquestradorAtendimento;
