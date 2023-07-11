import Header from "./Header";
import axios from "axios";
import { SocketContext, UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function CreateGroup(){
    const [members, setMembers] = useState({elements: [], objects: []})
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
    const addToGroup = (item) => {
        setMembers(prev => {
            const objArr = [...prev.objects, item._id]
            const element = <div className="added-acc" key={item._id}>
                <p>{item.email}</p>
            </div>
            const elementsArr = [...prev.elements, element]
            return {elements: elementsArr, objects: objArr}
        })
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
                        <div className='right'><button onClick={(e) => addToGroup(item)}>Add to group</button></div>
                     </div>
                })
                setAccounts(arr)
            })
        }
    }, [socket])
    const createGroup = async (e) => {
        console.log('MEMBERS', members)
        try{
            e.preventDefault()
            const res = await axios.post('/api/v1/chats/create/group', {
                members: members.objects,
                groupName: input.groupName, 
                type: 'group'
            }, {
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`, 
                    "Content-Type": "application/json"
            }})
            console.log(await res.data)
            setAccounts([])
            setMembers({objects: [], elements: []})
        }catch(err){
            console.log(err)
        }
    }
    return(
        <div className="create-group-container">
            <header>
                <div className="left">
                    <h1>Create a group</h1>
                </div>
                <div className="right">
                    <ul>
                        <li><Link to={'/'}>Back home</Link></li>
                    </ul>
                </div>
            </header>
            <div className="wrapper">
                <form>
                    <input name="person" placeholder="people" value={input.person} onChange={(e) => handleInput(e)}/>
                    <input name="groupName" placeholder="group-name" value={input.groupName} onChange={(e) => handleInput(e)}/> 
                    <button onClick={createGroup}>Create!</button>
                </form>
                <div className="added-accounts">
                    {members.elements}
                </div>
                <div className="suggested-accounts">
                    {accounts}
                </div>
            </div>
        </div>
    )
}