import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { SocketContext, UserContext } from '../App';
export default function Header(){
    const [socket, setSocket] = useContext(SocketContext)
    const [user, setUser] = useState(UserContext)
    useEffect(() => {

    }, [user])
    return(
        <header>
            <div className="left">
                <h1>Chat App!</h1>
            </div>
            <div className="right">
                <ul>
                    <li><Link to={'/makegroup'}>Create group</Link></li>
                    <li><Link to={'/profile'}>Profile</Link></li>
                    <li><Link to={'/findpeople'}>Find people</Link></li>
                </ul>
            </div>
        </header>
    )
}