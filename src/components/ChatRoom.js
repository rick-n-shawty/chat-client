import { UserContext } from '../App';
import {useEffect, useContext, useState} from 'react';
import { SocketContext } from '../App';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
export default function ChatRoom(){
    const [user, setUser] = useContext(UserContext)
    const [socket, setSocket] = useContext(SocketContext)
    const [msg, setMsg] = useState('')
    const [messges, setMessages] = useState([])
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const roomId = queryParams.get('roomId')
    const roomName = queryParams.get('roomName')
    useEffect(() => {
        socket.emit('joinRoom', roomName)
        socket.on('message', (message) => {
            const arr = message.map(item =>{
                return <div key={item._id}>
                    {item.senderName}: {item.content}
                </div>
            })
            setMessages(arr)
        })
    }, [])
    const sendMessage = () => {
        socket.emit('sendMessage', roomName, {msg, accessToken: user.accessToken, roomId})
        socket.on('message', (message) => {
            const arr = message.map(item =>{
                return <div key={item._id}>
                    {item.senderName}: {item.content}
                </div>
            })
            setMessages(arr)
        })
    }
    return(
        <div className="chat-room">
            <h1>Chat room: {roomId}</h1>
            <div className='container'>
                <div className='mesages'>
                    {messges}
                </div>
                <div className='input-container'>
                    <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder='type...'/>
                    <button onClick={sendMessage}>send</button>
                </div>
            </div>
        </div>
    )
}