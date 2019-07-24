import telebot
import logging
import time

class PosterApp(object):

    def __init__(self, botToken, proxySettings):
        self.botToken = botToken
        self.proxySettings = proxySettings

    def Initialize(self):
        self.bot = telebot.TeleBot(self.botToken)
        telebot.apihelper.proxy = self.proxySettings

    def RegisterBotHandlers(self):
        @self.bot.message_handler(commands=['help', 'start'])
        def send_welcome(message):
            self.bot.reply_to(message, "hello there")

        @self.bot.message_handler(commands=['post'])
        def send_welcome(message):
            self.bot.reply_to(message, "post answer " + message.text)

        #@self.bot.message_handler(commands=['help', 'start'])
        #def send_welcome(message):
        #    self.bot.reply_to(message, "hello there")

    def Run(self):
        while True:
            try:
                self.bot.polling()
            except:
                loger.exception("bot polling exception. repeating after delay")
            time.delay(5)
