import React from "react";
import { useNavigate } from "react-router-dom";

function Conversationitems({ props }) {
  let navigate = useNavigate();
  let lastMessage = "";
  if (props.latestMessage === undefined) {
    lastMessage = "No Chat start new one!";
  } else {
    lastMessage = props.latestMessage;
  }

  return (
    <div
      className="conv-container"
      onClick={() => {
        navigate("chat");
      }}
    >
      <p className="con-icon">{props.name[0]}</p>
      <p className="con-title">{props.name}</p>
      <p className="con-lastMessage">{lastMessage}</p>
      {/* <p className='con-timestamp'>{props.timestamp}</p> */}
    </div>
  );
}

export default Conversationitems;
