import WebSocketComponent from "../socket/socket";
import { useState } from "react";

function generateRoomCode() {
  return Math.floor(Math.random() * 900000) + 100000; // 6-digit code
}

export default function DashBoard() {
  const [createNew, onCreateNew] = useState(false);
  const [roomNo, onRoomNo] = useState(0); // Set initial value
  const [joinExisting, onJoinExisting] = useState(false);

  function handleClick() {
    onCreateNew(true);
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    onRoomNo(e.target.elements[0].value); 
    onJoinExisting(true);
  }

  if (!createNew && !joinExisting)
    return (
      <div className="p-2">
        <p>Create new game</p>
        <button
          onClick={handleClick}
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 m-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Create New
        </button>

        <form onSubmit={handleSubmit}>
          <label htmlFor="">Join game</label>
          <input type="number" name="" id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          <button
            type="submit"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 m-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Submit
          </button>
        </form>
      </div>
    );
  else if (createNew)
    return (
    <WebSocketComponent roomCode={generateRoomCode()} />    ); 
  else if (joinExisting) return <WebSocketComponent roomCode={roomNo} />; // Use as a component
}
