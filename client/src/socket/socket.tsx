import { useState, useRef, useEffect } from "react";
import config from "../config.json";
import Cookies from "js-cookie";
export default function WebSocketComponent({ roomCode }: { roomCode: number }) {
  const [roomName, setRoomName] = useState<string | null>(null);
  const [formData, setFormData] = useState({ message: "" });
  const [messages, setMessages] = useState<
    { message: string; username: string }[]
  >([]);

  const socketRef = useRef<WebSocket | null>(null);

  const handleFormMessage = (e: any) => {
    setFormData({ message: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: formData.message }));
      setFormData({ message: "" }); // Clear the input field
    } else {
      console.error("WebSocket is not connected");
    }
  };

  useEffect(() => {
    const accesstoken: string = Cookies.get("accessToken") || "";
    const serverUrl = config.webSocketUrl + `game/${roomCode}/?token=` + accesstoken;
    socketRef.current = new WebSocket(serverUrl);

    socketRef.current.onopen = () => {
      console.log("Connection Established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("onmessage data", data);
      if (data.type === "conn_status") {
        setRoomName(data.room_group_name);
        console.log("Connection Established");
      }
      if (data.type === "chat_message")
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, username: data.username },
      ]);
    };
    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup function for when the component unmounts
    return () => {
      socketRef.current?.close();
    };
  }, [roomCode]);
  return (
    <>
    {roomName}
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Message:</label>
        <input
          type="text"
          name="message"
          id=""
          onChange={handleFormMessage}
          value={formData.message}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block  p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button type="submit"
        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm  p-1 m-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >Submit</button>
      </form>
      <div id="chat-area">
        {messages.map((messageObj, index) => (
          <p key={index}>
            {" "}
            {messageObj.username} -- {messageObj.message}
          </p>
        ))}
      </div>
    </>
  );
}
