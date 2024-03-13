
import './App.css';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import WomenAll from './pages/CategoryPage';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Shipping from './pages/Shipping';
import OrderAll from './components/OrderAll';
import PreviewOrder from './pages/PreviewOrder';
import UserProfile from './pages/UserProfile';
import OrderHistory from './pages/OrderHistory';
import Seller from './pages/Seller';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

function App() {
  function DynamicRouting() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.userReducer);

    useEffect(() => {

      const userData = JSON.parse(localStorage.getItem("user"));
      //when useris logged in
      if (userData) {
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        navigate("/");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_ERROR" });
        navigate("/login");
      }
    }, []);
    return (
      <Routes>
        <Route exact path='/' element={<Home />}></Route>
        <Route exact path='/allproducts' element={<AllProducts />}></Route>
        <Route exact path='/products/:category' element={<WomenAll />}></Route>
        <Route exact path='/contact' element={<Contact />}></Route>
        <Route exact path='/login' element={<Login />}></Route>
        <Route exact path='/signup' element={<Signup />}></Route>
        <Route exact path='/cart' element={<Cart />}></Route>
        <Route exact path='/productdetails/:productId' element={<ProductDetail />}></Route>
        <Route exact path='/shipping' element={<Shipping />}></Route>
        {/* <Route exact path='/payment' element={<Payment />}></Route> */}
        <Route exact path='/preview' element={<PreviewOrder />}></Route>
        <Route exact path='/profile' element={<UserProfile />}></Route>
        <Route exact path='/history' element={<OrderHistory />}></Route>
        <Route exact path='/seller' element={<Seller />}></Route>
        <Route exact path='/allorders' element={<OrderAll />}></Route>


      </Routes>
    )
  }

  return (
    <div className="App">
      <Router>
        <DynamicRouting></DynamicRouting>
      </Router>
    </div>
  );
}

export default App;
