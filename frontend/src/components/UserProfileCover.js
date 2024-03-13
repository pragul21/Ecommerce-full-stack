import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
const UserProfileCover = () => {
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');

    const [user, setUser] = useState([])
    const navigate = useNavigate();


    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    const userDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getprofile`, CONFIG_OBJ)
            // debugger
            if (response.status === 200) {
                setUser(response.data.userDetails)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateProfile = async () => {
        const updated = { email, fullName, contactNumber, password }
        try {
            const response = await axios.put(`${API_BASE_URL}/updateuser`, updated)
            if (response.status === 200) {
                navigate('/')
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Could not update your details'
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        userDetails()
    }, [])
    return (
        <div>
            <h2>User Profile</h2>

            <form className='mb-5'>
                <div className='row'>
                    <label className='login-label'>E-mail:<span style={{ fontWeight: '100' }}>{user.email}</span></label>
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='login-input' placeholder='Enter Your Email'></input>
                </div>
                <div className='row'>
                    <label className='login-label'>Full Name:<span style={{ fontWeight: '100' }}>{user.fullName}</span></label>
                    <input type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} className='login-input' placeholder='Enter Your FullName'></input>
                </div>
                <div className='row'>
                    <label className='login-label'>Contact Number:<span style={{ fontWeight: '100' }}>{user.contactNumber}</span></label>
                    <input type='text' value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className='login-input' placeholder='Enter Your Contact Number'></input>
                </div>

                <div className='row'>
                    <label className='login-label'>Password:</label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='login-input' placeholder='Enter Your Password'></input>
                </div>

                <div className='row' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button className='btn btn-warning' onClick={updateProfile} style={{ width: '20%', marginTop: '20px' }}>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default UserProfileCover