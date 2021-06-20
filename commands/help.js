module.exports = {
    name: 'help',
    aliases: ['h', 'hl', 'hp'],
    description: "generates an embed message with all de basic information about each command",

    execute(client, msg, args, serverQueue, queue, Discord) {
        for (let key of client.commands.keys()) {
            console.log(key);
            console.log(client.commands.get(key).name);
        }

        if (args[0]) {
            if (client.commands.has(args[0])) {
                let cmdInfo = {
                    name: client.commands.get(args[0]).name,
                    aliases: client.commands.get(args[0]).aliases,
                    description: client.commands.get(args[0]).description
                };
                embedGenerator(client, args[0]);
            } else {
                return msg.reply(`No existe el comando ${args[0]}`);
            }
        }

        function embedGenerator(client, specificCommand = null) {
            let message = new Discord.MessageEmbed();
            if (specificCommand) {
                let cmdInfo = client.commands.get(specificCommand);
                message.setTitle(`Informacion sobre el comando ` + `<${specificCommand}>`)
                .addField("Descripcion ", cmdInfo.description)
                .addField("Aliases", `<${cmdInfo.aliases.join()}>`)
            } else {
                message.setTitle("Informacion de comandos")
                let musicCommands = [];
                let otherCommands = [];
                for (let key of client.commands.keys()) {
                    if (key != "help" && key != "clear") {
                        musicCommands.push(key);
                    } else {
                        otherCommands.push(key);
                    }
                }
                message.addField("Musica", musicCommands.join('\n'), true)
                .addField("Moderacion", otherCommands.join('\n'), true)
                .setFooter(`Para mas informacion sobre un comando escribi ` + `<!comando>`)
            }
            message.setThumbnail("https://cpcheatingblog.files.wordpress.com/2010/05/king.png")
            return msg.channel.send(message);
        }
    }
}