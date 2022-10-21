import { EmbedBuilder } from "discord.js";
import { Command } from "../structures/command";

export default new Command({
  name: "users",
  description: "View top 10 users with the most insults",
  isLoaded: true,
  run: async (options) => {
    const { interaction, client } = options;
      
      const users = await client.database.user.find({
        order: {
          messagesCount: "DESC"
        },
      });

      const top10 = users.slice(0, 10);
  
      const embed = new EmbedBuilder()
        .setTitle("Top 10 users with the most insults")
        .setColor("#FF0000")
        .setTimestamp();
  
      embed.addFields(top10.map((user, index) => ({
        name: `#${index + 1}`, 
        value: `<@${user.id}> - ${user.messagesCount} insults`
      })));
  
      interaction.reply({ embeds: [embed] });
  }
})