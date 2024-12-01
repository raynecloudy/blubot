const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");

const facts = [
	"the russian language doesn't have a word for the hue blue. instead, they have *goluboy* for light blue and *siniy* for dark blue.",
	"in japan, traffic lights use blue instead of green.",
	"blue cheese was discovered when a man accidentally left a piece of cheese behind in a cave. when he returned and tasted it, he liked it.",
	"blue LEDs were almost impossible to create."
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName("fun-fact")
		.setDescription("displays a fun fact about the colour blu"),
	async execute(interaction) {
		if (Math.random() >= 0.99) {
			await interaction.reply({ content: "THE SKY IS BLUE :speaking_head::speaking_head::speaking_head::fire::fire:", files: [new AttachmentBuilder().setFile("https://breakfast.nekoweb.org/media/blubot-woah.png").setName("mfw-the-sky-is-blue.png")] });
		} else {
			await interaction.reply(facts[Math.floor(Math.random() * facts.length)]);
		}
	},
};