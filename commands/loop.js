module.exports = {
    name: 'loop',
    aliases: ['l', 'lp', 'lo'],
    description: 'Reinicia la cancion que se esta tocando en ese momento',
  
    execute(client, msg, args, serverQueue, queue) {
      const voiceChannel = msg.member.voice.channel;
  
      if (!voiceChannel) return msg.channel.send("Tenes que estar en el canal para usar este comando");
  
      if (!serverQueue) return msg.channel.send("No hay ninguna cancion tocando actualmente");
  
      if (!serverQueue.connection.dispatcher) {
        queue.delete(msg.guild.id);
        return msg.channel.send("Me desconectaron");
      }
  
      if (serverQueue.loop) {
        serverQueue.loop = false;
        return msg.channel.send("Se cancelo el loop");
      }
  
      msg.channel.send("Se loopeo la cancion actual");
      serverQueue.loop = true;
    }
}