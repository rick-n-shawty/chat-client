import { UserContext } from '../App';
import {useContext, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
export default function Login(){
    const [user, setUser] = useContext(UserContext)
    const [emailInput, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const submitForm = async (e) => {
        try{
            e.preventDefault()
            const res = await axios.post('/api/v1/login', { email: emailInput, password: password }, {headers: {"Content-Type": "application/json"}})
            console.log(await res.data)
            const {accessToken, refreshToken, email} = await res.data 
            if(accessToken && refreshToken && email){
                setUser({accessToken, email})
                localStorage.setItem('refreshToken', refreshToken)
                return navigate('/')
            }
        }catch(err){
            console.log(err)
        }
    }
    return(
        <div className="login-page">
            <form className='login-form' onSubmit={submitForm}>
                <input placeholder='email' value={emailInput} onChange={(e) => setEmail(e.target.value)}/>
                <input placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Link to={'/register'}>register</Link>
                <button>Login</button>
            </form>
        </div>
    )
}