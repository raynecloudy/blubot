const dotenv = require("dotenv");
dotenv.config();

const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits, Partials, AttachmentBuilder, Events, Collection } = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");

const client = new Client({
	intents: [
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.AutoModerationExecution,
		GatewayIntentBits.DirectMessagePolls,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessagePolls,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent
	],
	partials: [
		Partials.Channel,
		Partials.GuildMember,
		Partials.GuildScheduledEvent,
		Partials.Message,
		Partials.Reaction,
		Partials.ThreadMember,
		Partials.User
	]
});

client.login(process.env.TOKEN);

const welcomes = [
	"welcome to the blult, [user]! you're member #[num]",
	"everybody say hi to member #[num], [user]",
	"yo [user]"
];

client.on("ready", async () => {
	console.log("yippee");
});

client.on("guildMemberAdd", async (user) => {
	client.channels.fetch("1309771757401673769").then(channel => channel.send(welcomes[Math.floor(Math.random() * welcomes.length)].replace(/\[user\]/g, `<@${user.id}>`).replace(/\[num\]/g, client.guilds.cache.get("1309762020291117117").memberCount)));
});

client.on("guildMemberRemove", async (user) => {
	client.channels.fetch("1309771757401673769").then(channel => channel.send(`**${user.displayName}** has left the blult`));
});

client.on("messageCreate", async (message) => {
	if (message.content.includes(`<@${client.user.id}>`)) {
		if (message.content.includes("hru") || message.content.includes("how are you") || message.content.includes("how are u") || message.content.includes("how r you") || message.content.includes("how r u")) {
			message.reply("i'm feeling very blu today (not the sad way)");
		}
		if (message.content === `<@${client.user.id}>`) {
			message.reply("hi");
		}
	}
});

client.on("messageReactionAdd", async (reaction, user) => {
	if (reaction.partial) {
		await reaction.fetch();
	}
	if ((user.id === reaction.message.author.id && reaction.emoji.id === "1309788164118020137")) {
		await reaction.users.remove(user);
	}
	console.log(reaction.emoji.name + reaction.count);
	if (reaction.emoji.id === "1309788164118020137" && reaction.count === 3 && reaction.message.channelId !== "1309788403214057523") {
		const channel = await client.channels.fetch("1309788403214057523");
		const embed = new EmbedBuilder()
			.setColor(0x0000ff)
			.setAuthor({ name: reaction.message.author.displayName, iconURL: `https://cdn.discordapp.com/avatars/${reaction.message.author.id}/${reaction.message.author.avatar}`, url: `https://discordapp.com/users/${reaction.message.author.id}` })
			.setDescription(reaction.message.content)
			.setTimestamp()
		channel.send({ content: `<@${reaction.message.author.id}> ${reaction.message.url}`, embeds: [embed] });
	}
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] the command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const cmd = interaction.client.commands.get(interaction.commandName);
		if (!cmd) {
			await interaction.reply({ content: "command not found", ephemeral: true });
		}
		try {
			await cmd.execute(interaction);
		} catch (err) {
			await interaction.reply({ content: `error running command: \`${err}\``, ephemeral: true });
		}
	}
});