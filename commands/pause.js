module.exports = {
    name: 'pause',
    aliases: ['ps'],
    description: 'Pausa la cancion que se esta tocando en ese momento',
  
    execute(client, msg, args, serverQueue, queue) {
      const voiceChannel = msg.member.voice.channel;
  
      if (!voiceChannel) return msg.channel.send("Tenes que estar en el canal para usar este comando");
  
      if (!serverQueue) return msg.channel.send("No hay ninguna cancion tocando actualmente");
  
      if (!serverQueue.connection.dispatcher) {
        queue.delete(msg.guild.id);
        return msg.channel.send("Me desconectaron");
      }
  
      if (serverQueue.connection.dispatcher.paused) return msg.channel.send("La cancion ya esta pausada")
  
      serverQueue.connection.dispatcher.pause();
      msg.channel.send("Se pauso la cancion");
    }
}