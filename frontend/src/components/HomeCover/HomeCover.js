import React from 'react'
import backgroundImg from '../../images/imgbg.jpg'
import './HomeCover.css'
import logo from '../../images/swades.png'


const HomeCover = () => {
    return (
        <div>
            <img className='img' src={backgroundImg} alt='background' />
            <img className='bg-img' src={logo} alt='Background' ></img>
            <p className='slogan'>Clothes that talk on behalf of you. Something of every occassion.</p>
        </div>
    )
}

export default HomeCover