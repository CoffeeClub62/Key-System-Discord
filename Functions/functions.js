function getCargoIDFromMention(mention) {
    const matches = mention.match(/^<@&(\d+)>$/);
    if (!matches) return null;
    return matches[1];
  }
  
  function generateRandomKey(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let key = '';
    for (let i = 0; i < length; i++) {
      if (i > 0 && i % 5 === 0) {
        key += '-';
      }
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
    }
    return key;
  }
  
  module.exports = {
    getCargoIDFromMention,
    generateRandomKey,
  };
  
//   ╦ ╦╦ ╦╔═╗╦ ╦╦╔═
//   ╚╦╝║ ║╔═╝║ ║╠╩╗
//    ╩ ╚═╝╚═╝╚═╝╩ ╩ Made by yuzuk.#1000