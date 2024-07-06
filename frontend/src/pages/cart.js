import React from 'react'
import './home.css';
import './cart.css'
import { Link , useNavigate } from 'react-router-dom';
import { useState , useEffect , useContext} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import Slider from 'react-slick';
import { BuyerIdContext } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

function Cart() {
   const navigate = useNavigate();
   const [bid , setBid] = useState(null);
   const [loading , setLoading] = useState(false);
    const {buyerId} = useContext(BuyerIdContext);
    const BUYERID = localStorage.getItem("buyerId");
    // setBid(buyerId);
    const [buyercart , setBuyercart] = useState([]);
    const [sliderSettings, setSliderSettings] = useState({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
      });
useEffect(()=>{
    const fetchCart = async()=>{
        setBid(BUYERID);
        
        const token = localStorage.getItem("buyer_TOKEN");
        const res = await fetch(`http://localhost:5000/getmycart/${BUYERID}` , {
            method:'GET',
            headers:{
                "authorization" : `Bearer ${token}`,
                "Content-Type" : "application/json"
               }
        })
        const data = await res.json();
        // console.log(data);
        if(res.ok)
        {
            setBuyercart(data);
        }
    }
    fetchCart();
} , [buyercart])

useEffect(()=>{
    console.log(bid);
} , [bid])


const deleteProduct=async(e , product)=>{
   console.log(product);
   const BUYERiD = localStorage.getItem("buyerId");
   console.log(BUYERiD);
   const res = await fetch(`http://localhost:5000/removefromcart/${BUYERiD}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ product:product })
});
const data = await res.json();
console.log(data);
if (res.ok) {
    toast("Item removed")
    const fetchCart = async()=>{
        const res = await fetch(`http://localhost:5000/getmycart/${BUYERiD}` , {
            method:'GET'
        })
        const data = await res.json();
        // console.log(data);
        if(res.ok)
        {
            setBuyercart(data);
            console.log("Item removed successfully");
        }
    }
    fetchCart();
   
} else {
    console.log("Something went wrong");
}
}

const handleBuy = async (index)=>{
    setLoading(true);
        try{
            const cartObject = buyercart[index];
            const sellerobj = buyercart[index].sellerId;
            const buyerid = localStorage.getItem("buyerId");
            const res = await fetch(`http://localhost:5000/getbuyer/${buyerid}` , {
                method:"GET"
                }) 
            const buyerobj = await res.json();
            // console.log(buyerobj);

            const response = await fetch(`http://localhost:5000/billcreation`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({ buyerobj , sellerobj  , cartObject })
            });
            const billid = await response.json();
            if(response.ok) {
                setLoading(false);
                navigate(`/productbuy/${billid}`);
            }
                
        }
        catch(e){
            console.log(e);
        }
}

  return (
    <div className='cart-container'> 
    <Navbar/>
    {buyercart.length === 0 ? (
        <Spinner/>
    ) : ( 
        <div className='product-container-div'>
            {buyercart.map((cart , index) => cart.productsToCart.length>0?(
                <div key={cart.sellerId._id}>
                    <div className='seller-username-div'>
                        <div className='sel-profile-contents-div'>
                            <img
                                src={cart.sellerId.profilePicture}
                                className='seller-image'
                                onClick={() => navigate(`/buyersellerprofile/${cart.sellerId._id}`)}
                            />
                            <h5 className='seller-name' onClick={() => navigate(`/buyersellerprofile/${cart.sellerId._id}`)}>
                                &nbsp;&nbsp;&nbsp; {cart.sellerId.name}
                            </h5>
                            <ToastContainer />
                        </div>
                    </div>

                    <div className='products'>
                        <Slider {...sliderSettings}>
                            {cart.productsToCart.map((product) => (
                                <div key={product._id} className='p-cards'>
                                    <img src={product.picture} className='p-img' onClick={() => navigate(`/productdetails/${product._id}`)} />
                                    <div className='btn-div-p' >
                                        <h5 className='p-name'>{product.name} - ({product.quantity})</h5>
                                        <h5 className='p-price'>Rs.{product.price}/kg</h5>

                                        <div>
                                        <FontAwesomeIcon icon={faCircleXmark} onClick={(e)=>deleteProduct(e,product)} />
                                        </div>
                                        
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <div className='cart-buy-btn-div'>
                   { loading? <Spinner/>:<></>}
                    <button className='cart-buy-btn' onClick={() => handleBuy(index)}>BUY</button>
                        <h4>-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</h4>
                    </div>
                </div>
            ):(<></>)
            )}
        </div>
    )}

 </div>

  )
}

export default Cart