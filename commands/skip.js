module.exports = {
    name: 'skip',
    aliases: ['s', 'sk', 'skp'],
    description: 'Salta a la cancion siguiente',
  
    execute(client, msg, args, serverQueue, queue) {
      const voiceChannel = msg.member.voice.channel;
  
      if (!voiceChannel) return msg.channel.send("Tenes que estar en el canal para usar este comando");
  
      if (!serverQueue) return msg.channel.send("No hay ninguna cancion");
  
      if (!serverQueue.connection.dispatcher) {
        queue.delete(msg.guild.id);
        return msg.channel.send("Me desconectaron");
      }
  
      if (serverQueue.connection.dispatcher.paused) serverQueue.connection.dispatcher.resume();
  
      serverQueue.connection.dispatcher.end();
    }
}