import { io } from 'socket.io-client';
import { UserContext } from "../App";
import { useContext, createContext } from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ChatRoom from './ChatRoom';
export const SocketContext = createContext([])
export default function Home(){
    const [user, setUser] = useContext(UserContext)
    const [socket, setSocket] = useState(null)
    const [chats, setChatRooms] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        if(user.accessToken){
            // query all of the chat rooms 
            const getAllRooms = async () => {
                try{
                    const res = await axios.get('/rooms', {headers: {'Authorization': `Bearer ${user.accessToken}`}})
                    console.log(await res.data)
                    const { chatRooms } = await res.data
                    const arr = chatRooms.map(item => {
                        return <div key={item._id}>{item.name}</div>
                    })
                    setChatRooms(arr)
                }catch(err){
                    console.log(err)
                }
            }
            getAllRooms()
            // establish web socket connection 
            const newSocket = io('localhost:8080', {transports: ["websocket", "polling"]})
            setSocket(newSocket)
            newSocket.on('connect', () => console.log('Socket connection is established'))
        }
    }, [])
    return(
        <SocketContext.Provider value={[socket, setSocket]}>
            <div className="home">
                <h1>Home page</h1>
                <div className='chats-column'>
                    {chats}
                </div>
            </div>
        </SocketContext.Provider>
    )
}