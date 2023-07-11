import { Link } from "react-router-dom";
import { UserContext, SocketContext } from "../App";
import { useState, useContext, useEffect } from 'react'; 

export default function FindPpl(){
    const [accounts, setAccounts] = useState({elements: [], objects: []})
    const [user, setUser] = useContext(UserContext)
    const [socket, setSocket] = useContext(SocketContext)
    const [inputText, setInputText] = useState('')
    const handleInput = (e) => {
        const text = e.target.value 
        setInputText(text)
        const obj = { content: text, accessToken: user.accessToken }
        socket.emit('search', obj)
    }
    useEffect(() => {
        if(socket){
            socket.on('message', (data) => {
                console.log(data)
                const arr = data.map(item => {
                    return <div key={item._id} className="account-div">
                        <div className="left">
                            {item.email}
                        </div>
                        <button>send a message</button>
                    </div>
                })
                setAccounts({elements: arr, objects: data})
            })
        }
    }, [socket])
    return(
        <div className="find-ppl-container">
            <header>
                <div className="left">
                    <h1>Find who you looking for!</h1>
                </div>
                <div className="right">
                    <ul><li><Link to={'/'}>Back home</Link></li></ul>
                </div>
            </header>
            <div className="wrapper">
                <form>
                    <input placeholder="search..." onChange={(e) => handleInput(e)} value={inputText}/>
                </form>
                <div className="accounts">
                    {accounts.elements}
                </div>
            </div>
        </div>
    )
}