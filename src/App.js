import { io } from 'socket.io-client'; 
import {useEffect, useState, createContext} from 'react';
import {Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import Home from './components/Home';
import Register from './components/Register';
import CreateGroup from './components/CreateGroup';
import FindPpl from './components/FindPeople';
import Profile from './components/Profile';
import Group from './components/Group';
export const UserContext = createContext([])
export const SocketContext = createContext([])
const REMOTE_URL = 'https://chat-server-lgtp.onrender.com'
const LOCAL_URL = 'http://localhost:8080'
function App() {
  const [user, setUser] = useState({})
  const [socket, setSocket] = useState(null)
  axios.defaults.baseURL = LOCAL_URL
  const navigate = useNavigate()
  useEffect(() => {
    const getRefresh = async () => {
      try{
        const refresh = localStorage.getItem('refreshToken')
        const res = await axios.get('/api/v1/refresh', {headers: {"Authorization": `Bearer ${refresh}`}})
        const {accessToken, refreshToken, email} = await res.data 
        if(!accessToken || !refreshToken || !email) return navigate('/login')
        else{
          setUser({accessToken: accessToken, email: email})
        }
      }catch(err){
        return navigate('/login')
      }
    }
    if(user.accessToken) return navigate('/')
    else{
      getRefresh()
    }
  }, [user])
  return (
      <SocketContext.Provider value={[socket, setSocket]}>
        <UserContext.Provider value={[user, setUser]}>
          <>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/profile' element={<Profile/>}/>
              <Route path='/makegroup' element={<CreateGroup/>}/>
              <Route path='/chatroom' element={<ChatRoom/>}/>
              <Route path='/register' element={<Register/>}/>
              <Route path='/findpeople' element={<FindPpl/>}/>
              <Route path='/group' element={<Group/>}/>
            </Routes>
          </>
        </UserContext.Provider>
      </SocketContext.Provider>
  );
} 

export default App;
