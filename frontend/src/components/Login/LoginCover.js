import React, { useState } from 'react'
import './LoginCover.css'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'

const LoginCover = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const login = (event) => {
        event.preventDefault()
        setLoading(true)
        const requestData = { email, password }
        axios.post(`${API_BASE_URL}/login`, requestData)
            .then((result) => {
                // debugger;
                if (result.status === 200) {

                    localStorage.setItem("token", result.data.result.token);
                    localStorage.setItem("user", JSON.stringify(result.data.result.user))
                    //dispatching to redux
                    dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.result.user })
                    setLoading(false);
                    navigate('/')
                }
            }).catch((error) => {
                console.log(error)
                setLoading(false)
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error
                })
            })
    }
    return (
        <div>
            <h2>Login</h2>
            {loading ? <div className='row '>
                <div className='col-md-12'>
                    <div className="spinner-border text-secondary " role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div> : ''}
            <div className='container'>
                <div className='row'>
                    <label className='login-label'>E-mail:</label>
                    <input type='email' onChange={(e) => setEmail(e.target.value)} className='login-input' placeholder='Enter Your Email'></input>
                </div>
                <div className='row'>
                    <label className='login-label'>Password:</label>
                    <input type='password' onChange={(e) => setPassword(e.target.value)} className='login-input' placeholder='Enter Your Password'></input>
                </div>
                <div className='row'>
                    <input type='submit' onClick={login} className='login-button' value='Submit'></input>
                </div>
                <div className='row'>
                    <p className='login-para'>Don't have an account? <NavLink to='/signup'>Sign up</NavLink></p>
                </div>
            </div>
        </div>

    )
}

export default LoginCover