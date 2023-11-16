import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [otheruser, setotheruser] = useState([]);
  const [conversations, setconversations] = useState([]);
  const [previousID, setpreviousID] = useState('');

  return (
    <UserContext.Provider
      value={{
        otheruser,
        setotheruser,
        conversations,
        setconversations,
        previousID,
        setpreviousID,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
