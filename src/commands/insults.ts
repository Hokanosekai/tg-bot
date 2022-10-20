import { EmbedBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType, Embed } from "discord.js";
import { Command } from "../structures/command";
import { DiscordSnowflake } from "@sapphire/snowflake";

export default new Command({
  name: "insult",
  description: "Add, Remove or List insults",
  options: [
    {
      name: "add",
      description: "Add an insult",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "insult",
          description: "The insult",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ],
    },
    {
      name: "remove",
      description: "Remove an insult",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The insult id",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ],
    },
    {
      name: "list",
      description: "List all insults",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  isLoaded: true,
  run: async (options) => {
    const { interaction, client, user, args } = options;

    const subcommand = args.getSubcommand();

    if (subcommand === "add") {
      const insult = args.getString("insult");

      if (!insult) return interaction.reply({ content: "You must provide an insult", ephemeral: true });

      const insultExists = await client.database.insult.findOne({
        where: {
          insult
        }
      });

      if (insultExists) return interaction.reply({ content: "This insult is already in the database", ephemeral: true });

      const newInsult = await client.database.insult.create({
        id: DiscordSnowflake.generate().toString(),
        insult,
        author: user,
      });
      await client.database.insult.save(newInsult);

      interaction.reply({ content: "Insult added to the database", ephemeral: true });
    }

    if (subcommand === "remove") {
      const id = args.getString("id");

      if (!id) return interaction.reply({ content: "You must provide an id", ephemeral: true });

      const insult = await client.database.insult.findOne({
        where: {
          id
        }
      });

      if (!insult) return interaction.reply({ content: "This insult doesn't exist in the database", ephemeral: true });

      await client.database.insult.remove(insult);

      interaction.reply({ content: "Insult removed from the database", ephemeral: true });
    }

    if (subcommand === "list") {
      const insults = await client.database.insult.find();

      const embed = new EmbedBuilder()
        .setTitle("Insults")
        .setDescription(insults.map((insult) => `${insult.id} - ${insult.insult}`).join("\n"));

      interaction.reply({ embeds: [embed] });
    }
  }
});