import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse ,  faUser , faStar , faIndianRupeeSign , faCartShopping , faCommentDots} from '@fortawesome/free-solid-svg-icons';
import { Link , useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect , useState } from 'react';
import { useParams } from 'react-router-dom';
import '../pages/style.css';
import './productdetails.css';
import Spinner from './Spinner';



function SellerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [seller , setSeller] = useState([])
    const [tprofit , setTprofit] = useState(-1);
    const [commentOpen , setCommentOpen] = useState(false);
    const [show , setShow] = useState("S H O W__S U G G E S T I O N S ↓");
    useEffect(() => {
       async function fetchseller(){
        try{
            const response = await fetch(`http://localhost:5000/fetchsellerforcart/${id}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch seller profile');
            }

            const sellerData = await response.json();
            //console.log(sellerData);
            let sum=0;
            for(let i=0 ; i<sellerData[0].products.length ; i++)
            {
                sum = sum + sellerData[0].products[i].profit;      
            }
            console.log(sum);
            setTprofit(sum);
            setSeller(sellerData);

        }
        catch(e){
            console.log(e);
        }
       }
       fetchseller();
       
      }, []);

    //   useEffect(()=>{
    //     async function setTprofit(){
    //         let sum=0;
    //         const profitarray = [seller[0].products]
    //         for(let i=0 ; i<profitarray.length ; i++)
    //         {
    //             sum = sum + profitarray[i].profit;      
    //         }
    //         console.log(sum);
    //         setTprofit(sum);
    //        }
    //     setTprofit();
    //   },[seller])

    const routeTodashboard=()=>{
        navigate(`/sellerhome/${id}`);
    }
    const routeToprofile=()=>{
        navigate(`/sellerprofile/${id}`)
    }

  const handleLogout = () => {
    navigate('/');
  };
  const handleAdd=()=>{
    navigate('/createproduct')
  }

  return (
    <div className='s-page'>
        <nav className='s-nav'>
      <div className='s-h-div'>
            <div className='s-profile' title="Dashboard" onClick={routeTodashboard}>
            <FontAwesomeIcon icon={faHouse} size="xl" style={{color: "#131416",}}  />   
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div className='s-profile' title="Profile" onClick={routeToprofile}>
                <FontAwesomeIcon icon={faUser} size="xl" />
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div className='s-profile' title="Orders" onClick={()=>{navigate(`/orderseller/${id}`)}} >
            <FontAwesomeIcon icon={faCartShopping} size="xl" />
            </div>
            {/* &nbsp;&nbsp;&nbsp;&nbsp;
            <div className='s-profile' title="Suggestions" onClick={()=>{navigate(`/suggestionseller/${id}`)}} >
            <FontAwesomeIcon icon={faCommentDots} size="xl"/>
            </div> */}
      </div>
      <div className='lo-btn-div'>
      <h3>S E L L E R&nbsp;&nbsp;&nbsp;P R O F I L E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;</h3>
        <button className='s-add' onClick={handleAdd}>Add</button>
        <button className='s-logout' onClick={handleLogout}>Logout</button>
        <ToastContainer />
      </div>
    </nav>

   { 
    (seller.length>0 )?(<div className='profile-bdy'>
        <div className='profile-bdy-outer'>
            <div className='profile-image-div'>
                <img src={seller[0].profilePicture} className='profile-image'/>
                
                <table className='profile-table'>
                    <thead>
                        <tr className='t-head'>
                        <th className='head-p'>FOLLOWERS   <FontAwesomeIcon icon={faUser} size="x" style={{color: "#ca9f02",}}/></th>
                        <th className='head-p'>TOTAL PROFIT <FontAwesomeIcon icon={faIndianRupeeSign} size="x" style={{color: "#ca9f02",}}/></th>
                        <th className='head-p'>RATINGS <FontAwesomeIcon icon={faStar} size="x" style={{color: "#ca9f02",}} /></th>
                        </tr>
                        <tr className='t-head'>
                            <td className='head-p'>
                            {seller[0].followers.length}
                            </td>
                            <td className='head-p'>
                            ₹{tprofit}
                            </td>
                            <td className='head-p'>
                            {!(seller[0].ratings) ? "No ratings yet!" : (seller[0].ratings)/(seller[0].no_of_ratings.length)}
                            </td>
                        </tr>
                    </thead>

                    <div>

                    </div>
            
                </table>

            </div>
            <div className='accordion-div-seller' onClick={()=>{
            setCommentOpen(!commentOpen)
            if(commentOpen){
                setShow("S H O W__S U G G E S T I O N S ↓")
            }
            else{
                setShow("H I D E__S U G G E S T I O N S ↑")
            }
            }}>
                <h4 className='acc-head'> {show}</h4>
            </div>
                {
                    commentOpen && (
                        seller[0].suggestions.length > 0 ? (
                            <div className='accordian-bdy-seller'>
                                {seller[0].suggestions.map((suggestion, index) => (
                                    <div className='bdy-part-user' key={index}>
                                        <div className='user-rat-date'>
                                            <h3 className='usename-review'>{suggestion.data.name}:</h3>
                                            <h6>{suggestion.formattedDate}</h6>
                                        </div>
                                        <p className='para-review'>" {suggestion.sug} "</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            
                            <div className='accordian-bdy-seller'>
                            <div className='bdy-part-user'>
                                        <p className='para-review'>" NO REVIEW ADDED "</p>
                                    </div>
                            </div>
                            
                        )
                    )
                }
        </div>
        

        
    </div>
    ):(
        <Spinner/>
    )
    }
    
    </div>
  )
}

export default SellerProfile;