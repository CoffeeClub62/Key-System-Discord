const sqlite3 = require('sqlite3').verbose();
const { getCargoIDFromMention, generateRandomKey } = require('../Functions/functions.js');
const config = require('../config.json')
const logs = config.Logs;


const db = new sqlite3.Database('database.db');

// Cria a tabela registered_keys se ela não existir
db.run(`CREATE TABLE IF NOT EXISTS registered_keys (
  chave TEXT PRIMARY KEY,
  cargoID TEXT,
  tempo INTEGER
)`);

const chaveChannelID = `${logs}`; // Canal de logs, configure no config.json

function registrarChave(message, registeredKeys) {
  if (!message.member.permissions.has('ADMINISTRATOR')) {
    return message.reply('Você não tem permissão para usar este comando.');
  }
  
  const args = message.content.trim().split(/ +/);
  if (args.length !== 3) {
    return message.reply('Uso correto: !registrar-chave <cargo> <tempo_em_dias>');
  }

  const cargoMention = args[1];
  const cargoID = getCargoIDFromMention(cargoMention);

  if (!cargoID) {
    return message.reply('Menção de cargo inválida. Use @nome-do-cargo para mencionar o cargo corretamente.');
  }

  const tempoEmDias = parseInt(args[2]);

  if (isNaN(tempoEmDias) || tempoEmDias <= 0) {
    return message.reply('O tempo deve ser um número positivo em dias.');
  }

  const tempoEmMilissegundos = tempoEmDias * 24 * 60 * 60 * 1000;

  // Gera uma chave aleatória com 25 caracteres
  const chave = generateRandomKey(25);

  const query = 'INSERT INTO registered_keys (chave, cargoID, tempo) VALUES (?, ?, ?)';
  const values = [chave, cargoID, tempoEmMilissegundos];

  db.run(query, values, function (error) {
    if (error) {
      console.error('Erro ao inserir chave na database:', error);
      return message.reply('Ocorreu um erro ao registrar a chave. Por favor, tente novamente mais tarde.');
    }

    registeredKeys.set(chave, {
      cargoID,
      tempo: tempoEmMilissegundos,
    });

    const chaveMessage = `🔒 Chave **Registrada**! ||\`${chave}\`|| por ${message.author} | O cargo será removido após **${tempoEmDias}** dias.`;
    const responseMessage = `Chave \`${chave}\` foi registrada com sucesso na database. O cargo será removido após ${tempoEmDias} dias.`

    message.reply(responseMessage);

    const chaveChannel = message.guild.channels.cache.get(chaveChannelID);
    if (chaveChannel) {
      chaveChannel.send(chaveMessage);
    } else {
      console.error(`Não foi possível encontrar o canal com ID ${chaveChannelID}. Verifique se o ID está correto.`);
    }
  });
}

module.exports = registrarChave;

//   ╦ ╦╦ ╦╔═╗╦ ╦╦╔═
//   ╚╦╝║ ║╔═╝║ ║╠╩╗
//    ╩ ╚═╝╚═╝╚═╝╩ ╩ Made by yuzuk.#1000