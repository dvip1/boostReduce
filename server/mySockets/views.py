from channels.generic.websocket import WebsocketConsumer
import json
import django

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
        

            