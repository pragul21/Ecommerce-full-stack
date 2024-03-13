import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'
import axios from 'axios'

const OrderHistoryCover = () => {
    const [orders, setOrders] = useState([])
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
    const getMyOrders = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getmyorders`, CONFIG_OBJ)
            // debugger
            if (response.status === 200) {
                setOrders(response.data.order)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getMyOrders()
    }, [])
    return (
        <div>

            <h2>Order History</h2>

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
                            </div>
                            <hr style={{ height: '10px', color: 'grey' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default OrderHistoryCover