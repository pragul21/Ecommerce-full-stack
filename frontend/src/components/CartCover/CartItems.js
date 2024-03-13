import React, { useState } from 'react'

import './CartCover.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import Swal from 'sweetalert2'

const CartItems = (props) => {
    // this is one way to change quantity but not gonna make changes in database 
    // const [count, setCount] = useState(props.productDetails?.quantity);
    // const increaseNum = () => {

    //     if (count < 10) {

    //         setCount(count + 1);
    //     }
    // }
    // const decreaseNum = () => {
    //     if (count > 1) {
    //         setCount(count - 1);
    //     }
    // // }
    const [loading, setLoading] = useState(false)
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    //to increase count i am using add to cart api
    const increaseQuantity = async (productId) => {
        setLoading(true)
        // console.log(productId)
        try {
            const response = await axios.post(`${API_BASE_URL}/addtocart/${productId}`, {}, CONFIG_OBJ)
            if (response.status === 200) {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Some error check'
            })
        }
    }

    const decreaseQuantity = async (productId) => {

        // console.log(productId)
        try {
            const response = await axios.put(`${API_BASE_URL}/minusitem/${productId}`, {}, CONFIG_OBJ)

        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Some error check'
            })
        }
    }
    const removeProduct = async (productId) => {

        try {
            const response = await axios.delete(`${API_BASE_URL}/deletecart/${productId}`, CONFIG_OBJ)


        } catch (error) {
            console.log(error)
        }
    }
    if (!props.productDetails) {
        return null;
    }
    return (
        <div>

            <div className='card shadow'>
                <div className="row">
                    <div className="col">
                        <img src={props.productDetails.image} className='cart-img' width="110%" alt=" product" />

                    </div>
                    <div className="col">
                        <div className="row">
                            <h5>{props.productDetails.productName}</h5>
                        </div>
                        <div className="row">
                            <h6 className='cart-h6' ><span>{props.doller}</span>{props.productDetails.price}</h6>
                        </div>
                        <div className="row">
                            <button className="cart-btn1" onClick={() => removeProduct(props.productDetails.productId)}><FontAwesomeIcon className='cart' icon={faTrash} /></button>
                        </div>
                    </div>
                    <div className="col">
                        <div>
                            <button className='cart-btn2' onClick={() => decreaseQuantity(props.productDetails.productId)}>-</button>
                            <input type="number" id="demoinput" readOnly value={props.productDetails.quantity} />
                            <button id="add" onClick={() => increaseQuantity(props.productDetails.productId)}>+</button>
                        </div>
                    </div>
                    {loading ? <div className='row '>
                        <div className='col-md-12'>
                            <div className="spinner-border text-secondary " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div> : ''}
                </div>
            </div>
        </div>
    )
}

export default CartItems