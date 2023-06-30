import { io } from 'socket.io-client';
import { UserContext, SocketContext } from "../App";
import { useContext, createContext } from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ChatRoom from './ChatRoom';
export default function Home(){
    const [user, setUser] = useContext(UserContext)
    const [socket, setSocket] = useContext(SocketContext)
    const [chats, setChatRooms] = useState([])
    const navigate = useNavigate()
    const joinRoom = (roomId, roomName) => {
        console.log(user)
        console.log(roomId)
        return navigate(`/chatroom/?roomId=${roomId}&roomName=${roomName}`)
    }
    
    useEffect(() => {
        const getAllRooms = async () => {
            try{
                const res = await axios.get('/rooms', {headers: {'Authorization': `Bearer ${user.accessToken}`}})
                const { chatRooms } = await res.data
                console.log(chatRooms)
                const arr = chatRooms.map(item => {
                    return <div key={item._id} className='room' id={item._id}>
                        <div className='room_name'>{item.name}</div>
                        <div className='room_joinBtn'>
                            <button onClick={() => joinRoom(item._id, item.name)}>JOIN</button>
                        </div>
                    </div>
                })
                setChatRooms(arr)
            }catch(err){
                console.log(err)
            }
        }
        if(user.accessToken){
            getAllRooms()
            const newSocket = io('localhost:8080', {transports: ["websocket", "polling"]})
            setSocket( newSocket )
            newSocket.on('connect', () => console.log('Socket connection is established'))
        }
    }, [user])
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