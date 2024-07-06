import React, { useState , useEffect , useContext } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import './mysellers.css';
import Slider from "react-slick";
import HorizontalScroll from 'react-scroll-horizontal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from '../components/Navbar';
import { BuyerIdContext } from '../App';
import Spinner from '../components/Spinner';


const Mysellers = () => {
    const navigate = useNavigate();
    const {buyerId} = useContext(BuyerIdContext);
    const BUYERID = localStorage.getItem("buyerId");
    const [mysellers , setMysellers] = useState([]);
    const  [loading , setLoading] = useState(true)
    const [sliderSettings, setSliderSettings] = useState({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
      });
      useEffect(()=>{
        async function getMysellers(){
            try
            {
                const token = localStorage.getItem("buyer_TOKEN");
                const response = await fetch(`http://localhost:5000/getmysellers/${BUYERID}`,{
                    method:'GET',
                    headers:{
                        "authorization" : `Bearer ${token}`,
                        "Content-Type" : "application/json"
                       }
                })
                const data = await response.json();
                //console.log(data);
                setMysellers(data);
                setLoading(false);
            }
            catch(e)
            {
                console.log(e);
            }
        }
        getMysellers();
      },[])
      

      useEffect(() => {
        if (mysellers.length > 0) {
            console.log(mysellers[0].name);
        }
    }, [mysellers]);
    
  
  return (
    <div className='mysellers-page'>
    
        <Navbar/>

        <div className='mysel-h-div'>
            <h3 className='mysel-h'> My Sellers</h3>
        </div>



    
          {loading?<Spinner/>:(<></>)}
        <div className='product-container-div'>
            {mysellers.length ? (
                mysellers.map((seller) => (
                <div key={seller._id}>
                    <div className='seller-username-div'>
                    <div className='sel-profile-contents-div'>
                        <img
                        src={seller.profilePicture}
                        className='seller-image'
                        onClick={() => navigate(`/buyersellerprofile/${seller._id}`)}
                        />
                        <h5 className='seller-name' onClick={() => navigate(`/buyersellerprofile/${seller._id}`)}>
                        &nbsp;&nbsp;&nbsp; {seller.name} - {seller.city }
                        </h5>
                    </div>
                    </div>

                    <div className='products'>
                    <Slider {...sliderSettings}>
                        {seller.products.map((product) => (
                        <div key={product._id} className='p-cards'>
                            <img src={product.picture} className='p-img' onClick={() => navigate(`/productdetails/${product._id}`)} />
                            <div className='btn-div-p' onClick={() => navigate(`/productdetails/${product._id}`)}>
                            <h5 className='p-name'>{product.name}</h5>
                            <h5 className='p-price'>Rs.{product.price}/kg</h5>
                            </div>
                        </div>
                        ))}
                    </Slider>
                    </div>
                </div>
                ))
            ) : (
                // <Spinner />
                <></>
            )}
        </div>;
        
    


    </div>
  )
};

export default Mysellers;
