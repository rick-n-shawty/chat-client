import { Link, NavigationType, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react'; 
import { UserContext } from '../App';
import axios from 'axios';
export default function Register(){
    const [user, setUser] = useContext(UserContext)
    const [credentials, setCredentials] = useState({email: '', password: '', name: ''})
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const submit = async (e) => {
        e.preventDefault()
        try{
            const res = await axios.post('/api/v1/register', credentials, {headers: {'Content-Type': "application/json"}})
            const {accessToken, refreshToken} = await res.data
            if(!accessToken || !refreshToken) {
                setError('Something went wrong')
                return 0
            }
            setUser({accessToken})
            localStorage.setItem('refreshToken',refreshToken)
            setError('')
            return navigate('/')
        }catch(err){
            setError(err.response.data.err)
            console.log(err)
        }
    }
    const inputHandle = (e) => {
        setCredentials(prev => {
            const obj = {...prev}
            obj[e.target.name] = e.target.value 
            return obj
        })
        setError('')
    }
    return(
        <div className="register-page">
            <h1>Register page</h1>
            <form onSubmit={submit}>
                <input name='email' placeholder="email" value={credentials.email} onChange={(e) => inputHandle(e)}/>
                <input name='name' placeholder="name" value={credentials.name} onChange={(e) => inputHandle(e)}/>
                <input name='password' placeholder="password" value={credentials.password} onChange={(e) => inputHandle(e)}/>
                <Link to={'/login'}>Login</Link>
                <button>Register</button>
            </form>
            <h3>{error}</h3>
        </div>
    )
}