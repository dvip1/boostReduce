import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import config from "../config.json";
const accesstoken:string = Cookies.get('accessToken') || '';
const serverUrl = config.webSocketUrl + "game/?token=" +accesstoken;

export default function Game() {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(serverUrl);
    socketRef.current.onopen = () => {
      console.log("Connection Established");
    };
    socketRef.current.onmessage = (event) => {
      console.log("message data: ", event.data);
    };
    socketRef.current.onerror = (err) => {
      console.log("error message: ", err);
    };

    return () => {
        socketRef.current?.close();
      };
  }, []);

  const createGame = () => {
    const message: object = {
      type: "create_game",
    };
    console.log(message)
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return (
    <>
    <section className="bg-black h-screen">
      <button onClick={() => createGame()} className="bg-blue-500">
    create game      
</button>   
</section> </>
  );
}
