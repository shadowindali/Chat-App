import React, { useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../feature/themeSlice';
import axios from 'axios';
import { useUser } from '../feature/Context';
import useSocket from '../feature/useSocket';
import { useChat } from '../feature/ChatContext';
import Usercardside from './usercardside';
import GroupsIcon from '@mui/icons-material/Groups';

function Siderbar() {
  const [searchinput, setsearchinput] = useState('');

  let { conversations, setconversations } = useUser();
  const { previousID, otheruser } = useUser();

  let { chatMessages, setChatMessages } = useChat();

  let { emitEvent } = useSocket();

  let navigator = useNavigate();

  let LightMode = useSelector((state) => state.themeKey);

  let dispatch = useDispatch();

  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData) {
    window.location.href = '/';
  }

  const user = userData.data;

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userID');
    navigator('/');
  };

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

  function searchUsers(users, searchQuery) {
    const query = searchQuery.toLowerCase();

    if (searchQuery) {
      const searchResults = users.filter((user) => {
        return user.chatName.toLowerCase().includes(query);
      });
      setconversations(searchResults);
    } else {
      getconv();
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchUsers(conversations, searchinput);
    }
  };

  const getconv = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/chat/`, config).then((data) => {
      setconversations(data.data);
    });
  };

  useEffect(() => {
    getconv();
  }, [chatMessages, otheruser]);

  return (
    <div className={'sidebar-container' + (LightMode ? ' whitecont' : ' dark')}>
      <div className={'sb-header' + (LightMode ? ' white' : ' dark')}>
        <div className="other-icons">
          <IconButton>
            <AccountCircleIcon className={LightMode ? '' : ' darkicon'} />
          </IconButton>
        </div>
        <div className="other-icons">
          <IconButton
            className="mobile-view"
            onClick={() => {
              navigator('mobileuser');
              emitEvent('leave', { room: previousID });
            }}
          >
            <ChatIcon className={LightMode ? '' : ' darkicon'} />
          </IconButton>
          <IconButton
            onClick={() => {
              navigator('users');
            }}
          >
            <PersonAddAlt1Icon className={LightMode ? '' : ' darkicon'} />
          </IconButton>
          <IconButton
            onClick={() => {
              navigator('groups');
            }}
          >
            <GroupAddIcon className={LightMode ? '' : ' darkicon'} />
          </IconButton>
          <IconButton
            onClick={() => {
              navigator('create-groups');
            }}
          >
            <AddCircleIcon className={LightMode ? '' : ' darkicon'} />
          </IconButton>

          <IconButton
            onClick={() => {
              dispatch(toggleTheme());
            }}
          >
            {LightMode && <NightlightRoundIcon />}
            {!LightMode && (
              <LightModeIcon className={LightMode ? '' : ' darkicon'} />
            )}
          </IconButton>

          <IconButton onClick={logout}>
            <LogoutIcon className={LightMode ? '' : ' darkicon'} />
          </IconButton>
        </div>
      </div>

      {/* middle */}

      {/* <div className={'sb-search' + (LightMode ? ' white' : ' dark')}>
        <IconButton>
          <SearchIcon className={LightMode ? '' : ' darkicon'} />
        </IconButton>
        <input
          placeholder="Search"
          onChange={(e) => setsearchinput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div> */}

      {/* end */}

      <div className={'sb-conversation' + (LightMode ? ' white' : ' dark')}>
        {conversations.map((conversation, index) => {
          var chatName = '';
          var latestmessage = '';
          var timestamp = '';
          if (conversation.isGroupChat) {
            chatName = conversation.chatName;
            if (conversation.latestMessage) {
              latestmessage = conversation.latestMessage;
              timestamp = gettime(conversation.latestMessage.createdAt);
            }
            } else {
            conversation.users.map((user) => {
              if (user._id != userData.data._id) {
                chatName = user.name;
                if (conversation.latestMessage) {
                  latestmessage = conversation.latestMessage;
                  timestamp = gettime(conversation.latestMessage.createdAt);
                }
              }
            });
          }
          return (
            <Usercardside
              key={index}
              convID={conversation._id}
              chatname={chatName}
              latestMessage={latestmessage}
              timestamp={timestamp}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Siderbar;
