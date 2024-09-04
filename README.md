# Join Group Message Remover Bot

Join Group Message Remover Bot is a Telegram bot designed to automatically remove join and leave messages in group chats. This bot helps keep your group chat clean and free from clutter by deleting these notifications.

## Features

- Automatically deletes join and leave messages in group chats.
- Sends a welcome message when added to a group, requesting admin permissions.
- Provides a status command to check if the bot is running and has the necessary permissions.
- Inline keyboard button to easily add the bot to new groups.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Telegram Bot Token (You can get this by creating a bot on [BotFather](https://core.telegram.org/bots#botfather))

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/joingroupmassageremovetg.git
    cd joingroupmassageremovetg
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your bot token and developer chat ID:

    ```env
    BOT_TOKEN=your-telegram-bot-token
    DEVELOPER_CHAT_ID=your-developer-chat-id
    ```

4. Run the bot:

    ```sh
    node main.js
    ```

## Usage

### Adding the Bot to a Group

1. Add the bot to your group.
2. Make the bot an administrator with the permission to delete messages.
3. The bot will automatically start deleting join and leave messages.

### Bot Commands

- `/start`: Provides instructions on how to use the bot.
- `/status@botusername`: Checks if the bot is running and has the necessary permissions.