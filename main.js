require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const figlet = require("figlet");

// Suppress deprecation warnings
process.noDeprecation = true;

// Get bot token and developer ID from .env file
const token = process.env.BOT_TOKEN;
const developerChatId = process.env.DEVELOPER_CHAT_ID;

// Verify that the environment variables are loaded correctly
if (!token || !developerChatId) {
  console.error(
    "Error: BOT_TOKEN or DEVELOPER_CHAT_ID is not set in the .env file."
  );
  process.exit(1);
}

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Function to handle new chat members
bot.on("new_chat_members", async (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const newMembers = msg.new_chat_members;

  try {
    // Attempt to delete the join message
    await bot.deleteMessage(chatId, messageId);
  } catch (error) {
    const botInfo = await bot.getMe();

    for (const member of newMembers) {
      if (member.id === botInfo.id) {
        // Send a message to the group when the bot is added
        bot.sendMessage(
          chatId,
          `Thank you for adding @${botInfo.username}. Please make me an administrator with the permission to delete messages.\n\nUse the command /status@${botInfo.username} to confirm the bot is running.\n\n(This message can be deleted)`
        );
      } else {
        const chatMember = await bot.getChatMember(chatId, botInfo.id);
        if (chatMember.status !== "administrator") {
          bot.sendMessage(
            chatId,
            "Please make me an admin in order for me to remove the join and leave messages on this group!"
          );
        }
      }
    }
  }
});

// Function to handle left chat members
bot.on("left_chat_member", async (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  const botInfo = await bot.getMe();

  if (msg.left_chat_member.id !== botInfo.id) {
    try {
      // Attempt to delete the leave message
      await bot.deleteMessage(chatId, messageId);
    } catch (error) {
      const chatMember = await bot.getChatMember(chatId, botInfo.id);
      if (chatMember.status !== "administrator") {
        bot.sendMessage(
          chatId,
          "Please make me an admin in order for me to remove the join and leave messages on this group!"
        );
      }
    }
  }
});

// Function to handle /start and /status commands
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text && text.startsWith("/start")) {
    try {
      const botInfo = await bot.getMe();
      const chat = await bot.getChat(chatId);

      if (chat.type === "private") {
        const options = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Add me to your chat!",
                  url: `https://t.me/${botInfo.username}?startgroup=true`,
                },
              ],
            ],
          },
        };
        bot.sendMessage(
          chatId,
          `To use this bot, add @${botInfo.username} as an administrator in your group.`,
          options
        );
      } else {
        const chatMember = await bot.getChatMember(chatId, botInfo.id);
        if (chatMember.status !== "administrator") {
          bot.sendMessage(
            chatId,
            `To use this bot, add @${botInfo.username} as an administrator in your group.`
          );
        }
      }
    } catch (error) {
      console.error("Failed to retrieve bot information:", error);
    }
  } else if (text && text.startsWith("/status")) {
    try {
      const botInfo = await bot.getMe();
      const chatMember = await bot.getChatMember(chatId, botInfo.id);
      if (chatMember.status === "administrator") {
        bot.sendMessage(
          chatId,
          `Success! @${botInfo.username} is running and would remove spam link automatically.`
        );
      } else {
        bot.sendMessage(
          chatId,
          `@${botInfo.username} is not an administrator. Please make the bot an admin to enable full functionality.`
        );
      }
    } catch (error) {
      console.error("Failed to check bot status:", error);
    }
  }
});

// Dynamic import for chalk-animation
(async () => {
  const chalkAnimation = await import("chalk-animation");

  // Create big header using figlet
  figlet("mesamirh", (err, data) => {
    if (err) {
      console.error("Something went wrong with figlet...");
      console.dir(err);
      return;
    }

    // Animation in terminal
    const animation = chalkAnimation.default.rainbow(data);
    setTimeout(() => {
      animation.stop(); // Stop the animation after 5 seconds
    }, 5000);
  });

  // Massage to Developer Chat ID
  try {
    await bot.sendMessage(developerChatId, "Sir, I'm wake up!");
  } catch (error) {
    if (
      error.response &&
      error.response.body &&
      error.response.body.description
    ) {
      console.error(
        "Failed to send wake-up message to developer:",
        error.response.body.description
      );
    } else {
      console.error("Failed to send wake-up message to developer:", error);
    }
  }

  console.log("Bot is running...");
})();
