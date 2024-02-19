import  { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
//import Cookies from 'js-cookie';
import config from '../config.json'

const url = config.webSocketUrl + "/game";
// const token = Cookies.get('accessToken'); 

function GameComponent() {
    const [gameCode, setGameCode] = useState(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(url);
        setSocket(newSocket);

        newSocket.on('game_created', (data) => {
            setGameCode(data.code);
        });

        return () => {
            newSocket.close();
        };
    }, [setSocket]);

    const createGame = () => {
        if (socket) {
            socket.emit('create_game');
        }
    };

    return (
        <div>
            <button onClick={createGame}>Create Game</button>
            {gameCode && <p>Game created! Code: {gameCode}</p>}
        </div>
    );
}

export default GameComponent;