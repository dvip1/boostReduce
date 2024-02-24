from channels.generic.websocket import AsyncWebsocketConsumer    
import json  

class SimpleConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'general_chat'
        self.room_group_name = 'chat_{}'.format(self.room_name)  
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