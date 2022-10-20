import { client } from "..";
import { Insult } from "../entities/insult.entity";
import { Event } from "../structures/event"
import { Level } from "../types/constants/level.constant";

export default new Event({
  event: "messageCreate",
  isLoaded: true,
  execute: async (message) => {
    console.log(message);
    if (message.author.bot) return;

    if (await client.database.channel.count({
      where: {
        id: message.channelId
      }
    }) === 0) return;

    const insult = await client.database.insult.createQueryBuilder("insult")
      .addSelect("RAND()", "random")
      .orderBy("random")
      .getOne();

    console.log(insult);

    if (insult) {
      await message.reply({
        content: insult.insult,
        allowedMentions: {
          repliedUser: false
        }
      });
    }

    let user = await client.database.user.findOne({
      where: {
        id: message.author.id
      }
    });

    if (user) {
      user.messagesCount++;
    } else {
      user = await client.database.user.create({
        id: message.author.id,
        messagesCount: 1,
        points: 0,
        level: 0
      });
    }

    let currentLevel = Level[user.level];
    Object.keys(Level).forEach(async (key) => {
      const level = Level[key];

      if (user.messagesCount === level[0]) {
        user.level = Number(key);
        user.points += 10 * level[1];
        await message.channel.send({
          content: `Congratulations ${message.author}! You have reached level ${user.level}!`
        });
      }

      if (user.messagesCount >= level[0]) {
        currentLevel = level;
      }
    });

    user.points += 1 * currentLevel[1];

    await client.database.user.save(user);
  }
})