import React , {useState} from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Home from './pages/home';
import Signin from './pages/signin';
import Index from './pages/indexpage';
import Cart from './pages/cart';
import Mysellers from './pages/mysellers';
import SignUpForm from './pages/SignUpForm';
import SigninForm from './pages/SigninForm';
import SellerHome from './pages/sellerHome';
import CreateProduct from './components/createProduct';
import EditProduct from './components/editProduct';
import SellerProfile from './components/sellerProfile';
import Productdetails from './components/productdetails';
import Productbuy from './components/productbuy';
import Buyersellerprofile from './components/Buyersellerprofile';
import Orderseller from './pages/orderseller';
import Orderbuyer from './pages/Buyerorders';

// Create the context
export const BuyerIdContext = React.createContext();

function App() {

    const [buyerId, setBuyerId] = useState(null);

  return (
    <div className="App">
    <BuyerIdContext.Provider value={{ buyerId, setBuyerId }}> 

            <Routes>
                <Route exact path='/' element={<Index />}/>
                <Route path='/home/:id' element={<Home/>}/>

                <Route path='/registerseller' element={<SignUpForm/>}/>
                <Route path='/register' element={<Register/>}/>

                <Route path='/signinseller' element={<SigninForm/>}/>
                <Route path='/signinbuyer' element={<Signin/>}/>

                <Route path='/sellerhome/:id' element={<SellerHome/>}/>
                <Route path='/createproduct/:id' element={<CreateProduct/>}/>
                <Route path='/editproduct/:id' element={<EditProduct/>}/>
                <Route path='/sellerprofile/:id' element={<SellerProfile/>}/>
                <Route path='/orderseller/:id' element={<Orderseller/>}/>
                

                <Route path='/cart/:id' element={<Cart/>}/>
                <Route path='/mysellers' element={<Mysellers/>}/>

                <Route path='/productdetails/:id' element={<Productdetails/>}/>
                <Route path='/productbuy/:id' element={<Productbuy/>}/>

                <Route path='/buyersellerprofile/:id' element={<Buyersellerprofile/>}/>

                <Route path='/orderbuyer/:id' element={<Orderbuyer/>}/>

            </Routes>

    </BuyerIdContext.Provider> 
    </div>
  );
}

export default App;

