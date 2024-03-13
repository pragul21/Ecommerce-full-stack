import React, { useEffect, useState } from 'react'
import './Slider.css'
import axios from 'axios';
import Card from '../card/card'
import { API_BASE_URL } from '../../config'
import Swal from 'sweetalert2'

const Slider = () => {
    const [featuredProducts, setFeaturedProducts] = useState([])

    const getFeaturedProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/allproducts`)
            if (response.status === 200) {
                setFeaturedProducts(response.data.product)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Some Error'
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getFeaturedProducts();
    }, []);

    return (
        <div className='conatiner slider'>
            <h2>Featured Products</h2>
            {/* carousel using bootstrap */}
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className='carousel-inner'>
                    {featuredProducts.length > 0 &&
                        featuredProducts.map((product, index) => {
                            if (index % 6 === 0) {
                                return (
                                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <div className='row'>
                                            {[...Array(Math.min(6, featuredProducts.length - index))].map((_, innerIndex) => (
                                                <div className='col-lg-2 col-md-4 col-sm-6 cardCol'>
                                                    <Card product={featuredProducts[index + innerIndex]} doller='$' />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        }, [])}
                </div>
                <button className="carousel-control-prev prevBtn" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    )
}

export default Slider