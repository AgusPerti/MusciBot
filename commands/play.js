const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const ytpl = require('ytpl');

let timer;

module.exports = {
    name: 'play',
    aliases: ['p', 'pl', 'py'],
    description: 'Se mete al chat de voz y pone la cancion solicitada',
  
    async execute(client, msg, args, serverQueue, queue, Discord) {
      const vC = msg.member.voice.channel;
      if (!vC) return msg.channel.send("Tenes que estar en el canal para usar este comando");
      
      const permissions = vC.permissionsFor(msg.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return msg.channel.send("No tenes los permisos necesarios");
      if (!args.length) return msg.channel.send("Te falta poner el nombre/link de la cancion tontito");
  
      const joinedArgs = args.join(' ');
  
      const videoFinder = async (query) => {
        let result = await ytSearch(joinedArgs);
        
        if (result.videos.length > 1) {
          return result.videos[0];
        }
        return null;
      }
  
      /*const validURL = (str) =>{
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if(!regex.test(str)){
          return false;
        } else {
          return true;
        }
      }*/
  
      /*Me fijo si es un url de playlist*/
      if (joinedArgs.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        try {
          await ytpl(joinedArgs).then(async playlist => {
            embedSong(false, true, playlist);
            playlist.items.forEach(async item => {
              await videoHandler(await ytdl.getInfo(item.shortUrl), msg, vC, true);
            })
          })
        } catch (err) {
          console.error(err);
          return msg.channel.send(`Por favor inserta un link valido o asegurate de que la playlist sea publica\n${err}`);
        }
        
      } else {
        let video = await videoFinder(joinedArgs);
        if (!video) return msg.channel.send("No se encontro ningun resultado");

        try {
          let songInfo = await ytdl.getInfo(video.url);
          return videoHandler(songInfo, msg, vC);
        } catch (err) {
          msg.channel.send(`No se pudo agregar la cancion\n${err}`);
        } 
      }
   
      async function videoHandler(songInfo, msg, vC, playlist = false) {
        let song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          vLength: songInfo.videoDetails.lengthSeconds,
          thumbnail: songInfo.videoDetails.thumbnails[3].url
        };
      
        if (!serverQueue) {
          const queueConstructor = {
            txtChannel: msg.channel,
            voiceChannel: vC,
            connection: null,
            songs: [],
            volume: 10,
            playing: true,
            loop: false
          };
  
          queue.set(msg.guild.id, queueConstructor);
          queueConstructor.songs.push(song);
  
          try {
            let connection = await queueConstructor.voiceChannel.join();
            queueConstructor.connection = connection;
            msg.guild.me.voice.setSelfDeaf(true);
            play(msg.guild, queueConstructor.songs[0]);
          } catch (err) {
            console.error(err);
            queue.delete(msg.guild.id);
            return msg.channel.send(`No me pude unir al chat de voz ${err}`);
          }
        } else {
          serverQueue.songs.push(song);
          if (serverQueue.songs.length === 1) {
            play(msg.guild, queueConstructor.songs[0]);
          }

          if (playlist) return undefined;
          embedSong(true, false, song);
        }
      }
  
  
      /*Busco la cancion*/
      /*let result = await searcher.search(args.join(' '), { type: "video"});
      const songInfo = await ytdl.getInfo(result.first.url);*/ // necesito una api :(
  
      function embedSong(isQueue, isPlaylist, song) {
        let dur = `${parseInt(song.vLength / 60)}:${song.vLength - 60 * parseInt(song.vLength / 60)}`;
        let message = new Discord.MessageEmbed();
  
        if (isQueue) {
          message.setTitle("Cancion agregada")
          .addField(song.title, "_____")
          .addField("Duracion de la cancion: ", dur)
          //.setColor("PURPLE")
        } else if (isPlaylist) {
          message.setTitle("Playlist agregada")
          .addField(song.title, "_____")
          .addField("Descripcion: ", song.description)
          .addField("Cantidad de canciones: ", song.estimatedItemCount)
        } else {
          message.setTitle("Ahora tocando")
          .addField(song.title, "_____")
          .addField("Duracion de la cancion: ", dur)
          //.setColor("PURPLE")
        }
        
        message.setThumbnail(song.thumbnail);
        message.setColor("RANDOM");
        return msg.channel.send(message);
      }
  
      function play(guild, song) {
        const serverQueue = queue.get(guild.id);
        if (!song) {
          timer = setTimeout(function() {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
          }, 5000)
          return;
        }

          const dispatcher = serverQueue.connection
          .play(ytdl(song.url))
          .on('finish', () => {
            if (serverQueue.loop === true) {
              play(guild, serverQueue.songs[0]);
              serverQueue.loop = false;
            } else {
              serverQueue.songs.shift();
              play(guild, serverQueue.songs[0]);
            }
          })
  
          embedSong(false, false, serverQueue.songs[0]);
      }
    } 
}