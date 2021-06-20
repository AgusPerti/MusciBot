module.exports = {
    name: 'help',
    aliases: ['h', 'hl'],
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
                message.setTitle(`Informacion sobre ${specificCommand}`)
                .addField("hola")
            }
        }
    }
}