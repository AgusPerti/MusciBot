module.exports = {
    name: 'resume',
    aliases: ['r'],
    description: 'Reanuda la cancion que fue pausada previamente',
  
    execute(client, msg, args, serverQueue, queue) {
      const voiceChannel = msg.member.voice.channel;
  
      if (!voiceChannel) return msg.channel.send("Tenes que estar en el canal para usar este comando");
  
      if (!serverQueue) return msg.channel.send("No hay ninguna cancion tocando actualmente");
  
      if (!serverQueue.connection.dispatcher) {
        queue.delete(msg.guild.id);
        return msg.channel.send("Me desconectaron");
      }
  
      if (!serverQueue.connection.dispatcher.paused) return msg.channel.send("Sos boludo o sordo?")
  
      serverQueue.connection.dispatcher.resume();
      msg.channel.send("Se reanudo la cancion");
    }
}