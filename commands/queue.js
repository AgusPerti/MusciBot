module.exports = {
  name: 'queue',
  aliases: ['q'],
  description: 'Proporciona una lista con las canciones en cola',
  
  async execute(client, msg, args, serverQueue, queue, Discord) {
    const voiceChannel = msg.member.voice.channel;
  
    if (!voiceChannel) return msg.channel.send("Tenes que estar en el canal para usar este comando");
  
    if (!serverQueue) return msg.channel.send("No hay ninguna cancion en la cola")
  
    if (!serverQueue.connection.dispatcher) {
      queue.delete(msg.guild.id);
      return msg.channel.send("Me desconectaron");
    }
  
    let currentPage = 0;

    const embeds = embedGenerator(serverQueue);

    const queueEmbed = await msg.channel.send(`Lyrics page: ${currentPage+1}/${embeds.length}`, embeds[currentPage])
    await queueEmbed.react('⬅️');
    await queueEmbed.react('➡️');
  
    const reactionFilter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && (msg.author.id === user.id)
    const collector = queueEmbed.createReactionCollector(reactionFilter);

    collector.on('collect', (reaction, user) => {
      if(reaction.emoji.name === '➡️'){
          if(currentPage < embeds.length-1){
              currentPage+=1;
              queueEmbed.edit(`Canciones pagina: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
              msg.reactions.resolve(reaction).users.remove(user)
          }
      }else if(reaction.emoji.name === '⬅️'){
          if (currentPage !== 0){
              currentPage -= 1;
              queueEmbed.edit(`Canciones pagina: ${currentPage+1}/${embeds.length}`, embeds[currentPage])
              msg.reactions.resolve(reaction).users.remove(user)
          }
      }
    })

    /*let nowPlaying = serverQueue.songs[0];
    let queueMsg = `Ahora tocando ${nowPlaying.title}\n-------------------\n`;
  
    for (let i = 1; i < serverQueue.songs.length; i++) {
      queueMsg += `${i}. ${serverQueue.songs[i].title}\n`;
    }
  
    msg.channel.send('```' + queueMsg + `Solicitada por: ` + msg.author.username + '```');*/


    function embedGenerator(serverQueue){
      const embeds = [];
      let songs = 11;
      for (let i = 1; i < serverQueue.songs.length; i += 10){
        const current = serverQueue.songs.slice(i, songs)
        songs += 10;
        let j = i-1;
        const info = current.map(song => `${++j}. [${song.title}](${song.url})`).join('\n')
        const msg = new Discord.MessageEmbed()
          .setDescription(`Ahora tocando: [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) \n ${info}`)
    
        embeds.push(msg)
      }
      return embeds;
    }
  }
}