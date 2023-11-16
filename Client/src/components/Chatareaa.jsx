import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageSelf from './Messageself';
import MessageOthers from './MessageOther';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import useSocket from '../feature/useSocket';
import { useChat } from '../feature/ChatContext';

function Chatarea() {
  const [messageContent, setMessageContent] = useState('');
  const [chatData, setchatData] = useState({});
  const [loaded, setloaded] = useState(false);

  let { chatMessages, setChatMessages } = useChat();

  const messagesEndRef = useRef(null);

  const navigator = useNavigate();

  const { emitEvent } = useSocket();

  let LightMode = useSelector((state) => state.themeKey);

  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData) {
    window.location.href = '/';
  }

  const inputRef = useRef(null);

  const chatID = useParams();

  const config = {
    headers: {
      Authorization: `Bearer ${userData.data.token}`,
    },
  };

  // return to /app when reloading
  // useEffect(() => {
  //   if (window.performance && window.performance.navigation.type === 1) {
  //     window.location.href = '/app/welcome';
  //   }
  // }, []);

  const sendMessage = async () => {
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/message/`,
        {
          content: messageContent,
          chatId: chatID,
        },
        config
      );
      setMessageContent('');
      const msg = resp.data;
      setChatMessages([...chatMessages, msg]);
      emitEvent('send message', { room: chatID._id, message: msg });
      inputRef.current.value = '';
    } catch (err) {
      console.log(err);
    }
  };

  const deletchat = () => {
    Swal.fire({
      title: 'Do you want to delete this chat?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Are you sure?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.delete(
                `${import.meta.env.VITE_API_URL}/chat/${chatID._id}`,
                config
              );
              Swal.fire('Chat Deleted!', '', 'success');
              navigator('/app/welcome');
              location.reload();
            } catch (err) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something wrong happened.',
              });
            }
          }
        });
      }
    });
  };

  const leavegroup = () => {
    Swal.fire({
      title: 'Do you want to leave this group?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Are you sure?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.put(
                `${import.meta.env.VITE_API_URL}/chat/groupExit`,
                {
                  chatId: chatID,
                  userId: userData.data._id,
                },
                config
              );
              Swal.fire('Left Group!', '', 'success');
              navigator('/app/welcome');
              location.reload();
            } catch (err) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something wrong happened.',
              });
            }
          }
        });
      }
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  let chattname = '';

  useEffect(() => {
    async function getmessages() {
      await axios
        .get(`${import.meta.env.VITE_API_URL}/message/${chatID._id}`, config)
        .then(({ data }) => {
          setChatMessages(data);
        });
    }
    async function getchatdata() {
      await axios
        .get(`${import.meta.env.VITE_API_URL}/chat/${chatID._id}`, config)
        .then((data) => {
          setchatData(data.data);
          setloaded(true);
        });
    }

    getchatdata();
    getmessages();
  }, [chatID, loaded]);

  if (loaded) {
    chattname = chatData.isGroupChat ? chatData.chatName : '';

    if (!chatData.isGroupChat) {
      for (const user of chatData.users) {
        if (user._id !== userData.data._id) {
          chattname = user.name;
          break; // Exit the loop as soon as a non-matching user is found
        }
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default Enter key behavior (usually line break)
      sendMessage();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  if (loaded)
    return (
      <div
        className={'chatarea-container' + (LightMode ? ' whitecont' : ' dark')}
      >
        <div className={'chatarea-header' + (LightMode ? ' white' : ' dark')}>
          <p className="con-icon">{chattname[0]}</p>
          <div className="header-text">
            <p className="con-title">{chattname}</p>
          </div>

          {chatData.isGroupChat ? (
            <IconButton onClick={leavegroup}>
              <GroupRemoveIcon className={LightMode ? '' : ' darkicon'} />
            </IconButton>
          ) : (
            <IconButton onClick={deletchat}>
              <DeleteIcon className={LightMode ? '' : ' darkicon'} />
            </IconButton>
          )}
          {chatData.groupAdmin === userData.data._id ? (
            <IconButton onClick={deletchat}>
              <DeleteIcon className={LightMode ? '' : ' darkicon'} />
            </IconButton>
          ) : (
            ''
          )}
        </div>

        <div
          className={'messages-container' + (LightMode ? ' white' : ' dark')}
        >
          {chatMessages.slice(0).map((message, index) => {
            const sender = message.sender;
            const group = message.chat.isGroupChat;
            const self_id = userData.data._id;
            if (sender._id === self_id) {
              return <MessageSelf props={message} key={index} />;
            } else {
              return (
                <MessageOthers props={message} group={group} key={index} />
              );
            }
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className={'text-input-area' + (LightMode ? ' white' : ' dark')}>
          <input
            placeholder="Type a message"
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            ref={inputRef}
            onKeyPress={handleKeyPress}
          />
          <IconButton
            onClick={() => {
              sendMessage();
            }}
          >
            <SendIcon className={LightMode ? '' : ' darkicon'} />
          </IconButton>
        </div>
      </div>
    );
}

export default Chatarea;
