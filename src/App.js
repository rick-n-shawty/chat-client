import './App.css';
import { io } from 'socket.io-client'; 
import {useEffect, useState} from 'react';
const REMOTE_URL = 'https://chat-server-lgtp.onrender.com'
const LOCAL_URL = 'http://localhost:8080'
const URL = REMOTE_URL
function App() {
  const [msg, setMsg] = useState('')
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  useEffect(() => {
    const newSocket = io(URL, {transports: ["websocket", "polling"]})
    setSocket(newSocket)
    newSocket.on('connect', () => {
      console.log('Conection is established')
    })
    newSocket.on('message', (message) => {
      console.log('message', message)
      const data = JSON.parse(message)
      const arr = data.map(item => {
        return <div>{item.id.substr(0,3)}: {item.msg}</div>
      })
      setMessages(arr)
    })
    newSocket.on('disconnect', () => {
      console.log('connection is over')
    })
  }, [])
  const sendMessage = async () => {
    try{ 
      socket.emit('message', msg) 
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div className="App">
      <h1>This is chat room for two!</h1>
      <div className='form'>
        <input placeholder='type...' value={msg} onChange={(e) => setMsg(e.target.value)}/>
        <button onClick={sendMessage}>send</button>
      </div>
      <div className='messages'>
        {messages}
      </div>
    </div>
  );
}

export default App;
