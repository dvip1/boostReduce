import random
import string
from .models import Game
def generate_game_code():
    length = 6 
    from ..models import Game
    while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
            if not Game.objects.filter(code=code).exists():
                return code 