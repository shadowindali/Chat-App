import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUser } from '../feature/Context';

function Users() {
  let [Groups, setGroups] = useState([]);
  let [searchinput, setsearchinput] = useState('');

  let { conversations, setconversations } = useUser();

  let LightMode = useSelector((state) => state.themeKey);

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
      .get(`${import.meta.env.VITE_API_URL}/chat/fetchGroups`, config)
      .then((data) => {
        setGroups(data.data);
      });
  }, []);

  const searchbar = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/chat/searchgroup`, {
        params: {
          searchfor: searchinput,
        },
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      })
      .then((response) => {
        setGroups(response.data);
        Swal.fire('Groups found!', '', 'success');
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
        Available groups
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
        {Groups.map((group, index) => {
          return (
            <div
              className={'list-users' + (LightMode ? ' white' : ' dark')}
              key={index}
              onClick={async () => {
                try {
                  const response = await axios.put(
                    `${import.meta.env.VITE_API_URL}/chat/addSelfToGroup`,
                    {
                      chatId: group._id,
                      userId: userData.data._id,
                    },
                    config
                  );

                  const chat = response.data;
                  setconversations([...conversations, chat]);
                  Swal.fire('Added to group!', '', 'success');
                } catch (err) {
                  if (
                    err.response &&
                    err.response.data.error === 'User is already in the group'
                  ) {
                    Swal.fire('User is already in group!', '', 'success');
                  } else {
                    // Handle other errors, e.g., display a generic error message
                    console.error('Error:', err);
                  }
                }
              }}
            >
              <p className="con-icon">{group.chatName[0]}</p>
              <p className="con-title">{group.chatName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Users;
