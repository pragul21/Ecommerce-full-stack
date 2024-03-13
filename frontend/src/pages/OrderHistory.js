import React from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import OrderHistoryCover from '../components/OrderHistoryCover'

const OrderHistory = () => {
    return (
        <div>
            <Header></Header>
            <OrderHistoryCover></OrderHistoryCover>
            <Footer></Footer>
        </div>
    )
}

export default OrderHistory