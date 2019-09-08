import botResource

class Poster(object):
    def __init(self):
        self.UserId = ''
        self.huitaSignature = ''

    def SaveUserId(self, userId):
        self.UserId = userId
    
    def GetUserIdUnchecked(self):
        return self.UserId

    def GetUserId(self):
        if self.UserId != '':
            return GetUserIdUnchecked()
        else:
            raise Exception(botResource.notFoundUserId())

    def GetHuitaSignature(self):
        self
    
    def PostTo(self):
        self

