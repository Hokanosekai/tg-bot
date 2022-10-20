import { Command } from "../structures/command";

export default new Command({
  name: "count",
  description: "Count the number of insults said",
  isLoaded: true,
  run: async (options) => {
    const { interaction, client } = options;
  }
})