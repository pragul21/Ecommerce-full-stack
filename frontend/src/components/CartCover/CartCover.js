import React, { useEffect, useState } from 'react'
import './CartCover.css'
import { NavLink } from 'react-router-dom'
import { API_BASE_URL } from '../../config'
import axios from 'axios'
import CartItems from './CartItems'
import Swal from 'sweetalert2'

const CartCover = () => {
    const [cartProduct, setCartProduct] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    };

    const price = () => {
        const add = cartProduct.reduce((productDetails, currentValue) => {
            const productPrice = currentValue?.quantity * currentValue?.price || 0;
            return productDetails + productPrice;
        }, 0);
        setTotalPrice(add);
    };

    const getCart = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getcart`, CONFIG_OBJ);
            if (response.status === 200) {
                // debugger
                setCartProduct(response.data.productDetails);
            } else {
                throw new Error("Could not get cart products");
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            // Handle error, e.g., display error message to the user
        }
    };



    useEffect(() => {
        getCart()
        price();
    }, [cartProduct]);

    return (
        <div>
            <div className="container cart-container" >

                <div className="row">

                    <div className="col-lg-8  col-sm-12">
                        <div className="card">
                            <div className="row">
                                <div className="col">
                                    <h3 className='cart-h3' >Items in cart</h3>
                                </div>
                            </div>
                            <div className='row'>
                                {cartProduct?.map((productDetails) => {
                                    // console.log('pd:', productDetails)
                                    return (
                                        <div className="row" key={productDetails.productId}>
                                            <CartItems productDetails={productDetails} getCart={getCart} doller='$' />

                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-10 " >
                        <div className="card cart-summary shadow">
                            <div className="header cart-header" >
                                <h3 className='cart-h3'>Summary</h3>
                            </div>
                            <div className="card-body cart-card" >

                                <div className="row cart-row" >
                                    <div className="col ">
                                        <p>Cost</p>
                                    </div>
                                    <div className="col">
                                        <p>${totalPrice}</p>
                                    </div>
                                </div>
                                <div className="row cart-row">
                                    <div className="col">
                                        <p>Shipping</p>
                                    </div>
                                    <div className="col">
                                        <p>$50</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row cart-row">
                                    <div className="col">
                                        <h4 style={{ color: 'black' }}>Total</h4>
                                    </div>
                                    <div className="col">
                                        <h4 style={{ color: 'black' }}>${totalPrice + 50}</h4>
                                    </div>

                                </div>
                                <div className="row">
                                    <NavLink to='/shipping'> <button className='cart-btn3'
                                    >Checkout</button></NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartCover