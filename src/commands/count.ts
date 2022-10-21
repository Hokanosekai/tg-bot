import { Command } from "../structures/command";

export default new Command({
  name: "count",
  description: "Count the total number of insults said",
  isLoaded: true,
  run: async (options) => {
    const { interaction, client } = options;

    const count = await client.database.user.createQueryBuilder()
      .select("SUM(messages_count)", "count")
      .getRawOne();

    interaction.reply({ content: `${count.count} insults said so far!` });
  }
})