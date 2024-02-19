from channels.generic.websocket import WebsocketConsumer
import json
import random
import string


class GameConsumer(WebsocketConsumer):
    def connect(self):
        try:
            # from rest_framework_simplejwt.authentication import JWTAuthentication
            # auth_header = self.scope['headers'].get(b'authorization') 
            # token = auth_header.decode('utf-8').split()[1]
            # authenticator = JWTAuthentication()
            # user = authenticator.authenticate(token)[0]  # [0] to get the user
            # self.scope['user'] = user

            self.accept()
        except Exception as e:
            print(f"Authentication error: {e}")
            self.close()

    def receive(self, text_data):
        data= json.loads(text_data)
        if data['type']== 'create_game':
            self.create_game()
    
    def create_game(self):
        from .models import Game
        def generate_game_code():
            length = 6  # Customize the code length if you want
            from .models import Game
            while True:
                code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
                if not Game.objects.filter(code=code).exists():
                    return code 
        code= generate_game_code()
        game= Game.objects.create(code=code, created_by= self.scope['user'])
        self.send(text_data= json.dumps({
            'type': 'game_created',
            'code': code
        }))
        
        
        
class SimpleConsumer(WebsocketConsumer):
    def connect(self):
        try:
            # from rest_framework_simplejwt.authentication import JWTAuthentication
            # auth_header = self.scope['headers'].get(b'authorization') 
            # token = auth_header.decode('utf-8').split()[1]

            # authenticator = JWTAuthentication()
            # user = authenticator.authenticate(token)[0]  # [0] to get the user
            # self.scope['user'] = user

            self.accept()
        except Exception as e:
            print(f"Authentication error: {e}")
            self.close()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):  
        print("Message received:", text_data)  # Example: Handle text messages
        self.send(text_data="Message received from server!")
        

            