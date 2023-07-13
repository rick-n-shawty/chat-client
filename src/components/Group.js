import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SocketContext, UserContext } from "../App";
import { useState, useEffect, useContext, useMemo } from 'react';
import Message from "../sub-components/message-card";
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
            console.log('user object', user)
            const payload = {
                accessToken: user.accessToken,
                groupId: id
            }
            socket.emit('joinGroup', payload)
            const handleMessage = (data) => {
                if(Array.isArray(data)){
                    const arr = data.map(item => {
                        return (
                            <Message key={item._id} data={item} isGroup={true} isMine={ user.email === item.senderName }/>
                        )
                    })
                    setMessages(arr)
                }else if(typeof data === 'object' && data !== null){
                    setMessages(prev => {
                        const el = <Message key={data._id} data={data} isGroup={true} isMine={ data.senderName === user.email }/>
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
    const sendMessage = (e) => {
        e.preventDefault()
        const payload = {
            accessToken: user.accessToken,
            msg,
            chatId: id
        }
        socket.emit('sendGroupMessage', id, payload)
        setMsg('')
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
            <div className="group_chat-container">
                <div className="group_chat-scroll">
                    { messages }
                </div>
            </div>
            <div className="group_input-box">
                <form onSubmit={sendMessage} className="group_input-box__wrapper">
                    <input placeholder="Type a message" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                    <button>send</button>
                </form>
            </div>
        </div>
    )
}