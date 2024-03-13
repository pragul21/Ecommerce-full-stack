import React, { useEffect, useState } from 'react';
import './PreviewOrderCover.css';
import Swal from 'sweetalert2';
import { NavLink, resolvePath } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
// import PayPal from './PayPal';
import PreviewProduct from './PreviewProduct';
// import PayPalButton from 'react-paypal-button-v2';

const PreviewOrderCover = () => {
    const [cartDetail, setCartDetail] = useState(null);
    const [products, setProducts] = useState([])
    // const [paydone, setPaydone] = useState(false)
    const navigate = useNavigate()
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
    const getCartDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getcartdetails`, CONFIG_OBJ)
            // debugger
            if (response.status === 200) {
                setCartDetail(response.data.cart)
                setProducts(response.data.product)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occured while getting Cart details'
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    const completePayment = async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/payment`, { userId: cartDetail.userId }, CONFIG_OBJ)
            if (response.status === 200) {
                getCartDetails()
                // setPaydone(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Payment done'
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Some error while getting Cart details'
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const order = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/order`, {}, CONFIG_OBJ)
            if (response.status === 200) {
                if (response.data.order && response.data.emptyCart)
                    navigate('/allproducts')
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Click on paynow'
                })
                console.log(response.data.error)
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Click on paynow'
            })
        }
    }

    useEffect(() => {
        getCartDetails()
    }, [])
    return (
        <div>
            {/* {checkout ? (
                <PayPal />
            ) : ( */}
            <div>
                {cartDetail && <div className='container '>
                    <h2> Preview Order</h2>
                    <div className='row'>
                        <div className='col'>
                            <div className='row'>
                                <div className="card  mt-3" style={{ backgroundColor: "white ", backgroundImage: "none" }}>
                                    <div className="card-body preview-card">
                                        <h5 className="card-title">Shipping</h5>
                                        <p className="card-text" ><span style={{ fontWeight: "500", color: 'grey' }}>Name:</span>{cartDetail.shipping.fullName}</p>
                                        <p className="card-text"><span style={{ fontWeight: "500", color: 'grey' }}>Address:</span> {cartDetail.shipping.address}</p>
                                        <p className="card-text"><span style={{ fontWeight: "500", color: 'grey' }}>City:</span> {cartDetail.shipping.city}</p>
                                        <p className="card-text"><span style={{ fontWeight: "500", color: 'grey' }}>Country:</span> {cartDetail.shipping.country}</p>
                                        <p className="card-text"><span style={{ fontWeight: "500", color: 'grey' }}>PostalCode:</span> {cartDetail.shipping.postalCode}</p>
                                        <NavLink to='/shipping'>Edit</NavLink>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="card" style={{ backgroundColor: "white ", backgroundImage: "none" }}>
                                    <div className="card-body preview-card">
                                        <h5 className="card-title">Payment</h5>
                                        <p className="card-text"><span style={{ fontWeight: "500" }}>Method:</span> Paypal </p>
                                        <button className='btn btn-danger' onClick={completePayment}> Pay Now</button>
                                        {cartDetail.payment.status == "Completed" ? < div style={{
                                            color: 'green', fontWeight: '500'
                                        }}>Payment Completed</div> : ''}

                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="card shadow " style={{ backgroundColor: "white ", backgroundImage: "none" }}>
                                    <div className="card-body preview-card">
                                        <h5 className="card-title">Items</h5>
                                        {products?.map((product) => {
                                            return (
                                                <div className='row' key={product._id}>

                                                    <PreviewProduct product={product} cartDetail={cartDetail} getCartDetails={getCartDetails} doller='$'></PreviewProduct>
                                                    <hr></hr>

                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col'>
                            <div className="cardd  mt-3" style={{ backgroundColor: "white ", backgroundImage: "none" }}>
                                <div className="card-body preview-card">
                                    <h5 className="card-title">Order Summary</h5>
                                    <div className='row'>
                                        <div className='col-6'>Items</div>
                                        <div className='col-6'>${cartDetail.total}</div>
                                    </div>
                                    <hr style={{ color: "black" }} />
                                    <div className='row'>
                                        <div className='col-6'>Shipping</div>
                                        <div className='col-6'>$50</div>
                                    </div>
                                    <hr style={{ color: "black" }} />
                                    <div className='row'>
                                        <div className='col-6'><b>Order Total</b></div>
                                        <div className='col-6'><b>${cartDetail.total + 50}</b></div>
                                    </div>
                                    <div className='row'>
                                        <button className='btn btn-warning order-btn' onClick={order}> Place Order</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div >
            {/* )} */}
        </div >
    )
}

export default PreviewOrderCover