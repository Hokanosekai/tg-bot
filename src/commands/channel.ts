import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../structures/command";

export default new Command({
  name: "channel",
  description: "Add, Remove or List channels where the bot will send insults",
  options: [
    {
      name: "add",
      description: "Add a channel where the bot will send insults",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "The channel where the bot will send insults",
          type: ApplicationCommandOptionType.Channel,
          required: true
        }
      ],
    },
    {
      name: "remove",
      description: "Remove a channel where the bot will send insults",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "The channel where the bot will send insults",
          type: ApplicationCommandOptionType.Channel,
          required: true
        }
      ],
    },
    {
      name: "list",
      description: "List all channels where the bot will send insults",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  isLoaded: true,
  run: async (options) => {
    const { interaction, client, user, args } = options;

    const subcommand = args.getSubcommand();

    if (subcommand === "add") {
      const channel = args.getChannel("channel");

      if (!channel) return interaction.reply({ content: "You must provide a channel", ephemeral: true });

      const channelExists = await client.database.channel.findOne({
        where: {
          id: channel.id
        }
      });

      if (channelExists) return interaction.reply({ content: "This channel is already in the database", ephemeral: true });

      const newChannel = await client.database.channel.create({
        id: channel.id,
        name: channel.name,
        guildId: channel.id
      });
      await client.database.channel.save(newChannel);

      return await interaction.reply({ content: `Channel ${channel} added to the database`, ephemeral: true });

    } else if (subcommand === "remove") {
      const channel = args.getChannel("channel");

      if (!channel) return interaction.reply({ content: "You must provide a channel", ephemeral: true });

      const channelExists = await client.database.channel.findOne({
        where: {
          id: channel.id
        }
      });

      if (!channelExists) return interaction.reply({ content: "This channel is not in the database", ephemeral: true });

      await client.database.channel.remove(channelExists);

      return await interaction.reply({ content: `Channel ${channel} removed from the database`, ephemeral: true });

    } else if (subcommand === "list") {
      const channels = await client.database.channel.find();

      if (channels.length === 0) return interaction.reply({ content: "There are no channels in the database", ephemeral: true });

      const channelList = channels.map((channel) => `<#${channel.id}>`).join("\n");

      return await interaction.reply({ content: `Channels in the database:\n${channelList}`, ephemeral: true });
    }

    return interaction.reply({ content: "There was an error executing that command.", ephemeral: true });
  }
})