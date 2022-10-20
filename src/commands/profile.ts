import { APIEmbedField, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../structures/command";
import { Level } from "../types/constants/level.constant";

export default new Command({
  name: "profile",
  description: "View profile",
  options: [
    {
      name: "user",
      description: "The user to view",
      type: ApplicationCommandOptionType.User,
      required: false
    }
  ],
  isLoaded: true,
  run: async (options) => {
    const { interaction, client, user, args } = options;

    const target = args.getUser("user") || interaction.user;

    const targetUser = await client.database.user.findOne({
      where: {
        id: target.id
      }
    });

    if (!targetUser) return interaction.reply({ content: "This user is not in the database", ephemeral: true });

    const nextLevel = Level[targetUser.level + 1];
    const percentage = Math.round((targetUser.messagesCount * 100) / nextLevel[0]);
    const nbEmojis = Math.round((percentage * 20) / 100);
    
    const guild = await client.guilds.fetch("744192330344431797");

    const fillEmoji = guild.emojis.cache.find(emoji => emoji.name === "tgs");
    const lineEmoji = guild.emojis.cache.find(emoji => emoji.name === "tgl");
    const spaceEmoji = guild.emojis.cache.find(emoji => emoji.name === "tgspace");

    const embed = new EmbedBuilder()
      .setTitle(`${target.username}'s profile`)
      .setDescription(`${(`${spaceEmoji}`.repeat(8))}:trident: **LEVEL ${targetUser.level}** :trident:\n\n\n`)
      .setColor("#ff0000")
      .addFields({
        name: `**${targetUser.level}** ---> **${targetUser.level + 1}** [${percentage.toFixed(2)}%]`,
        value: `**[**${`${fillEmoji}`.repeat(nbEmojis)}${`${lineEmoji}`.repeat(20 - nbEmojis)}**]**`,
      },
      {
        name: "Messages count",
        value: `${targetUser.messagesCount}`,
        inline: true
      },
      {
        name: "Points",
        value: `${targetUser.points}`,
        inline: true
      })
      .setThumbnail(target.displayAvatarURL({ size: 512 }));

    interaction.reply({ embeds: [embed] });
  }
});