require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', () => {
  console.log('The bot is online!');
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (message.content.startsWith('!')) return;

  let conversationLog = [{ role: 'system', content: 'You are a friendly chatbot.' }];

  try {
    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
      if (message.content.startsWith('!')) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      // if (msg.author.id !== message.author.id) return; Why i am commenting this out becuase this thing ignore all the message other than the author who triggered this thing . it also ignores the bot itself . 
    
      if (msg.author.id == client.user.id) {  // checks if the msg id send by the bot itself 

        conversationLog.push(
        {
          role: 'system',
          content: msg.content,
          name: msg.author.username, 
        }
      );

        } else if (msg.author.id == message.author.id) {  // checks if the msg is send by the message author who triggered this

        conversationLog.push(
        {     
          role: 'user',
          content: msg.content,
          name: message.author.username,            
        }
        );
       }    
      // now the bot remembers the thing that the user said and also the things that the bot itself said      
      return; // return nothing if the criteria of the chat for the message to be pushed is not correct     
    });

    const result = await openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        // max_tokens: 256, // limit token usage
      })
      .catch((error) => {
        console.log(`OPENAI ERR: ${error}`);
      });
    
    message.reply(result.data.choices[0].message);
  } catch (error) {
    console.log(`ERR: ${error}`);
  }
});

client.login(process.env.TOKEN);
