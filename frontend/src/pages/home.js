import React , { Component } from 'react'
import Slider from "react-slick";
import HorizontalScroll from 'react-scroll-horizontal';
import { Link , useNavigate , useParams} from 'react-router-dom';
import { createContext, useContext, useState , useEffect } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './home.css';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// Create the context
// const BuyerIdContext = createContext();


function Home() {
    const {id} = useParams();
    const demoSellers = [
        {
          id: "karthick@gmail.com",
          name: 'paneer',
          price: 200,
          imageUrl: 'https://res.cloudinary.com/dgtonwmdv/image/upload/v1700461948/samples/breakfast.jpg',
        }
      ];
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [ sellers , setSellers ] = useState([]);


    const [sliderSettings, setSliderSettings] = useState({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
      });

      
      useEffect(()=>{

        async function fetchallsellers(){
            const token = localStorage.getItem("buyer_TOKEN");
            console.log("fetch all sellers in home page func called")
            const response = await fetch(`http://localhost:5000/fetchallsellers` , {
                   method: 'GET',
                   headers:{
                    "authorization" : `Bearer ${token}`,
                    "Content-Type" : "application/json"
                   }
                   
                })
            const data = await response.json();
            console.log(data);
            setSellers(data);    
        }

        fetchallsellers();

      },[])

      


  return (
    <div className='home'>
        
        <Navbar />
        <div className='search-div'>

                    <select className='filter-dd' id="options" name="options">
                    <option value="location">Location</option>
                    <option value="seller">Seller</option>
                    <option value="product">Product Name</option>
                    </select>

                    <input className='inp-search' type='text' placeholder='Search..' value={searchTerm} onChange={(e)=>{setSearchTerm(e.target.value)}} />
                    <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>

        </div>


        <div className='product-container-div'>
            {sellers.length ? (
                sellers.map((seller) => seller.products.length>0?(
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
                ):(<></>))
            ) : (
                <Spinner />
            )}
        </div>;


        
    </div>
  )
}


export default Home;

