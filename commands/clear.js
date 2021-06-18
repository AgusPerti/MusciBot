const maxClear = 100;

module.exports = {
  name: 'clear',
  aliases: ['cl'],
  description: 'Borra cierta cantidad de mensajes',

  async execute(client, msg, args, serverQueue, queue) {
    if (!args[0]) return msg.reply("Te falto ingresar un numero petón");
    if (isNaN(args[0])) return msg.reply("Ingresa un numero de verdad lctm");

    if (args[0] > 100) return msg.reply("No podes borrar mas de 100 mensajes sorete");
    if (args[0] < 1) return msg.reply("Que pasa, no me podes bugear?");

    await msg.channel.messages.fetch({limit: args[0]}).then(messages => {
      msg.channel.bulkDelete(messages);
    });
  }
}