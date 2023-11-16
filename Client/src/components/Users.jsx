import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUser } from '../feature/Context';
import useSocket from '../feature/useSocket';

function Users() {
  let [users, setusers] = useState([]);
  let [searchinput, setsearchinput] = useState('');

  let { otheruser, setotheruser } = useUser();

  let { emitEvent } = useSocket();

  let LightMode = useSelector((state) => state.themeKey);

  const navigator = useNavigate();

  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData) {
    window.location.href = '/';
  }

  const config = {
    headers: {
      Authorization: `Bearer ${userData.data.token}`,
    },
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/user/fetchUsers`, config)
      .then((data) => {
        setusers(data.data);
      });
  }, []);

  const searchbar = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/user/getsearcheduser`, {
        params: {
          searchfor: searchinput,
        },
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      })
      .then((response) => {
        setusers(response.data);
        Swal.fire('Users found!', '', 'success');
      })
      .catch((error) => {
        console.error('Authorization error:', error);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchbar();
    }
  };

  return (
    <div className={'list-container' + (LightMode ? ' whitecon' : ' dark')}>
      <div className={'usheader' + (LightMode ? ' white' : ' dark')}>
        Online Users
      </div>
      <div className={'ussearch' + (LightMode ? ' white' : ' dark')}>
        <IconButton onClick={searchbar}>
          <SearchIcon className={LightMode ? '' : 'darkicon'} />
        </IconButton>
        <input
          placeholder="Search"
          onChange={(e) => setsearchinput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="usavailable">
        {users.map((user, index) => {
          return (
            <div
              className={'list-users' + (LightMode ? ' white' : ' dark')}
              key={index}
              onClick={() => {
                const config = {
                  headers: {
                    Authorization: `Bearer ${userData.data.token}`,
                  },
                };
                async function getchat() {
                  try {
                    const response = await axios
                      .post(
                        `${import.meta.env.VITE_API_URL}/chat/`,
                        {
                          userId: user._id,
                        },
                        config
                      )
                      .then(({ data }) => {
                        setotheruser(data.users[1].name);
                        emitEvent('join room', { room: data._id }); // join room
                        navigator(`/app/chat/${data._id}`);
                      });
                  } catch (err) {
                    Swal.fire('Chat already exists!', '', 'success');
                    navigator('/app/mobileuser');
                  }
                }
                getchat();
              }}
            >
              <p className="con-icon">{user.name[0]}</p>
              <p className="con-title">{user.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Users;
