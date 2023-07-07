import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../App';
export default function Header(){
    const [socket, setSocket] = useContext(SocketContext)
    const [text, setText] = useState('')
    const [accounts, setAccounts] = useState([])
    const [members, setMembers] = useState([])
    const search = (e) => {
        socket.emit('search', e.target.value)
        setText(e.target.value)
    }
    const addToGroup = async (id) => {
        try{
            const res = null
        }catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        if(socket){
            // socket.on('message', (msg) => {
            //     console.log(msg)
            //     const arr = msg.map(item => {
            //         return <div
            //          key={item._id}
            //          className='account-container'
            //          >
            //             <div className='left'>{item.email}</div>
            //             <div className='right'><button onClick={(e) => addToGroup(item._id)}>Add to group</button></div>
            //          </div>
            //     })
            //     setAccounts(arr)
            // })
        }
    }, [socket])
    return(
        <header>
            <div className="left">
                <h1>Chat App!</h1>
            </div>
            <div className="center">
                <input value={text} onChange={(e) => search(e)} placeholder='Search your friends...'/>
                <div className={text.length > 0 ? "popup active" : "popup"}>
                    {accounts}
                </div>
                <button>Search</button>
            </div>
            <div className="right">
                <ul>
                    <li><Link to={'/makegroup'}>Create group</Link></li>
                    <li><Link to={'/profile'}>Profile</Link></li>
                </ul>
            </div>
        </header>
    )
}