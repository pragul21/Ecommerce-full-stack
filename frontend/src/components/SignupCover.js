import axios from 'axios';
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { API_BASE_URL } from '../config';
import Swal from 'sweetalert2';

const SignupCover = () => {
    const [fullName, setFullName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false)

    const signup = (event) => {
        event.preventDefault();
        const requestData = { fullName, contactNumber, email, password, confirmPassword }
        axios.post(`${API_BASE_URL}/signup`, requestData)
            .then((result) => {
                debugger;
                if (result.status === 201) {
                    setLoading(false)
                    Swal.fire({
                        icon: 'success',
                        title: 'User successfully registered'
                    })
                }
                setFullName('')
                setContactNumber('')
                setEmail('')
                setPassword('')
                setPassword('')
                setConfirmPassword('')

            }).catch((error) => {
                console.log(error)
                setLoading(false)
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error
                })
            })
        setLoading(true)
    }
    return (
        <div>
            <h2>Signup</h2>
            {loading ? <div className='row '>
                <div className='col-md-12'>
                    <div className="spinner-border text-secondary " role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div> : ''}
            <div className='row'>
                <label className='login-label'>Full Name:</label>
                <input type='text' value={fullName} onChange={(ev) => setFullName(ev.target.value)} className='login-input' placeholder='Enter Your FullName'></input>
            </div>
            <div className='row'>
                <label className='login-label'>Contact Number:</label>
                <input type='texts' value={contactNumber} onChange={(ev) => setContactNumber(ev.target.value)} className='login-input' placeholder='Enter Your Contact Number'></input>
            </div>
            <div className='row'>
                <label className='login-label'>E-mail:</label>
                <input type='email' value={email} onChange={(ev) => setEmail(ev.target.value)} className='login-input' placeholder='Enter Your Email'></input>
            </div>
            <div className='row'>
                <label className='login-label'>Password:</label>
                <input type='password' value={password} onChange={(ev) => setPassword(ev.target.value)} className='login-input' placeholder='Enter Your Password'></input>
            </div>
            <div className='row'>
                <label className='login-label'>Confirm Password:</label>
                <input type='password' value={confirmPassword} onChange={(ev) => setConfirmPassword(ev.target.value)} className='login-input' placeholder='Enter Your Password'></input>
            </div>
            <div className='row'>
                <input type='submit' className='login-button' value='Submit' onClick={(e) => signup(e)}></input>
            </div>
            <div className='row'>
                <p className='login-para'>Do you have an account? <NavLink to='/login'>Login</NavLink></p>
            </div>
        </div>
    )
}

export default SignupCover