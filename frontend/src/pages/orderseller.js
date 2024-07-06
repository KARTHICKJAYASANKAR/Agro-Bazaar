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

function Orderseller() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [bill , setBill] = useState([]);
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

  useEffect(() => {
    async function fetchBill() {
        try {
            const res = await fetch(`http://localhost:5000/getbillforseller/${id}`);
            if (res.ok) {
                const data = await res.json();
               // Handle the data received from the server
                setBill(data);
                console.log(bill.length);
            } else {
                console.error('Failed to fetch bill:', res.status);
            }
        } catch (error) {
            console.error('Error fetching bill:', error);
        }
    }
    fetchBill();
}, []);


return (
    <div className='order-sellerppage'>
  
      <nav className='s-nav'>
        <div className='s-h-div'>
          <div className='s-profile' title="Dashboard" onClick={routeTodashboard}>
            <FontAwesomeIcon icon={faHouse} size="xl" style={{color: "#131416"}} />   
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div className='s-profile' title="Profile" onClick={routeToprofile}>
            <FontAwesomeIcon icon={faUser} size="xl" />
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div className='s-profile' title="Orders" onClick={() => {navigate(`/orderseller/${id}`)}} >
            <FontAwesomeIcon icon={faCartShopping} size="xl" />
          </div>
        </div>
        <div className='lo-btn-div'>
          <h3>O R D E R S&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h3>
          <button className='s-add' onClick={handleAdd}>Create Product</button>
          <button className='s-logout' onClick={handleLogout}>Logout</button>
          <ToastContainer />
        </div>
      </nav>
  
      <div className='container-order'>
  {bill.length > 0 ? (
    bill.map((item) => {
      // Convert ISO date string to Date object
      const dateObj = new Date(item.date);
      // Get day, month, and year
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1; // Months are zero-indexed
      const year = dateObj.getFullYear();
      // Format the date as dd-mm-yyyy
      const formattedDate = `${day}-${month < 10 ? '0' + month : month}-${year}`;
      return (
        <div className='bill-card' key={item._id}>
          <div className='bill-id'>
            <h4>ID : <span className='id-span'>{item._id}</span></h4>
          </div>
          <div className='bill-list'>
            <ul className='ul-bill'>
              <li className='li-bill'>
                <h5><span className='span-li-bill'>No.of.items : </span> {item.cartObject.productsToCart.length}</h5>
              </li>
              <li className='li-bill'>
                <h5><span className='span-li-bill'>Price : </span> {item.totalamount}</h5>
              </li>
              <li className='li-bill'>
                <h5><span className='span-li-bill'>Date : </span> {formattedDate}</h5> {/* Use formatted date */}
              </li>
              <li className='li-bill'>
                <h5><span className='span-li-bill'>Buyer : </span> {item.buyerobj.name}</h5>
              </li>
              <li className='li-bill'>
                <h5><span className='span-li-bill'>Mode :</span> {item.mode}</h5>
              </li>
            </ul>
          </div>
        </div>
      );
    })
  ) : (
    <p>--</p>
  )}
</div>

    </div>
  );


}
export default Orderseller;