import React from 'react';
import './styles.css';
import Siderbar from './Siderbar';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function MainContainer() {
  let LightMode = useSelector((state) => state.themeKey);
  return (
    <div className={'main-container' + (LightMode ? ' whitecont' : ' dark')}>
      <Siderbar />
      <Outlet />
    </div>
  );
}

export default MainContainer;
