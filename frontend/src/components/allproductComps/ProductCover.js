import React, { useEffect, useState } from 'react'
import './ProductCover.css'
import Card from '../card/card'
import axios from 'axios';
import { API_BASE_URL } from '../../config'
import Swal from 'sweetalert2';

const ProductCover = () => {
    const [allproducts, setAllproducts] = useState([])

    const getAllProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/allproducts`)
            // debugger
            if (response.status === 200) {
                setAllproducts(response.data.product)
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
        getAllProducts();
    }, []);
    return (
        <div>
            <div className="container-products" >
                <div className="row card-row">
                    {allproducts?.map((product) => {
                        return (
                            <div className="col-lg-2 col-md-4 col-sm-5 card-col" key={product._id}>
                                <Card product={product} getAllProducts={getAllProducts} doller='$' />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ProductCover