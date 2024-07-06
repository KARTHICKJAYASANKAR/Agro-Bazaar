import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse ,  faUser } from '@fortawesome/free-solid-svg-icons';
import { Link , useNavigate } from 'react-router-dom';
import '../pages/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect , useState } from 'react';
import { useParams } from 'react-router-dom';



function EditProduct() {

    const { id } = useParams();

    const navigate = useNavigate();

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
      </div>
      <div className='lo-btn-div'>
        <button className='s-add' onClick={handleAdd}>Add</button>
        <button className='s-logout' onClick={handleLogout}>Logout</button>
        <ToastContainer />
      </div>
    </nav>

    <div className='e-body'>
        <form className='e-form' autocomplete="off">
            <div className='e-img-div'>
            <img src="https://res.cloudinary.com/dgtonwmdv/image/upload/v1700461948/samples/breakfast.jpg" className='e-img'/>
            <button className='s-add'>Change</button>
            </div>

            <div className='e-body-details'>
            <label className='p-label'>
                Product name :
                <input
                className='p-input'
                type="text"
                name="name"
                value=""
                required
                />
            </label>    
            <label className='p-label'>
                Price :
                <input
                className='p-input'
                type="text"
                name="name"
                value=""
                required
                />
            </label>
            <label className='p-label'>
                Quantity :
                <input
                className='p-input'
                type="text"
                name="name"
                value=""
                required
                />
            </label>
            <button className='s-add'>UPDATE</button>
            </div>
        </form>
    </div>
    </div>
  )
}

export default EditProduct;