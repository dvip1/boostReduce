from channels.generic.websocket import AsyncWebsocketConsumer    
import json  

class SimpleConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']  
        self.room_group_name = 'game_{}'.format(self.room_code) 
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps({
            'type': "conn_status", 
            "message": "connection established",
            "room_group_name": self.room_code
        }))
             
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
               
    async def receive(self, text_data): 
        text_data_json= json.loads(text_data)
        message = text_data_json['message']
        username= self.scope['user'].username
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username       
            }
        )
        
    async def chat_message(self, event):
        message = event['message']
        username = event['username']  # Extract username from the event
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'username': username
        }))