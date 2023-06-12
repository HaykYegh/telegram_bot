const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.PORT || '6105582120:AAEsi9Wj7MhlFhUMH6oSeLhfNQf_uPF5K7M', { polling: true });

// Store user data in memory (replace with a proper database in production)
const users = {};

// Register command handler for /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (users[userId]) {
    bot.sendMessage(chatId, 'You are already registered.');
  } else {
    bot.sendMessage(chatId, 'Welcome! Please enter your username:');
    // Set up the registration flow
    bot.once('message', (msg) => {
      const username = msg.text;
      bot.sendMessage(chatId, 'Please enter your email:');
      bot.once('message', (msg) => {
        const email = msg.text;
        bot.sendMessage(chatId, 'Please enter your age:');
        bot.once('message', (msg) => {
          const age = msg.text;
          bot.sendMessage(chatId, 'Please enter your gender:');
          bot.once('message', (msg) => {
            const gender = msg.text;

            // Store the user data
            users[userId] = { username, email, age, gender };
            bot.sendMessage(chatId, 'Registration complete!');
          });
        });
      });
    });
  }
});

// Register command handler for /login
bot.onText(/\/login/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (users[userId]) {
    const user = users[userId];
    const userInfo = `Username: ${user.username}\nEmail: ${user.email}\nAge: ${user.age}\nGender: ${user.gender}`;
    bot.sendMessage(chatId, `You are already logged in.\n\n${userInfo}`);
  } else {
    bot.sendMessage(chatId, 'Please enter your username to log in:');
    // Set up the login flow
    bot.once('message', (msg) => {
      const username = msg.text;
      // Check if the entered username matches the registered username
      if (users[userId] && users[userId].username === username) {
        const user = users[userId];
        const userInfo = `Username: ${user.username}\nEmail: ${user.email}\nAge: ${user.age}\nGender: ${user.gender}`;
        bot.sendMessage(chatId, `Welcome back, ${username}! You are now logged in.\n\n${userInfo}`);
      } else {
        bot.sendMessage(chatId, 'Invalid username. Login failed.');
      }
    });
  }
});

// Start the bot
console.log('Bot is running...');

