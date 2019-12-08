const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = '/'

client.on('ready', () => {
  console.log(`Bot has been planted, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`En route sur ${client.guilds.size} serveurs`)
});

//-------------------------------------------------------

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`En route sur ${client.guilds.size} serveurs`);
});

//-----------------------------------------------------

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`En route sur ${client.guilds.size} serveurs`);
});

//----------------------------------------------------

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  if (!newUsers[guild.id]) newUsers[guild.id] = new Discord.Collection();
  newUsers[guild.id].set(member.id, member.user);

  if (newUsers[guild.id].size > 10) {
    const userlist = newUsers[guild.id].map(u => u.toString()).join(" ");
    guild.channels.find(channel => channel.name === "general").send("Welcome our new users!\n" + userlist);
    newUsers[guild.id].clear();
  }
});

//---------------------------------------------------

client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  if (newUsers[guild.id].has(member.id)) newUsers.delete(member.id);
});

//---------------------------------------------------

client.on("message", async message => {

  if (message.author.bot) return;

  if (message.content === `${prefix}ping`) {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    console.log('Used command : ping')

  } else if (message.content === `${prefix}beep`) {
    message.channel.send('Boop.');
    console.log('Used command : beep')

  } else if (message.content === `${prefix}server`) {
    message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    console.log('Used command : server')

  } else if (message.content === `${prefix}userinfo`) {
    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    console.log('Used command : userinfo')

  } else if (message.content.startsWith`/anonymeurl`) {
    message.channel.send(message.attachments.url);
    console.log('Used command : anonyme url')

  } else if (message.content === `${prefix}heure`) {
    message.channel.send(`${message.createdTimestamp} \n Utilise ce site pour consulter la date !! :joy: : https://pixelatomy.com/snow-stamp/`);
    console.log('Used command : heure')

  } else if (message.content.startsWith(`${prefix}bannir`)) {
    console.log('Used command : bannir')
    const args = message.content.split(' ').slice(1); // All arguments behind the command name with the prefix
    const user = message.mentions.users.first(); // returns the user object if an user mention exists
    const banReason = args.slice(1).join(' '); // Reason of the ban (Everything behind the mention)

    // Check if an user mention exists in this message
    if (!user) {
      try {
        // Check if a valid userID has been entered instead of a Discord user mention
        if (!message.guild.members.get(args.slice(0, 1).join(' '))) throw new Error('Couldn\' get a Discord user with this userID!');
        // If the client (bot) can get a user with this userID, it overwrites the current user variable to the user object that the client fetched
        user = message.guild.members.get(args.slice(0, 1).join(' '));
        user = user.user;
      } catch (error) {
        return message.reply('Couldn\' get a Discord user with this userID!');
      }
    }
    if (user === message.author) return message.channel.send('You can\'t ban yourself'); // Check if the user mention or the entered userID is the message author himsmelf
    if (!reason) return message.reply('You forgot to enter a reason for this ban!'); // Check if a reason has been given by the message author
    if (!message.guild.member(user).bannable) return message.reply('You can\'t ban this user because you the bot has not sufficient permissions!'); // Check if the user is bannable with the bot's permissions

  } else if (message.content.startsWith(`${prefix}kill`)) {
    console.log('Used command : KILL')
    const args = message.content.split(' ').slice(1);
    const user = message.mentions.users.first();

    if (!user) {
      try {
        if (!message.guild.members.get(args.slice(0, 1).join(' '))) throw new Error('Couldn\' get a Discord user with this userID!');
        user = message.guild.members.get(args.slice(0, 1).join(' '));
        user = user.user;
      } catch (error) {
        return message.reply('Couldn\' get a Discord user with this userID!');
      }
    }
    if (user === message.author) return message.channel.send('You can\'t kill yourself (stupid human...)');

    if (!message.author.hasPermission('ADMINISTRATOR')) {
      message.guild.member(user).addRoles(['623565775394963483', '623846251112300544'])
        .then(console.log)
        .catch(console.error);

      return message.reply(`Non mais oh, tu te prends pour qui toi ?! Allez hop /KARMA, Mute pour ${message.author} :joy:. Ca t'apprendears !! :joy: :joy: :joy:`)
    }
  }
});

//--------------------------------------------------------



//--------------------------------------------------------

client.login(process.env.TOKEN);
