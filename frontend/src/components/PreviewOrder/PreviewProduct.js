import React from 'react'
import './PreviewOrderCover.css'
import kids4 from '../../images/kids4.jpg'

import { NavLink, Link } from 'react-router-dom'

const PreviewProduct = (props) => {
    const currProduct = props.cartDetail.orderItems.find((item) => item.productId === props.product._id)
    return (
        <div>

            <div className='row'>
                <div className='col-lg-2 col-md-3'>
                    <img src={props.product.image} className='preview-img' alt='cart order overview'></img>

                </div>
                <div className='col-3 '>
                    <Link >{props.product.productName}</Link>
                </div>
                <div className='col-3'>
                    <span>{currProduct && <p>{currProduct.quantity}</p>}</span>
                </div>
                <div className='col-3'>
                    <span>${props.product.price}</span>
                </div>

            </div>
            <NavLink to='/cart' style={{ marginTop: "10px" }}>Edit</NavLink>

        </div>
    )
}

export default PreviewProduct