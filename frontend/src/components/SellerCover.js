import React, { useEffect } from 'react'
import Card from './card/card'
import Modal from 'react-bootstrap/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import './SellerCover.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../src/config'
import Swal from 'sweetalert2';

const SellerCover = () => {
    const navigate = useNavigate();

    const [myproducts, setMyproducts] = useState()

    const [image, setImage] = useState({ preview: '', data: '' })

    const [showProduct, setShowProduct] = useState(false);

    const [category, setCategory] = useState('')
    const [productName, setProductName] = useState('')
    const [sellerName, setSellerName] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [description, setDescription] = useState('')
    const handleProductClose = () => setShowProduct(false);
    const handleProductShow = () => setShowProduct(true)

    const [loading, setLoading] = useState(false)

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


    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImage(img);
    }
    const handleImgUpload = async () => {
        let formData = new FormData();
        formData.append('file', image.data);

        const response = await axios.post(`${API_BASE_URL}/uploadFile`, formData)
        return response;
    }
    //check it not workingghgg
    //getting my all products 
    const getMyAllProducts = async () => {
        try {

            const response = await axios.get(`${API_BASE_URL}/myproducts`, CONFIG_OBJ)
            // debugger
            if (response.status === 200) {
                setMyproducts(response.data.result)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Some error while getting your posts'
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const addProduct = async () => {
        try {

            if (image.preview === '') {

                Swal.fire({
                    icon: 'error',
                    title: 'Product image is mandatory'
                })
                setLoading(false)
            }
            setLoading(true)

            const imgRes = await handleImgUpload();
            const request = { productName, sellerName, price, stock, description, category, image: `${API_BASE_URL}/files/${imgRes.data.fileName}` }
            const productResponse = await axios.post(`${API_BASE_URL}/createproduct`, request, CONFIG_OBJ)
            setLoading(false)
            if (productResponse.status === 201) {
                navigate('/allproducts')

            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Some error while creating product'
                })
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Some error while creating product'
            })
            setLoading(false)
        }

    }


    useEffect(() => {
        getMyAllProducts();
    })
    return (
        <div>
            <div className='container'>
                <h5 className='shadow' style={{ backgroundColor: "rgb(206, 214, 214)" }}>Your Listed Products Are</h5>
                <div className='row'>
                    {myproducts?.map((product) => {
                        return (
                            <div className='col-6' key={product._id}>
                                <Card product={product} doller='$' getMyAllProducts={getMyAllProducts} />
                            </div>

                        )
                    })}


                </div>
                <h5 className='shadow' style={{ marginTop: "40px", }}>Add New Products</h5>
                <button className='btn' onClick={handleProductShow} style={{ backgroundColor: "slategray", border: "gray", color: "white", marginBottom: "80px" }}> Add Product</button>


            </div>
            {/* Modal for posting/creating product */}
            <Modal show={showProduct} onHide={handleProductClose}>
                <Modal.Header closeButton>

                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='row'>
                            <div className='upload-box'>
                                {image.preview && <img src={image.preview} alt='product preview' width={107} height={87}></img>}
                                <div className='dropContainer'>
                                    <input type='file' id='drop-zone' className='FileUpload' accept='.jpg,.png,.gif' onChange={handleFileSelect}></input>
                                    <div className='dropOverlay'><FontAwesomeIcon className='upload-icon' icon={faUpload} /><br />Click to add</div>
                                </div>

                            </div>
                        </div>
                        {loading ? <div className='row text-center'>
                            <div className='col-md-12'>
                                <div className="spinner-border text-secondary " role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div> : ''}
                        <div className='row mt-3'>
                            <div className='row'></div>
                            <label style={{ marginLeft: "30px", fontWeight: "600", marginBottom: "0px" }}>Category</label>
                            <select name='Select' onChange={(ev) => setCategory(ev.target.value)} value={category} className='product-rate'>
                                <option value='select'>Select</option>
                                <option value='men'>men</option>
                                <option value='women'>women</option>
                                <option value='kids'>kids</option>
                            </select>
                        </div>
                        <div className='row'>
                            <label style={{ marginTop: "15px", marginLeft: "30px", fontWeight: "600", marginBottom: "0px" }}>Product Name</label>
                            <input type='text' onChange={(ev) => setProductName(ev.target.value)} value={productName} className='popup-input' placeholder='Enter your Product Name'></input>
                        </div>
                        <div className='row'>
                            <label style={{ marginTop: "15px", marginLeft: "30px", fontWeight: "600", marginBottom: "0px" }}>Seller Name</label>
                            <input type='text' onChange={(ev) => setSellerName(ev.target.value)} value={sellerName} className='popup-input' placeholder='Enter Seller Name'></input>
                        </div>
                        <div className='row'>
                            <label style={{ marginTop: "15px", marginLeft: "30px", fontWeight: "600", marginBottom: "0px" }}>Price</label>
                            <input type='Number' onChange={(ev) => setPrice(ev.target.value)} value={price} className='popup-input' placeholder='Enter Product Price'></input>
                        </div>
                        <div className='row'>
                            <label style={{ marginTop: "15px", marginLeft: "30px", fontWeight: "600", marginBottom: "0px" }}>Stock</label>
                            <input type='Number' onChange={(ev) => setStock(ev.target.value)} value={stock} className='popup-input' placeholder='Enter Stock quantity'></input>
                        </div>
                        <div className='row'>
                            <label style={{ marginTop: "15px", marginLeft: "30px", fontWeight: "600", marginBottom: "0px" }}>Description</label>
                            <textarea className='popup-input' onChange={(ev) => setDescription(ev.target.value)} value={description} placeholder='Enter Product Desciption'></textarea>
                        </div>
                        <div className='row'>
                            <button onClick={() => addProduct()} style={{ borderRadius: '5px', width: '90%', marginLeft: '30px', marginTop: '15px', backgroundColor: ' rgb(190, 149, 46)' }}>Submit</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}

export default SellerCover