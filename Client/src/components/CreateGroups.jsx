import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../feature/Context';

function CreateGroups() {
  let [groupName, setgroupName] = useState('');
  let { conversations, setconversations } = useUser();

  let LightMode = useSelector((state) => state.themeKey);

  const nav = useNavigate();

  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData) {
    window.location.href = '/';
  }

  const config = {
    headers: {
      Authorization: `Bearer ${userData.data.token}`,
    },
  };

  const creategroup = () => {
    try {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/chat/createGroup`,
          { name: groupName, users: '[]' },
          config
        )
        .then((data) => {
          const chat = data.data;
          setconversations([...conversations, chat]);
          Swal.fire('Group created!', '', 'success');
        });
      nav('/app/groups');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={
        'creategroups-container' + (LightMode ? ' whitecont' : ' darkgr')
      }
    >
      <input
        placeholder="Type Group Name"
        required
        onChange={(e) => {
          setgroupName(e.target.value);
        }}
        onKeyDown={(event) => {
          if (event.code == 'Enter') {
            creategroup();
          }
        }}
      />
      <IconButton onClick={creategroup}>
        <SendIcon className={LightMode ? ' white' : 'darkicon'} />
      </IconButton>
    </div>
  );
}

export default CreateGroups;
