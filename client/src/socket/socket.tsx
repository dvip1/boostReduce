import { useEffect, useRef } from 'react';
const serverUrl = "ws://localhost:8000/ws/simple/";

export default function WebSocketComponent(){
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(()=> {
        socketRef.current = new WebSocket(serverUrl);
        socketRef.current.onopen = ()=> {
            console.log("connection established");
        }
        socketRef.current.onmessage = (event) => {
            const messageData = event.data;
            console.log("message Data", messageData);
        }
        socketRef.current.onerror = (error) =>{
            console.log("WebSocket error: ", error);
        }
        return () => {
            socketRef.current?.close();
        };
    }, [])

    const sendMessage = (message:string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(message) 
        }
    }

    return (
        <div>
            <p>Check Console</p>
            <button onClick={() => sendMessage('Hello from React!')}>Send Message</button>
        </div>
    );
}