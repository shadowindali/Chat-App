import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import MainContainer from './components/MainContainer';
import Welcome from './components/Welcome';
import Chatareaa from './components/Chatareaa';
import Users from './components/Users';
import Groups from './components/Groups';
import CreateGroups from './components/CreateGroups';
import Mobilechat from './components/MobileChat';
import { useSelector } from 'react-redux';
import { ChatProvider } from './feature/ChatContext.jsx';

function App() {
  let LightMode = useSelector((state) => state.themeKey);
  return (
    <div className={'container' + (LightMode ? '' : ' maindark')}>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="app" element={<MainContainer />}>
            <Route path="welcome" element={<Welcome />}></Route>
            <Route path="chat/:_id" element={<Chatareaa />}></Route>
            <Route path="users" element={<Users />}></Route>
            <Route path="mobileuser" element={<Mobilechat />}></Route>
            <Route path="groups" element={<Groups />}></Route>
            <Route path="create-groups" element={<CreateGroups />}></Route>
          </Route>
        </Routes>
      </ChatProvider>
    </div>
  );
}

export default App;
