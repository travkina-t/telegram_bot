const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./options')
const token = "6362360629:AAHtn7c4r1YJfxDH-R6iKEVqF9FQayJZnJQ";

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async(chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, попробуй его отгадать)')
    const randNum = Math.floor(Math.random() *10)
    chats[chatId] = randNum;
    await bot.sendMessage(chatId, 'Вводи свой ответ', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Начать игру "Угадай число"'},
    ])
    
    bot.on('message', async msg=> {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/67e/60c/67e60c3e-98b9-3cf5-8338-1c71364df6d2/9.webp')
            return bot.sendMessage(chatId, `Приветствую тебя в моем телеграм боте, меня зовут Таня Травкина`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text==='/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз)`)
        // bot.sendMessage(chatId, `You are write me ${text}`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data=="/again") {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты угадал число ${chats[chatId]}`, againOptions)
        }
        else {
            return bot.sendMessage(chatId, `Ты не угадал, бот загадал число ${chats[chatId]}`, againOptions)
        }
        // bot.sendMessage(chatId, `Ты выбрал число ${data}`)
    })
}



start()

