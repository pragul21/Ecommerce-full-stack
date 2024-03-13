import React, { useEffect, useState } from 'react'
import Card from './card/card'
import { useParams } from 'react-router-dom'
import { API_BASE_URL } from '../config'
import axios from 'axios'

//this page is Category page nottt women specific
const WomenAllCover = () => {
  const [products, setProducts] = useState([])
  const { category } = useParams()
  console.log(category)
  useEffect(() => {
    const womenProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${category}`)
        if (response.status === 200) {
          // debugger
          setProducts(response.data.product)
        }
      } catch (error) {
        console.log(error)
      }

    }

    womenProducts();
  }, [category])
  return (
    <div>
      <div className="container-products" >
        <div className="row card-row">

          {products?.map((product) => {
            return (
              <div className="col-lg-2 col-md-4 col-sm-6 card-col">
                <Card product={product} doller='$' />
              </div>

            )
          })}

        </div>
      </div>
    </div >
  )
}

export default WomenAllCover