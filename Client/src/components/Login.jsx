import React, { useState } from 'react';
import { Backdrop, CircularProgress, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false); // STATE FOR LOADING CIRCLE
  const [iserror, seterror] = useState(false); // STATE FOR LOGIN ERROR
  const [iserror2, seterror2] = useState(false); // STATE FOR SIGNUP ERROR
  const [isLoginView, setIsLoginView] = useState(true); // State to toggle between login and signup views
  const navigate = useNavigate();

  // FILL DATA //
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Config header
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  // LOG IN //
  const loginHandler = async (e) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login/`,
        data,
        config
      );
      setLoading(false);
      localStorage.setItem('userData', JSON.stringify(response));
      navigate('/app/welcome');
    } catch (error) {
      seterror(true);
    }
    setLoading(false);
  };

  // SIGN UP
  const signUpHandler = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/register/`,
        data,
        config
      );
      navigate('/app/welcome');
      localStorage.setItem('userData', JSON.stringify(response));
    } catch (error) {
      seterror2(true);
    }
    setLoading(false);
  };

  // CHANGE BETWEEN LOGIN AND SIGNUP //
  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="login-container">
        <div className="sidelogincontainer">
          <h1>WELCOME</h1>
          <p>TO LIVE CHAT</p>
        </div>
        <div
          className="login-box"
          style={{ display: isLoginView ? 'flex' : 'none' }}
        >
          <p>Login to your Account</p>
          <TextField
            onChange={changeHandler}
            label="Enter User Name"
            variant="outlined"
            name="name"
          />
          <TextField
            onChange={changeHandler}
            label="Password"
            type="password"
            autoComplete="current-password"
            name="password"
          />
          <Button variant="outlined" onClick={loginHandler}>
            Login
          </Button>
          <p className="error" style={{ display: iserror ? 'block' : 'none' }}>
            Invailed Username or Password!!
          </p>
          <div className="sign-up">
            <p>Create if you're new!!</p>
            <button onClick={toggleView}>Sign Up</button>
          </div>
        </div>
        <div
          className="signup-box"
          style={{ display: isLoginView ? 'none' : 'flex' }}
        >
          <p>Create An Account</p>
          <TextField
            onChange={changeHandler}
            label="Enter User Name"
            variant="outlined"
            name="name"
          />
          <TextField
            onChange={changeHandler}
            label="Enter Email"
            variant="outlined"
            name="email"
          />
          <TextField
            onChange={changeHandler}
            label="Password"
            type="password"
            autoComplete="current-password"
            name="password"
          />
          <Button variant="outlined" onClick={signUpHandler}>
            Sign up
          </Button>
          <p className="error" style={{ display: iserror2 ? 'block' : 'none' }}>
            Username Or Email Are Taken!!
          </p>
          <div className="sign-up">
            <p>Do You Have an account?</p>
            <button onClick={toggleView}>Login</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
