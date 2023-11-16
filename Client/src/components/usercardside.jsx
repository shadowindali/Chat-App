import React, { useEffect, useState } from 'react';
import './styles.css';
import useSocket from '../feature/useSocket';
import { useNavigate } from 'react-router-dom';

function usercardside(props) {
  const { emitEvent } = useSocket();

  const userData = JSON.parse(localStorage.getItem('userData'));

  const [previousID, setpreviousID] = useState('');
  let navigator = useNavigate();
  return (
    <div
      className="conv-container"
      onClick={() => {
        emitEvent('leave', { room: previousID });
        setpreviousID(props.convID);
        emitEvent('join room', { room: props.convID }); // join room
        navigator('chat/' + props.convID);
      }}
    >
      <p className="con-icon">{props.chatname[0]}</p>
      <p className="con-title">{props.chatname}</p>
      {props.latestMessage ? (
        <p className="con-lastMessage">
          {props.latestMessage.sender._id === userData.data._id
            ? `You: ${props.latestMessage.content}`
            : `${props.latestMessage.sender.name}: ${props.latestMessage.content}`}
        </p>
      ) : (
        ''
      )}
      <p className="con-timestamp">{props.timestamp}</p>
    </div>
  );
}

export default usercardside;
