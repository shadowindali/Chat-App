import io from 'socket.io-client';
import { useChat } from './ChatContext';

let socket;

const useSocket = () => {
  let { chatMessages, setChatMessages } = useChat();

  if (!socket) {
    socket = io.connect(`${import.meta.env.VITE_API_URL}`);

    // Define your event listeners and handlers here
    socket.on('receive message', (data) => {
      setChatMessages((chatMessages) => [...chatMessages, data.message]);
    });
  }

  const emitEvent = (eventName, data) => {
    socket.emit(eventName, data);
  };

  return { emitEvent };
};

export default useSocket;
