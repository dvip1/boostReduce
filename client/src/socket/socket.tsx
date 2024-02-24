import { useState, useRef, useEffect } from "react";
import config from "../config.json";
import Cookies from "js-cookie";

const accesstoken: string = Cookies.get("accessToken") || "";
const serverUrl = config.webSocketUrl + "simple/?token=" + accesstoken;

export default function WebSocketComponent() {
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
    socketRef.current = new WebSocket(serverUrl);

    socketRef.current.onopen = () => {
      console.log("Connection Established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("onmessage data", data);
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
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Message:</label>
        <input
          type="text"
          name="message"
          id=""
          onChange={handleFormMessage}
          value={formData.message}
        />
        <button type="submit">Submit</button>
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
