module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'Proporciona una lista con las canciones en cola',
  
    execute(client, msg, args, serverQueue, queue) {
      const voiceChannel = msg.member.voice.channel;
  
      if (!voiceChannel) return msg.channel.send("Tenes que estar en el canal para usar este comando");
  
      if (!serverQueue) return msg.channel.send("No hay ninguna cancion en la cola")
  
      if (!serverQueue.connection.dispatcher) {
        queue.delete(msg.guild.id);
        return msg.channel.send("Me desconectaron");
      }
  
      
  
      let nowPlaying = serverQueue.songs[0];
      let queueMsg = `Ahora tocando ${nowPlaying.title}\n-------------------\n`;
  
      for (let i = 1; i < serverQueue.songs.length; i++) {
        queueMsg += `${i}. ${serverQueue.songs[i].title}\n`;
      }
  
      msg.channel.send('```' + queueMsg + `Solicitada por: ` + msg.author.username + '```');
    }
}