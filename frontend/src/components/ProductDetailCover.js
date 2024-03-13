import React, { useEffect } from 'react'
import './ProductDetailCover.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import Swal from 'sweetalert2';

const ProductDetailCover = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true)

    const [reviews, setReviews] = useState('')

    const [product, setProduct] = useState(null);
    const { productId } = useParams();

    const [category, setCategory] = useState('');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    const navigate = useNavigate()
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
    //review
    const submitReview = async (productId) => {

        const request = { 'productId': productId, "comment": reviews }
        const response = await axios.put(`${API_BASE_URL}/reviews`, request, CONFIG_OBJ)
        if (response.status === 200) {
            productDetails();
        }
    }
    //delete product only authorised user can delete
    const deleteProduct = async (productId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/deleteproduct/${productId}`, CONFIG_OBJ)
            if (response.status === 200) {
                navigate('/allproducts')
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Unauthorised to delete'
            })
        }
    }
    //update product
    const updateProduct = async (productId) => {
        const updated = { category: category, productName: productName, price: price, description: description }
        try {
            const response = await axios.put(`${API_BASE_URL}/updateproduct/${productId}`, updated, CONFIG_OBJ)
            if (response.status === 200) {
                productDetails()
                setShow(false)
            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Some Error'
                })
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Unauthorised to update'
            })
        }
    }
    const addToCart = async (productId) => {
        console.log(productId)
        try {
            const response = await axios.post(`${API_BASE_URL}/addtocart/${productId}`, {}, CONFIG_OBJ)
            if (response.status === 200) {
                navigate('/cart')
            }
        } catch (error) {
            console.log(error)
        }
    }
    //get productDetails with productId
    const productDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getproductdetails/${productId}`)
            // debugger
            if (response.status === 200) {

                setProduct(response.data.productDetails)


            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occured while getting all Products'
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        productDetails();
    })
    return (
        <div>
            {product && <div className='container detail-page'>
                <div className='row'>
                    <div className='col-lg-6 col-md-12 col-sm-12'>
                        <img className='detail-img' src={product.image} alt='shirt'></img>
                    </div>
                    <div className='col-lg-3 col-md-6 col-sm-6 shadow'>
                        <h3 className='detail-h3'>{product.productName}</h3><hr />

                        <p>Price:${product.price}</p>
                        <p>Category:{product.category}</p>
                        <p>Description:{product.description}</p>
                        <div className='row'>
                            <div className='col-6'>
                                <button className='btn btn-warning' onClick={handleShow}>Update </button>
                            </div>
                            <div className='col-6'>
                                <button className='btn btn-danger' onClick={() => deleteProduct(productId)} >Delete</button>
                            </div>
                        </div>


                    </div>
                    <div className='col-lg-3 col-md-6 col-sm-6 shadow'>
                        <div className='row mt-3'>
                            <div className='col'>
                                <h6>Seller</h6>
                            </div>

                        </div>



                        <b>{product.sellerName}</b><hr />
                        <p>stock:{product.stock}</p>
                        <NavLink to='/cart'><button type="button" onClick={() => addToCart(product._id)} className="btn btn-warning mb-3">  <FontAwesomeIcon className='cart-btn' icon={faCartShopping} /> Add to
                            Cart</button></NavLink>
                    </div>
                </div>
                <h3 className='product-bottom mt-5' >Review </h3>
                <h6 className='product-bottom ' >{product.reviews.length} reviews</h6>

                <div className='row shadow' id='reviews'>
                    {product.reviews.map((review) => {
                        // console.log(review);
                        // console.log('FullName:', review.commentedBy.fullName);
                        return (
                            <li className='product-reviews'>
                                {review.comment}-<span style={{ fontWeight: '6', fontSize: '12px', color: 'darkgreen' }}>{review.commentedBy.fullName}</span>
                            </li>

                        )

                    })}
                </div>
                <h4 className='write-review'>Write a review </h4>
                <div className='row'>

                    <textarea rows='2' onChange={(e) => setReviews(e.target.value)} className='product-text' placeholder='Write your Review here'></textarea>

                </div>
                <button className='btn btn-warning product-btn' onClick={() => submitReview(product._id)}>Submit</button>

            </div>}
            {/* Modal for editing details of listed product */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>

                    <Modal.Title>Edit Product Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className='row'>
                        <div className='row'>
                            <label style={{ marginLeft: "30px", fontWeight: "600", marginBottom: "0px" }}>Category</label>
                            <select name='Select' value={category} onChange={(e) => setCategory(e.target.value)} className='product-rate'>
                                <option value='select'>Select</option>
                                <option value='men'>Men</option>
                                <option value='women'>Women</option>
                                <option value='kids'>Kids</option>
                            </select>
                        </div>
                        <div className='row'>
                            <label style={{ marginTop: "15px", marginLeft: "30px", fontWeight: "600", marginBottom: "0px" }}>Product Name</label>
                            <input type='text' value={productName} onChange={(e) => setProductName(e.target.value)} className='popup-input' placeholder={`Enter Product Name `}></input>
                        </div>
                        <div className='row'>
                            <label style={{ marginTop: "15px", marginLeft: "30px", fontWeight: "600", marginBottom: "0px" }}>Price</label>
                            <input type='Number' value={price} onChange={(e) => setPrice(e.target.value)} className='popup-input' placeholder={`Enter Product Price`}></input>
                        </div>
                        <div className='row'>
                            <label style={{ marginTop: "15px", marginLeft: "30px", fontWeight: "600", marginBottom: "0px" }}>Description</label>
                            <textarea className='popup-input' value={description} onChange={(e) => setDescription(e.target.value)} placeholder={`Enter Product Desciption`}></textarea>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button className='btn btn-warning' onClick={() => updateProduct(product._id)}>Save Changes</button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default ProductDetailCover