import React from 'react'
import './card.css'
// import shirt from '../../images/shirt1.jpg'
import { useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
// import Swal from 'sweetalert2'
const Card = (props) => {
    const navigate = useNavigate()
    const productDetails = (id) => {
        navigate(`/productdetails/${id}`)
    }
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    const addToCart = async (productId) => {
        // console.log(productId)
        try {
            const response = await axios.post(`${API_BASE_URL}/addtocart/${productId}`, {}, CONFIG_OBJ)
            if (response.status === 200) {
                navigate('/cart')
            }
        } catch (error) {
            console.log(error)
        }
    }
    // console.log(props.product._id)
    if (!props.product) {
        return null;
    }
    return (
        <div>
            <div className="card ">

                <img className="card-img-top sliderImg" onClick={() => productDetails(props.product._id)} src={props.product.image} height={230} alt={props.product.productName} />
                <div className="card-body">
                    <h4 className="card-title card-dec">{props.product.productName}</h4>
                    <h5 style={{ color: 'green', fontWeight: '3', textDecoration: 'underline' }}> {props.product.sellerName}</h5>
                    <h6 className="card-price card-dec"><span>{props.doller}</span>{props.product.price}</h6>
                    <p className="card-text card-dec">{props.product.description}.</p>
                    <button type="button" onClick={() => addToCart(props.product._id)} className="btn btn-warning">  <FontAwesomeIcon className='cart-btn' icon={faCartShopping} /> Add to
                        Cart</button>
                </div>
            </div>

        </div >
    )
}

export default Card