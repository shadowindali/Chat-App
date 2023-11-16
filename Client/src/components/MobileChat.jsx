import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../feature/Context';
import useSocket from '../feature/useSocket';
import GroupsIcon from '@mui/icons-material/Groups';
import './styles.css';

function Users() {
  let { previousID, setpreviousID, conversations } = useUser();

  let { emitEvent } = useSocket();

  let LightMode = useSelector((state) => state.themeKey);

  const navigator = useNavigate();

  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData) {
    window.location.href = '/';
  }

  const gettime = (messagetime) => {
    const createdAt = new Date(messagetime);
    const hour = createdAt.getHours();
    const minute = createdAt.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12:xx AM/PM
    const formattedTime = `${formattedHour}:${
      minute < 10 ? '0' : ''
    }${minute} ${ampm}`;

    return formattedTime;
  };

  return (
    <div className={'list-container' + (LightMode ? ' whitecon' : ' dark')}>
      <div className={'usheader' + (LightMode ? ' white' : ' dark')}>Chats</div>
      <div className={'ussearch' + (LightMode ? ' white' : ' dark')}>
        <IconButton>
          <SearchIcon className={LightMode ? '' : 'darkicon'} />
        </IconButton>
        <input placeholder="Search" />
      </div>

      <div className="usavailable">
        {conversations.map((conversation, index) => {
          var chatName = '';
          var latestmessage = '';
          var timestamp = '';
          if (conversation.latestMessage) {
            latestmessage = conversation.latestMessage;
            timestamp = gettime(conversation.latestMessage.createdAt);
          }
          if (conversation.isGroupChat) {
            chatName = conversation.chatName;
            // chatName = [conversation.chatName, <GroupsIcon />];
          } else {
            conversation.users.map((user) => {
              if (user._id != userData.data._id) {
                chatName = user.name;
              }
            });
          }
          return (
            <div
              className={'list-users' + (LightMode ? ' white' : ' dark')}
              key={index}
              onClick={() => {
                emitEvent('leave', { room: previousID });
                setpreviousID(conversation._id);
                emitEvent('join room', { room: conversation._id }); // join room
                navigator('../chat/' + conversation._id);
              }}
            >
              <p className="con-icon">{chatName[0]}</p>
              <div className="mobile-veiw">
                <p className="con-title">{chatName}</p>
                {latestmessage ? (
                  <p className="con-lastMessage">
                    {latestmessage.sender._id === userData.data._id
                      ? `You: ${latestmessage.content}`
                      : `${latestmessage.sender.name}: ${latestmessage.content}`}
                  </p>
                ) : (
                  ''
                )}
              </div>
              <p className="mobile-timestamp">{timestamp}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Users;
