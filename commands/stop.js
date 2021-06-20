module.exports = {
    name: 'stop',
    aliases: ['st', 'stp', 'sp'],
    description: 'Frena la musica haciendo que el bot abandone el chat de voz',
  
    execute(client, msg, args, serverQueue, queue) {
      const voiceChannel = msg.member.voice.channel;
  
      if (!voiceChannel) return msg.channel.send("Tenes que estar en el canal para usar este comando");
  
      if (!serverQueue) return msg.channel.send("No hay ninguna cancion");
  
      if (!serverQueue.connection.dispatcher) {
        queue.delete(msg.guild.id);
        return msg.channel.send("Me desconectaron");
      }
  
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
    }
}