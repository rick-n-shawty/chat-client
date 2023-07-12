import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SocketContext, UserContext } from "../App";
import { useState, useEffect, useContext, useMemo } from 'react';
export default function Group(){
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const id = queryParams.get('id')
    const groupName = queryParams.get('groupName')
    const [user, setUser] = useContext(UserContext)
    const [socket, setSocket] = useContext(SocketContext)
    const [msg, setMsg] = useState('')
    const [messages, setMessages] = useState([])
    const navigate = useNavigate()
    const leaveRoom = () => {
        socket.emit('leaveGroup', id)
        return navigate('/')
    }

    useEffect(() => {
        if(socket){
            const payload = {
                accessToken: user.accessToken,
                groupId: id
            }
            socket.emit('joinGroup', payload)
            const handleMessage = (data) => {
                if(Array.isArray(data)){
                    console.log('I GOT THE ARRAY')
                    const arr = data.map(item => {
                        return (
                            <div className="" key={item._id}>{item.content}</div>
                        )
                    })
                    setMessages(arr)
                }else if(typeof data === 'object' && data !== null){
                    console.log('I GOT THE OBJECT')
                    setMessages(prev => {
                        const el = <div key={data._id}>{data.content}</div>
                        const arr = [...prev, el]
                        return arr
                    })
                }
            }
            socket.on('message', handleMessage)

            return () => {
                socket.off('message', handleMessage)
            }
        }
    }, [socket])
    const sendMessage = () => {
        const payload = {
            accessToken: user.accessToken,
            msg,
            chatId: id
        }
        socket.emit('sendGroupMessage', id, payload)
    }
    return(
        <div className="group">
            <header className="group_header">
                <div className="group_header__left">
                    <p className="name">{groupName}</p>
                    <p className="memebers">3 members</p>
                </div>
                <div className="group_header__right">
                    <button onClick={(e) => leaveRoom()}>Leave room</button>
                </div>
            </header>
            <div className="group_chat-scroll">
                { messages }
            </div>
            <div className="group_input-box">
                <div className="group_input-box__wrapper">
                    <input placeholder="Type a message" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                    <button onClick={sendMessage}>send</button>
                </div>
            </div>
        </div>
    )
}