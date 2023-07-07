import { io } from 'socket.io-client';
import { UserContext, SocketContext } from "../App";
import { useContext, createContext } from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ChatRoom from './ChatRoom';
import Header from './Header';
export default function Home(){
    const [user, setUser] = useContext(UserContext)
    const [socket, setSocket] = useContext(SocketContext)
    const [rooms, setRooms] = useState([])
    const [logMsg, setLog] = useState('')
    const navigate = useNavigate()
    const joinGroup = (id, name) => {
        return navigate(`/chatroom/?id=${id}&name=${name}`)
    }
    const establishConnection = async () => {
        console.log('running')
        try{
            setLog('connecting...')
            const newSocket = io('https://chat-server-lgtp.onrender.com', {transports: ['websocket', 'polling']})
            setSocket(newSocket)
            const res = await axios.get('/api/v1/rooms', {headers: {'Authorization': `Bearer ${user.accessToken}`, "Content-Type": "application/json"}})
            const {chatRooms} = await res.data
            const arr = chatRooms.map(item => {
                return(
                    <div key={item._id} className='room'>
                        <div>{item.name}</div>
                        <button onClick={(e) => joinGroup(item._id, item.name)}>JOIN</button>
                    </div>
                )
            }) 
            setRooms(arr)
            console.log('connection is established')
            setLog('')
            return true
        }catch(err){
            console.log(err)
            return false
        }
    }
    useEffect(() => {
        establishConnection()
        return () => {
            if(socket) {
                socket.close()
            }
        }
    }, [user])
    return(
        <div className="home">
            <Header/>
            <div className='container'>
                {logMsg ? <h1>{logMsg}</h1>: ""}
                <div className='left'>
                    {rooms}
                </div>
            </div>
        </div>
    )
}