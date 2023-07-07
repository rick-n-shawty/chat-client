import Header from "./Header";
import axios from "axios";
import { SocketContext, UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
export default function CreateGroup(){
    const [members, setMembers] = useState([])
    const [socket, setSocket] = useContext(SocketContext)
    const [user, setUser] = useContext(UserContext)
    const [input, setInput] = useState({person: '', groupName: ''})
    const [accounts, setAccounts] = useState([])
    const handleInput = (e) => {
        setInput(prev => {
            const obj = {...prev}
            obj[e.target.name] = e.target.value 
            return obj 
        })

        if(e.target.name === 'person'){
            const query = {
                content: input.person,
                accessToken: user.accessToken 
            }    
            socket.emit('search', query)
        }
    }
    const addToGroup = (id) => {
        setMembers(prev => {
            const arr = [...prev, id]
            return arr 
        })
        console.log(members)
    } 
    useEffect(() => {
        if(socket){
            socket.on('message', (data) => {
                console.log(data)
                const arr = data.map(item => {
                    return <div
                     key={item._id}
                     className='account-container'
                     style={{display: 'flex'}}
                     >
                        <div className='left'>{item.email}</div>
                        <div className='right'><button onClick={(e) => addToGroup(item._id)}>Add to group</button></div>
                     </div>
                })
                setAccounts(arr)
            })
        }
    }, [socket])
    const createGroup = async () => {
        try{
            console.log('MEMBERS', members)
            const res = await axios.post('/api/v1/rooms/create', {
                members: members,
                name: input.groupName
            }, {
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`, 
                    "Content-Type": "application/json"
            }})
            console.log(await res.data)
        }catch(err){
            console.log(err)
        }
    }
    return(
        <>
            <h1>Create a group</h1>
            <div></div>
            <input name="groupName" placeholder="group-name" value={input.groupName} onChange={(e) => handleInput(e)}/> 
            <button onClick={createGroup}>Create!</button>
            <div>
                <input name="person" placeholder="people" value={input.person} onChange={(e) => handleInput(e)}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {accounts}
            </div>
        </>
    )
}