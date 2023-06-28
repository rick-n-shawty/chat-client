import './App.css';
import { io } from 'socket.io-client'; 
import {useEffect, useState, createContext} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import axios from 'axios'; 
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import Home from './components/Home';
import Register from './components/Register';
export const UserContext = createContext([])
const REMOTE_URL = 'https://chat-server-lgtp.onrender.com'
const LOCAL_URL = 'http://localhost:8080/api/v1'
const URL = LOCAL_URL
function App() {
  const [user, setUser] = useState([])
  axios.defaults.baseURL = URL
  const navigate = useNavigate()
  useEffect(() => {
    if(!user.accessToken) return navigate('/login')
  }, [])
  // const [msg, setMsg] = useState('')
  // const [socket, setSocket] = useState(null)
  // const [messages, setMessages] = useState([])
  // useEffect(() => {
  //   const newSocket = io(URL, {transports: ["websocket", "polling"]})
  //   setSocket(newSocket)
  //   newSocket.on('connect', () => {
  //     console.log('Conection is established')
  //   })
  //   newSocket.emit('joinRoom', 'room1')
  //   newSocket.on('message', (message) => {
  //     const arr = message.map(item => {
  //       return <div key={item._id}>{item.senderName}: {item.content}</div>
  //     })
  //     setMessages(arr)
  //   })
  //   newSocket.on('disconnect', () => {
  //     console.log('connection is over')
  //   })
  // }, [])
  // const sendMessage = async () => {
  //   try{ 
  //     socket.emit('sendMessage', 'room1', msg) 
  //   }catch(err){
  //     console.log(err)
  //   }
  // }
  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/chatroom' element={<ChatRoom/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </div>
    </UserContext.Provider>
  );
} 

export default App;
