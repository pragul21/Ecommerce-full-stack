import React from 'react'
import Header from '../components/Header/Header'
import HomeCover from '../components/HomeCover/HomeCover'
import Slider from '../components/Slider/Slider'
import Footer from '../components/Footer/Footer'


const Home = () => {
    return (
        <div>
            <Header></Header>
            <HomeCover></HomeCover>
            <Slider></Slider>
            <Footer></Footer>

        </div>
    )
}

export default Home