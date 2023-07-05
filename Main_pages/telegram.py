import telepot
#создем функцию отправки собщения серз бота

def send_message_to_telegram(bot_token, chat_id, message):
    #задаем бота через токен в телеге
    bot = telepot.Bot(bot_token)
    #отправляем сообщение по id чата
    bot.sendMessage(chat_id, message)