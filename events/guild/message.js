module.exports = (Discord, client, msg) => {
    const prefix = '!';
  
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  
    const serverQueue = client.queue.get(msg.guild.id);
    const args = msg.content.slice(prefix.length).split(' ');
    const cmd = args.shift().toLowerCase();
  
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
  
    if (command) {
      command.execute(client, msg, args, serverQueue, client.queue, Discord);
    } else {
      msg.reply('No existe ese comando pipi');
    }
}