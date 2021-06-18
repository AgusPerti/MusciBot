const fs = require('fs');

module.exports = (client, Discord) => {
    const loadDirectorys = (directorys) => {
      const eventFiles = fs.readdirSync(`./events/${directorys}`).filter(file => file.endsWith('.js'));
      for (const file of eventFiles) {
        const event = require(`../events/${directorys}/${file}`);
        const eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, Discord, client));
      }
    }
  
    ['client', 'guild'].forEach(e => loadDirectorys(e));
}