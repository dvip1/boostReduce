from channels.generic.websocket import WebsocketConsumer

class SimpleConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):  
        print("Message received:", text_data)  # Example: Handle text messages
        self.send(text_data="Message received from server!")
