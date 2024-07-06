import React, { useContext } from 'react';
import { useState , useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse ,  faUser , faStar , faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { Link , useNavigate , useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Buyersellerprofile.css';
import Slider from "react-slick";
import HorizontalScroll from 'react-scroll-horizontal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from './Spinner';
import { BuyerIdContext } from '../App';
import Navbar from './Navbar';
import ModalSuggestion from './ModelSuggestion';



function Buyersellerprofile() {
    const {buyerId} = useContext(BuyerIdContext);
    const BUYERID = localStorage.getItem("buyerId");
    const navigate = useNavigate();
    const {id} = useParams()
    const [following_status , setFollowing_status] = useState(true);
    const [ seller , setSeller] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);


    const openModal = () => {
        setModalOpen(true);
      };
    
      const closeModal = () => {
        setModalOpen(false);
      };

      
    async function follow(){
        //
        try{
            const response = await fetch(`http://localhost:5000/follow/${id}` , {
                method: 'POST',
                headers: {
                  "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    BUYERID,
                    seller
                })
              })

            // const data = response.json();
            if(response)
            {
                setFollowing_status(true);
                console.log("followed");
            }
        }
        catch(e){
            console.log(e);
        }
    }
    async function unfollow(){
        //
        try{
            const response = await fetch(`http://localhost:5000/unfollow/${id}` , {
                method: 'DELETE',
                headers: {
                  "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    BUYERID,
                    seller
                })
              })

            // const data = response.json();
            if(response)
            {
                setFollowing_status(false);
                console.log("unfollowed");
            }
        }
        catch(e){
            console.log(e);
        }
    }
    //-----------------------------------------------------------------------------------
    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const token = localStorage.getItem("buyer_TOKEN");
                const response = await fetch(`http://localhost:5000/fetchsellerprofile/${id}`, {
                    method: 'GET',
                    headers:{
                        "authorization" : `Bearer ${token}`,
                        "Content-Type" : "application/json"
                       }
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch seller profile');
                }
    
                const sellerData = await response.json();
                setSeller(sellerData);
                
                console.log(sellerData); // Make sure the data is correct
    
                if (sellerData.length > 0 && sellerData[0].followers && sellerData[0].followers.includes(BUYERID)) {
                    setFollowing_status(true);
                } else {
                    setFollowing_status(false);
                }
            } catch (error) {
                console.error('Error fetching seller profile:', error);
            }
        };
    
        fetchSeller();
    }, [following_status]);
//-------------------------------------------------------------------------------    
    const [sliderSettings, setSliderSettings] = useState({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
      });


  return  (
    <div>
        <Navbar/>
      //------------
   
       { seller.length?(
             <div>
                <div className='buy-profile-image-div'>
                        <div className='follow-btn-div'>
                          <img src={seller[0].profilePicture} className='profile-image'/>
                          <h4>{seller[0].name}</h4>
                          <button className='follow-btn' onClick={()=>{
                            // setFollowing_status(!following_status);
                            if(following_status){
                                unfollow();
                            }
                            else{
                                follow();
                            }
                          }}>{(following_status)?"Following":"Follow"}</button>
                        </div>

                        <table className='profile-table'>
                            <thead>
                                <tr className='t-head'>
                                <th className='head-p'>FOLLOWERS   <FontAwesomeIcon icon={faUser} size="x" style={{color: "#ca9f02",}}/></th>
                                
                                <th className='head-p'>RATINGS <FontAwesomeIcon icon={faStar} size="x" style={{color: "#ca9f02",}} /></th>
                                </tr>
                                <tr className='t-head'>
                                    <td className='head-p'>
                                    {seller[0].followers.length}
                                    </td>
                                    
                                    <td className='head-p'>
                                        {!(seller[0].ratings) ? "No ratings yet!" : (seller[0].ratings)/(seller[0].no_of_ratings.length)}
                                    </td>
                                </tr>
                            </thead>
                        </table>
                </div>
        </div>):(
            <Spinner/>
        )
        }

        {seller.length?(<div className='prod-div'>

            <div  className='products'>

                   <Slider {...sliderSettings}>
                        {seller[0].products.map((product) => (
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

            <div className='sug-div'>
                            <button className='sug-btn' onClick={openModal}>G I V E &nbsp; S U G G E S T I O N S❤️</button>
                            <ModalSuggestion isOpen={modalOpen} onClose={closeModal} seller= {{...seller[0]}}>
                            
                            </ModalSuggestion>
            </div>

        </div>):(<></>)}

    
   

    </div>
  )
}



export default Buyersellerprofile;