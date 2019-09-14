#!/usr/bin/python
import confidential as c 
import posterapp 

BOT_TOKEN = 'bot_token_here'

app = posterapp.PosterApp(BOT_TOKEN, c.ProxySettings()) 

app.Initialize()
app.RegisterBotHandlers()
app.Run()
