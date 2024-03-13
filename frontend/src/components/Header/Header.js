import React, { useState } from 'react'
import './Header.css'
import logo from '../../images/swades.png'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { API_BASE_URL } from '../../config'


const Header = () => {

    const [query, setQuery] = useState('');
    const [result, setResult] = useState([])
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const user = useSelector(state => state.userReducer)
    // console.log(user)

    const womenPage = (category) => {
        navigate(`/products/${category}`)
    }
    const menPage = (category) => {
        navigate(`/products/${category}`)
    }
    const kidsPage = (category) => {
        navigate(`/products/${category}`)
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: 'LOGIN_ERROR' })
        navigate('/login')
    }

    const search = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/search?product=${query}`);
            debugger
            setResult(response.data.products)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <div className='headerBox'>
                {/* first nav search box and cart,etc */}
                <div className='row'>
                    <div className='col-2'>
                        <NavLink to='/'><img src={logo} alt='swades' className='logo'></img> </NavLink >
                    </div>
                    <div className='col-8'>
                        <form className='header-form'>
                            <input type='text' value={query} onChange={(e) => setQuery(e.target.value)} className='searchBar' placeholder='Puduct name,Category,name,etc' />
                            <input className='searchBtn' onClick={search} type='button' value='Search' />
                        </form>
                        {result.length > 0 && (
                            <div className='conatiner search-conatiner'>
                                <h3>Results</h3>
                                <ul>
                                    {result.map((product) => (
                                        <p key={product._id}>{product.productName}</p>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className='col-2 login'>
                        <div className='conatiner cart-login-container'  >
                            <div className='row'>
                                <div className='col-6 btn-col'>
                                    {/*login button will be hidden if user is logged in  */}
                                    {localStorage.getItem("token") == null ? <NavLink to='/login'> <input type='button' className='login-btn' value='login' /></NavLink> : ''}
                                    {/*logout button will be apeear if user is logged in  */}
                                    {localStorage.getItem("token") !== null ? <input type='button' onClick={() => logout()} className='logout-btn' style={{ marginLeft: "-15px" }} value='logout' /> : ''}
                                </div>
                                <div className='col-6 '>
                                    <NavLink to='/cart'> <FontAwesomeIcon className='cartt' icon={faCartShopping} /></NavLink>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div>
                {/* second nav for all links */}
                <div className="nav">
                    <ul className="nav nav-pills" >
                        <li className="nav-item-active">
                            <NavLink to='/' className="navlink">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/allproducts" className="navlink">All Products</NavLink>
                        </li>
                        <li className="nav-item-active">
                            <button onClick={() => womenPage('women')} className="navlink-btn ms-3">Women</button>
                        </li>
                        <li className="nav-item-active">
                            <button onClick={() => menPage('men')} className="navlink-btn">Men</button>
                        </li>
                        <li className="nav-item">
                            <button onClick={() => kidsPage('kids')} className="navlink-btn">Kids</button>
                        </li>
                        {/* this user profile will be hidden if user not logged in */}
                        {localStorage.getItem("token") != null ? < li className="nav-item dropdown">
                            <Link className="nav-item dropdown-toggle" data-bs-toggle="dropdown">Profile</Link>
                            <ul className="dropdown-menu">
                                <NavLink to="/profile" className="navlink">User Profile</NavLink><br />
                                <NavLink to="/history" className="navlink">Order History</NavLink><br />
                                <Link className="navlink" onClick={() => logout()} >Sign Out</Link><br />
                            </ul>
                        </li> : ''}
                        {/* this seller profile will be hidden he is not admin/isAuth */}
                        {localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).isAuth ? <li className="nav-item dropdown">
                            <Link className="nav-item dropdown-toggle" data-bs-toggle="dropdown">Seller</Link>
                            <ul className="dropdown-menu">
                                <NavLink to="/seller" className="navlink">My Products</NavLink><br />
                                <NavLink to="/allorders" className="navlink">All Orders</NavLink><br />
                                <Link className="navlink" onClick={() => logout()} >Sign Out</Link><br />
                            </ul>
                        </li> : ''}
                    </ul>
                </div>
            </div>
        </div >
    )
}

export default Header