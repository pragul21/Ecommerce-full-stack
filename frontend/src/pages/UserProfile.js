import React from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import UserProfileCover from '../components/UserProfileCover'

const UserProfile = () => {
    return (
        <div>
            <Header></Header>
            <UserProfileCover></UserProfileCover>
            <Footer></Footer>
        </div>
    )
}

export default UserProfile