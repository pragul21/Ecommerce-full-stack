import React from 'react'
import logo from '../../images/swades.png'
import './ContactCover.css'

const ContactCover = () => {
    return (
        <div>
            <h2>Contact Us</h2>
            <div className='container'>
                <div className='row'>
                    <div className='col-lg-4 col-md-12'>
                        <img src={logo} alt='swadesh' className='contact-logo'></img>
                    </div>
                    <div className='col-lg-8 col-md-12'>
                        <div className='row'>
                            <label className='label-contact'>Name:</label>
                            <input type='text' className='input-contact' placeholder='Enter Your Name'></input>
                        </div>
                        <div className='row'>
                            <label className='label-contact'>E-mail:</label>
                            <input type='email' className='input-contact ' placeholder='Enter Your Email'></input></div>
                        <div className='row'>
                            <label className='label-contact'>Message:</label>
                            <textarea rows='3' cols='30' className='textarea-contact ' placeholder='Enter Your Message'></textarea>
                        </div>
                        <div className='row'>
                            <input type='submit' className='contact-btn' value='Submit'></input>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactCover