#!/usr/bin/python
import confidential as c 
import posterapp 

BOT_TOKEN = '825739067:AAHoBF8ti8FqcCfmtTjlyuPY9Idvt9NS4EA'

app = posterapp.PosterApp(BOT_TOKEN, c.ProxySettings()) 

app.Initialize()
app.RegisterBotHandlers()
app.Run()
