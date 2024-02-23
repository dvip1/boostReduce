from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import django

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'general_chat'
        self.room_group_name = 'chat_{}'.format(self.room_name)  # Correct formatting
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
               
    async def receive(self, text_data): 
        text_data_json= json.loads(text_data)
        message = text_data_json['message']
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )
    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
           'message': message 
        }))
    
        
    
class GameConsumer(WebsocketConsumer):
    def connect(self):
        try:
            self.accept()
            print(f"Checking in socket.views.GameConsumer: {self.scope['user']}")

            self.send(text_data= json.dumps({
                "type": "Success",
                "message": "Connected ✅"
            }))
        except Exception as e:
            print(f"Authentication error: {e}")
            self.send(text_data=json.dumps({
                "type": "error",
                "message": "Not Connected ❌"
            }))
            self.close()

    def receive(self, text_data):
        try: 
            data= json.loads(text_data)
            if data['type']== 'create_game':
                self.create_game()
        except django.db.utils.ProgrammingError as e:
            self.send(text_data=json.dumps({
            "type": "error",
            "message": "Database error: {}".format(str(e)) 
            }))
        except Exception as e:
            print(json.dumps({
            "type": "error",
            "message": "An unexpected error occurred: {}".format(str(e))
            }))
            self.send(text_data=json.dumps({
            "type": "error",
            "message": "An unexpected error occurred: {}".format(str(e))
            }))   

    def create_game(self):
        from .models import Game
        from .utils import generate_game_code
        code= generate_game_code()
        game= Game.objects.create(code=code, created_by= self.scope['user'])
        self.send(text_data= json.dumps({
            'type': 'game_created',
            'code': code
        }))
        print("it's working!")
        
        
        
class SimpleConsumer(WebsocketConsumer):
    def connect(self):
        try:
            self.accept()
        except Exception as e:
            print(f"Authentication error: {e}")
            self.close()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):  
        print("Message received:", text_data)  # Example: Handle text messages
        self.send(text_data="Message received from server!")
        
