import { CommandInteractionOptionResolver } from 'discord.js';
import { client } from '..';
import { Event } from '../structures/event';
import { ExtendedInteraction } from '../types/command.type';

export default new Event({
  event: "interactionCreate",
  isLoaded: true,
  execute: async (interaction) => {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return interaction.reply({ content: "There was an error executing that command.", ephemeral: true });

      let user = await client.database.user.findOne({
        where: {
          id: interaction.user.id
        }
      });

      if (!user) {
        user = await client.database.user.create({
          id: interaction.user.id,
          messagesCount: 0,
          points: 0,
          level: 0
        });
        await client.database.user.save(user);
      }

      try {
        command.run({
          interaction: interaction as ExtendedInteraction,
          client,
          user,
          args: interaction.options as CommandInteractionOptionResolver,
        });
      } catch (error) {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  }
});