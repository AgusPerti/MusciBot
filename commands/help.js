module.exports = {
    name: 'help',
    aliases: ['h', 'hl'],
    description: "generates an embed message with all de basic information about each command",

    execute(client, msg, args, serverQueue, queue, Discord) {
        for (let key of client.commands.keys()) {
            console.log(key);
        }
        
        if (args[0]) {
            return;
        }
    }
}