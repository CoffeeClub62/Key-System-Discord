const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db');

function exibirChaves(message, registeredKeys) {
  if (!message.member.permissions.has('ADMINISTRATOR')) {
    return message.reply('Você não tem permissão para usar este comando.');
  }

  const querySelect = 'SELECT chave, cargoID, tempo FROM registered_keys';

  db.all(querySelect, [], function (error, rows) {
    if (error) {
      console.error('Erro ao consultar as chaves na database:', error);
      return message.reply('Ocorreu um erro ao exibir as chaves. Por favor, tente novamente mais tarde.');
    }

    if (rows.length === 0) {
      return message.reply('Não há chaves registradas no momento.');
    }

    const chavesEmbed = {
      color: '#0099ff',
      title: 'Chaves Registradas',
      description: 'Aqui estão as chaves registradas:',
      fields: [],
      timestamp: new Date(),
    };

    rows.forEach((row) => {
      const { chave, cargoID, tempo } = row;
      const cargo = message.guild.roles.cache.get(cargoID);
      const tempoEmDias = tempo / (24 * 60 * 60 * 1000);

      chavesEmbed.fields.push({
        name: `Chave: ${chave}`,
        value: `Cargo: ${cargo ? cargo.name : 'Não encontrado'}\nTempo: ${tempoEmDias} dia(s)`,
        inline: true,
      });
    });

    message.reply({ embeds: [chavesEmbed] });
  });
}

module.exports = exibirChaves;

//   ╦ ╦╦ ╦╔═╗╦ ╦╦╔═
//   ╚╦╝║ ║╔═╝║ ║╠╩╗
//    ╩ ╚═╝╚═╝╚═╝╩ ╩ Made by yuzuk.#1000