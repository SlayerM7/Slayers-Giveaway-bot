const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const ms = require('ms');
const { prefix, token, main_color: color } = require('./config.json')
client.on("ready", () => {
    console.log('Ready!');
});

client.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLocaleLowerCase();

    if (command === 'gstart') {
        // !gstart [time] [channel] [prize]

        let time = args[0];
        let channel = message.mentions.channels.first();
        let prize = args.slice(2).join(" ");
        if (!time) {
            await message.channel.send('Starting automatic setup...').then(m => {
                setTimeout(() => {
                    m.edit('How long do u want the giveaway to be? \n Examples: `1d` `2h` `5m`').then(() => {
                        const filter = m => message.author.id = m.author.id;

                        message.channel.awaitMessages(filter, { time: '15000', max: 1, errors: ['time'] })
                            .then(messages => {
                                if (messages.first().content) {
                                    time = messages.first().content;
                                    message.channel.send('Where would you like this giveaway to be?').then(() => {
                                        message.channel.awaitMessages(filter, { time: "15000", max: 1, errors: ['time'] })
                                            .then(msg => {

                                                if (msg.first().content) {
                                                    channel = msg.first().channel.id;
                                                    message.channel.send('What is the prize of this giveaway?').then(() => {
                                                        message.channel.awaitMessages(filter, { time: '15000', max: 1, errors: ['time'] })
                                                            .then(mg => {
                                                                if (mg.first().content) {
                                                                    prize = mg.first().content
                                                                    console.log(channel)
                                                                    const giveAwayEmbed = new MessageEmbed()
                                                                        .setColor(color)
                                                                        .setDescription(`**${prize}** \n \n React with 🎉to enter! \n Time: ${time} \n Hosted by: <@${message.author.id}>`)
                                                                        .setFooter('Make sure to join!');
                                                                    message.guild.channels.cache.get(channel).send("🎉 New giveaway! 🎉", giveAwayEmbed).then(mgs => {
                                                                        mgs.react('🎉').then(x => {
                                                                            setTimeout(() => {
                                                                                let winner = x.users.cache.random().id;

                                                                                message.guild.channels.cache.get(channel).send(`Congrats <@${winner}>! You won the **${prize}**`);
                                                                            }, ms(time));
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                    })
                                                }
                                            })
                                    })
                                }
                            })
                    })
                }, 3 * 1000)
            })
        }
    };
    
})

client.login(token)