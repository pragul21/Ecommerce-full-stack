import React from 'react'
import './Footer.css'
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='footer-bottom'>
            {/* black container for footer */}
            <div className='bg'>
                <div className='row'>
                    <div className='col-lg-3' >
                        <h3>Women</h3>
                        <NavLink to='/products/women' className='links'>Dresses</NavLink><br />
                        <NavLink to='/products/women' className='links'>Pants</NavLink><br />
                        <NavLink to='/products/women' className='links'>Skirts</NavLink>
                    </div>
                    <div className='col-lg-3'>
                        <h3>Men</h3>
                        <NavLink to='/products/men' className='links'>Shirts</NavLink><br />
                        <NavLink to='/products/men' className='links'>Pants</NavLink><br />
                        <NavLink to='/products/men' className='links'>Hoodies</NavLink>
                    </div>
                    <div className='col-lg-3'>
                        <NavLink to='/products/kids'> <h3>Kids</h3></NavLink>
                    </div>
                    <div className='col-lg-3'>
                        <h3>Links</h3>
                        <NavLink to='/' className='links'>Home</NavLink><br />

                    </div>
                    <hr size='4' className='mt-3' ></hr>
                    <h4>Copyright &copy;Ecommerce 2023-2024</h4>
                </div>

            </div>
        </div>
    )
}

export default Footer