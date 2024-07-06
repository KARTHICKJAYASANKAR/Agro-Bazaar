import React , { Component } from 'react'
import Slider from "react-slick";
import HorizontalScroll from 'react-scroll-horizontal';
import { Link , useNavigate , useParams} from 'react-router-dom';
import { createContext, useContext, useState , useEffect } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from '../components/Spinner';
import '../pages/home.css'
import { BuyerIdContext } from '../App';


function Navbar() {
    const {buyerId} = useContext(BuyerIdContext);
    const BUYERID = localStorage.getItem("buyerId");
  return (
    <div className='container'>
                <nav className="navbar">
                    <div>
                        <Link to={`/home/${BUYERID}`}>
                        <img className="logo" src='https://res.cloudinary.com/dgtonwmdv/image/upload/v1708713122/images/stable-diffusion-turbo_4_ib2n0a.jpg'/>
                        </Link>
                    </div>
                    <div className="nav-container">
                        <Link to={`/home/${BUYERID}`} className="nav-link">Home</Link>
                        <Link to={`/cart/${BUYERID}`} className="nav-link">Cart</Link>
                        <Link to="/mysellers" className="nav-link">My sellers</Link>
                        <Link to={`/orderbuyer/${BUYERID}`} className="nav-link">My Orders</Link>
                        <Link to="/" className="nav-link">Logout</Link>
                    </div>
                </nav>
    </div>
  )
}

export default Navbar