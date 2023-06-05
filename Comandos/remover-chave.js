const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json')
const logs = config.Logs;

const db = new sqlite3.Database('database.db');
const chaveChannelID = `${logs}`; // Canal de logs, configure no config.json

function removerChave(message, registeredKeys) {
  if (!message.member.permissions.has('ADMINISTRATOR')) {
    return message.reply('Você não tem permissão para usar este comando.');
  }

  const args = message.content.trim().split(/ +/);
  if (args.length !== 2) {
    return message.reply('Uso correto: !remover-chave <chave>');
  }

  const chave = args[1];

  const queryDelete = 'DELETE FROM registered_keys WHERE chave = ?';

  db.run(queryDelete, [chave], function (error) {
    if (error) {
      console.error('Erro ao remover a chave da database:', error);
      return message.reply('Ocorreu um erro ao remover a chave. Por favor, tente novamente mais tarde.');
    }

    if (this.changes === 0) {
      return message.reply('Chave não encontrada. Verifique se a chave está correta.');
    }
    

    const responseMessage = `A chave ${chave} foi removida com sucesso.` // Mensagem da resposta no canal onde o comando foi utilizado.
    const chaveMessage = `⛓️ Chave **Removida**! ||\`${chave}\`|| por ${message.author}`


    registeredKeys.delete(chave);
    message.reply(responseMessage);

    const chaveChannel = message.guild.channels.cache.get(chaveChannelID);
    if (chaveChannel) {
      chaveChannel.send(chaveMessage);
    } else {
      console.error(`Não foi possível encontrar o canal com ID ${chaveChannelID}. Verifique se o ID está correto.`);
    }
  });
}

module.exports = removerChave;

//   ╦ ╦╦ ╦╔═╗╦ ╦╦╔═
//   ╚╦╝║ ║╔═╝║ ║╠╩╗
//    ╩ ╚═╝╚═╝╚═╝╩ ╩ Made by yuzuk.#1000