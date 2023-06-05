const { Client, Intents } = require('discord.js');
const config = require('./config.json');
const prefix = config.Prefix;
const registrarChave = require('./Comandos/registrar-chave.js');
const resgatarChave = require('./Comandos/resgatar-chave.js');
const exibirChaves = require('./Comandos/checar-chaves');
const removerChave = require('./Comandos/remover-chave.js');
const registeredKeys = new Map();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
  console.log(`[✅] SUCESSO! - Logado em ${client.user.username}`);
  console.log('[💼] Made by yuzuk.#1000')
  client.user.setActivity('Key System', { type: 'WATCHING' }); // Playing or Watching
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(`${prefix}registrar-chave`)) {
    registrarChave(message, registeredKeys);
  } // Comando para registrar a chave.

  if (message.content.startsWith(`${prefix}remover-chave`)) {
    removerChave(message, registeredKeys);
  } // Comando para remover a chave.

  if (message.content.startsWith(`${prefix}checar-chaves`)) {
    exibirChaves(message, registeredKeys);
  } // Comando para checar as chaves criadas / tempo & cargo.

  if (message.content.startsWith(`${prefix}resgatar-chave`)) {
    resgatarChave(message, registeredKeys);
  } // Comando para resgatar a chave.
});

client.login(config.Token);

//   ╦ ╦╦ ╦╔═╗╦ ╦╦╔═
//   ╚╦╝║ ║╔═╝║ ║╠╩╗
//    ╩ ╚═╝╚═╝╚═╝╩ ╩ Made by yuzuk.#1000