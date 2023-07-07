import { UserContext, SocketContext } from '../App';
import {useEffect, useContext, useState} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
export default function ChatRoom(){
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const id = queryParams.get('id')
    const name = queryParams.get('name')
    const [user, setUser] = useContext(UserContext)
    const [socket, setSocket] = useContext(SocketContext)
    const [messages, setMessages] = useState([])
    const [msg, setMsg] = useState('')
    useEffect(() => {
        if(socket){
            socket.emit('joinRoom', name)
            socket.on('message', (data) => {
                const arr = data.map(item => {
                    return(
                        <div className='text' key={item._id}>
                            <div className='sender'>{item.senderName}</div>
                            <div className='msg'><p>{item.content}</p></div>
                        </div>
                    )
                })
                setMessages(arr)
            })
        }
    }, [])
    const sendMessage = () => {
        const payload = {
            roomId: id, 
            msg,
            accessToken: user.accessToken
        }
        socket.emit('sendMessage', name, payload)
    }
    return(
        <div className="chat-room">
            <h1>Chat room {id}</h1>
            <div className='input-container'>
                <input placeholder='type...' value={msg} onChange={(e) => setMsg(e.target.value)}/>
                <button onClick={sendMessage}>send</button>
            </div>
            <div className='container'>
                <div className='messages'>
                    {messages}
                </div> 
            </div>
        </div>
    )
}