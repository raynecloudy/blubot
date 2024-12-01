const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("blu")
		.setDescription("blu"),
	async execute(interaction) {
		await interaction.reply("blu");
	},
};