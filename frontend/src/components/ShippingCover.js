import React, { useState } from 'react'
import './ShippingCover.css'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import { useNavigate } from 'react-router-dom'

const ShippingCover = () => {
    const [fullName, setFullName] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [country, setCountry] = useState('')

    const navigate = useNavigate()

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    const order = async (e) => {
        e.preventDefault();
        // console.log('aalu')
        const shipping = { fullName, address, city, postalCode, country }
        try {
            const response = await axios.post(`${API_BASE_URL}/cart`, shipping, CONFIG_OBJ)
            navigate('/preview')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <div className='container'>
                <h2>Shipping Address</h2>
                <div className='row'>
                    <label className='label-ship'>Full Name:</label>
                    <input type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} className='input-ship' placeholder='Enter Your Name'></input>
                </div>
                <div className='row'>
                    <label className='label-ship'>Address:</label>
                    <input type='text' value={address} onChange={(e) => setAddress(e.target.value)} className='input-ship ' placeholder='Enter Your Address'></input></div>
                <div className='row'>
                    <label className='label-ship'> City:</label>
                    <input type='text' value={city} onChange={(e) => setCity(e.target.value)} className='input-ship ' placeholder='Enter Your City'></input></div>
                <div className='row'>
                    <label className='label-ship'>Postal Code:</label>
                    <input type='text' value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className='input-ship ' placeholder='Enter Your Postal code'></input></div>
                <div className='row'>
                    <label className='label-ship'>Country</label>
                    <input type='text' value={country} onChange={(e) => setCountry(e.target.value)} className='input-ship ' placeholder='Enter Your Country'></input></div>

                <div className='row'>
                    {/* <NavLink to='/payment' className='link-ship'> */}
                    <input type='button' onClick={order} className='ship-btn ' value='Submit'></input>
                    {/* </NavLink> */}
                </div>
            </div>
        </div>
    )
}

export default ShippingCover