import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse ,  faUser , faCartShopping} from '@fortawesome/free-solid-svg-icons';
import { Link , useNavigate } from 'react-router-dom';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect , useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';




function SellerHome() {

    //--------------------------------------------demo--------------------------------------------------------------
    const demoproducts = [
        {
          id: "",
          name: 'No item',
          price: '',
          quantity: "No item",
          imageUrl: 'https://res.cloudinary.com/dgtonwmdv/image/upload/v1700461948/samples/breakfast.jpg',
        }
      ];
    
    //--------------------------------------------------------------------demo-----------------------------------------

    const { id } = useParams();
    const navigate = useNavigate();
    const [ seller , setSeller ] = useState(null);
    
    
    useEffect(() => {
       
      async function homeRender (){

        const response = await fetch(`http://localhost:5000/sellerhome/${id}` , {
        method: 'GET',
        headers: {
          "Content-Type":"application/json"
        },
        
      })
      console.log(response);
      const data = await response.json();
      
       console.log(data[0]);
      setSeller(data[0]);
      
        }

        homeRender();
        
      }, []);

   

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
    navigate(`/createproduct/${id}`);
  }


  const handleEdit=(e , name)=>{
    e.preventDefault();
    navigate(`/editproduct/${name}`);//------------------ not completed
    console.log(name);
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
      </div>
      <div className='lo-btn-div'>
        <h3>S E L L E R&nbsp;&nbsp;&nbsp;D A S H B O A R D  &nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;</h3>
        <button className='s-add' onClick={handleAdd}>Create Product</button>
        <button className='s-logout' onClick={handleLogout}>Logout</button>
        <ToastContainer />
      </div>
    </nav>

    {
    seller!==null?(
    <div className='t-div'>
    <table className='t-table'>
      <thead>
        <tr className='t-head'>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Edit</th>
          <th>Profit</th>
        </tr>
      </thead>
      <tbody>
  {
        seller.products.length>0 ? (
            seller.products.map((product) => (
            <tr className='t-row' key={product._id}>
                <td className='t-row-d'>
                <div className='s-t-pro-img'>
                    <img src={product.picture} alt={product.name} style={{ maxWidth: '70px', maxHeight: '100px' , padding:'0px' }} />
                    {product.name}
                </div>
                </td>
                <td className='t-row-d'>Rs.{product.price}</td>
                <td className='t-row-d'>{product.fquantity}</td>
                <td className='t-row-d'>
                <button className='s-add' onClick={(e) => handleEdit(e, product.name)}>
                    Edit
                </button>
                </td>
                <td className='t-row-d'>{product.profit}</td>
            </tr>
            ))
        ) : (
            <tr className='t-row'>
            <td colSpan="5">&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;-no item added-</td>
            </tr>
        )
  }
</tbody>

    </table>
    </div>):(
        <Spinner/>
    )
    }

    </div>
  )
}

export default SellerHome;

