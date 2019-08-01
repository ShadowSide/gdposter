import telebot
import logging
import time
import botResource
import bussines
import helpers
import weber

class PosterApp(object):

    def __init__(self, botToken, proxySettings):
        self.botToken = botToken
        self.proxySettings = proxySettings

    def Initialize(self):
        self.bot = telebot.TeleBot(self.botToken)
        telebot.apihelper.proxy = self.proxySettings
        self.weber = weber.Weber()
        self.poster = bussines.Poster(self.weber)

    def RegisterBotHandlers(self):
        @self.bot.message_handler(commands=['help'])
        def sendHelp(message):
            self.bot.reply_to(message, botResource.HelpMessage())

        @self.bot.message_handler(commands=['ping'])
        def pong(message):
            self.bot.reply_to(message, "hello there")

        @self.bot.message_handler(commands=['shutdown'])
        def shutdown(message):
            exit(0)

        @self.bot.message_handler(commands=['post'])
        def postTo(message):
            answer = helpers.ResultOrExceptionMsg(lambda: self.poster.PostTo(_GetDestination(message.text), _GetPost(message.text)))
            self.bot.reply_to(message, answer)

        @self.bot.message_handler(commands=['start'])
        def start(message):
            answer = helpers.ResultOrExceptionMsg(lambda: self.poster.SaveUserId(message.User.UserId))
            self.bot.reply_to(message, message.User.UserId)

        @self.bot.message_handler(commands=['delete'])
        def deletePost(message):
            answer = helpers.ResultOrExceptionMsg(lambda: self.poster.DeletePost(_GetDestination(message.text)))
            self.bot.reply_to(message, answer)

        
    def Run(self):
        while True:
            try:
                self.bot.polling()
            except:
                loger.exception("bot polling exception. repeating after delay")
            time.delay(5)

    def _GetDestination(text):
        return helpers.SpnitByEndLineAndGetLine(text, 1)
    
    def _GetPost(text):
        return helpers.SplitByEndLineAndGetSince(text, 2)
