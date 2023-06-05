const { getCargoIDFromMention } = require('../Functions/functions.js');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json')
const logs = config.Logs;

const db = new sqlite3.Database('database.db');

function resgatarChave(message, registeredKeys) {
  const args = message.content.trim().split(/ +/);
  if (args.length !== 2) {
    return message.reply('Uso correto: !resgatar-chave <chave>');
  }

  const chave = args[1];
  const chaveChannelID = `${logs}`; // Canal de logs, configure no config.json

  const querySelect = 'SELECT cargoID, tempo FROM registered_keys WHERE chave = ?';
  const queryDelete = 'DELETE FROM registered_keys WHERE chave = ?';

  db.get(querySelect, [chave], function (error, row) {
    if (error) {
      console.error('Erro ao consultar a chave na database:', error);
      return message.reply('Ocorreu um erro ao resgatar a chave. Por favor, tente novamente mais tarde.');
    }

    if (!row) {
      return message.reply('Chave **inválida** ou **expirada**.');
    }

    const { cargoID, tempo } = row;
    const cargo = message.guild.roles.cache.get(cargoID);

    if (!cargo) {
      return message.reply('O cargo associado à chave **não foi encontrado**.');
    }

    message.member.roles.add(cargo)
      .then(() => {
        const tempoEmMilissegundos = tempo;
        const tempoEmDias = tempoEmMilissegundos / (24 * 60 * 60 * 1000);
        const chaveMessage = `🔓 Chave **Resgatada**! ||\`${chave}\`|| por ${message.author}`
        const resgateMessage = `Cargo \`${cargo.name}\` adicionado com sucesso por ${tempoEmDias} dia(s).`

        message.reply(resgateMessage);

        const chaveChannel = message.guild.channels.cache.get(chaveChannelID);
        if (chaveChannel) {
          chaveChannel.send(chaveMessage);
        } else {
          console.error(`Não foi possível encontrar o canal com ID ${chaveChannelID}. Verifique se o ID está correto.`);
        }

        setTimeout(() => {
          message.member.roles.remove(cargo)
            .then(() => {
              message.reply(`Cargo ${cargo.name} removido após ${tempoEmDias} dias.`);
            })
            .catch(console.error);
        }, tempoEmMilissegundos);

        db.run(queryDelete, [chave], function (error) {
          if (error) {
            console.error('Erro ao remover a chave da database:', error);
          }
        });
      })
      .catch(console.error);
  });
}

module.exports = resgatarChave;

//   ╦ ╦╦ ╦╔═╗╦ ╦╦╔═
//   ╚╦╝║ ║╔═╝║ ║╠╩╗
//    ╩ ╚═╝╚═╝╚═╝╩ ╩ Made by yuzuk.#1000