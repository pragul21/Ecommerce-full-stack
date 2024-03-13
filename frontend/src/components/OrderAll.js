import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'
import axios from 'axios'
import Header from './Header/Header'
import Footer from './Footer/Footer'

const OrderAll = () => {
    const [orders, setOrders] = useState([])

    const user = JSON.parse(localStorage.getItem("user"));
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    if (user && user.isAuth) {
        CONFIG_OBJ.headers["isAuth"] = true
    }
    const getAllOrders = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getallorders`, CONFIG_OBJ)
            // debugger
            if (response.status === 200) {
                setOrders(response.data.order)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const isdelivered = async (orderId) => {
        // console.log(orderId)
        try {
            const response = await axios.put(`${API_BASE_URL}/delivered/${orderId}`, {}, CONFIG_OBJ)
            debugger
            if (response.status === 200) {
                // setOrders(response.data.order)
                getAllOrders()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllOrders()
    }, [])
    return (

        <div>
            <Header></Header>
            <h2>All Orders</h2>

            <div className='container' >
                {orders?.map((order, index) => (
                    <div key={index}>
                        <hr style={{ height: '10px', color: 'grey' }} />
                        <div className='container shadow' style={{ backgroundColor: 'lightGrey' }}>
                            <div className='row '>
                                <h4 style={{ color: 'black', textDecoration: 'underline', color: 'green' }}>ID</h4>
                                <h6 style={{ color: 'black', textDecoration: 'underline' }}>{order._id}</h6>
                            </div>
                            <div className='row '>
                                <div className='col-lg-3 col-md-6 col-sm-6'>
                                    <b>Date</b>
                                    <p>{order.updatedAt}</p>
                                </div>
                                <div className='col-lg-3 col-md-6 col-sm-6'>
                                    <b>Total</b>
                                    <p>${order.total}</p>
                                </div>
                                <div className='col-lg-3 col-md-6 col-sm-6'>
                                    <b>Paid</b>
                                    <p>Completed</p>
                                </div>
                                <div className='col-lg-3 col-md-6 col-sm-6'>
                                    <b>Delivery</b>
                                    <p>{order.delivered ? "Delivered" : "Not Delivered"}</p>
                                </div>
                                <button className='btn btn-warning' onClick={() => isdelivered(order._id)} style={{ backgroundColor: 'pink', width: '30%', marginLeft: '35%' }}>delivered</button>

                            </div>
                            <hr style={{ height: '10px', color: 'grey' }} />
                        </div>
                    </div>
                ))}
            </div>
            <Footer></Footer>
        </div >

    )

}

export default OrderAll