import './App.css';
import { io } from 'socket.io-client'; 
import {useEffect, useState} from 'react';
const REMOTE_URL = 'https://chat-server-lgtp.onrender.com'
const LOCAL_URL = 'http://localhost:8080'
function App() {
  const [msg, setMsg] = useState('')
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    const newSocket = io('http://localhost:8080', {transports: ["websocket", "polling"]})
    setSocket(newSocket)
    newSocket.on('connect', () => {
      console.log('Conection is established')
    })
    newSocket.on('message', (message) => {
      console.log('message')
      setMsg(message)
    })
    newSocket.on('disconnect', () => {
      console.log('connection is over')
    })
  }, [])
  const getNumber = async () => {
    try{
      socket.emit('message', 'lol')      
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div className="App">
      <h1>Get random number immediately</h1>
      <h2>{msg ? msg : "Number..."}</h2>
      <button onClick={getNumber}>GET</button>
    </div>
  );
}

export default App;
