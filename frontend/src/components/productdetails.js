import React from 'react'
import Slider from "react-slick";
import HorizontalScroll from 'react-scroll-horizontal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link , useNavigate } from 'react-router-dom';
import { useState , useEffect , useContext} from 'react';
import { useParams } from 'react-router-dom';
import './productdetails.css';
import Spinner from './Spinner';
import Navbar from './Navbar';
import { BuyerIdContext } from '../App';
import Reviewofproduct from './Reviewofproduct';
import Accordion from 'react-bootstrap/Accordion';
import { Rate } from "antd";
import Modal from './Modal';

function Productdetails() {
    const {buyerId} = useContext(BuyerIdContext);
    const BUYERID = localStorage.getItem("buyerId");
    const { id } = useParams();
    const navigate = useNavigate();
    const [seller , setSeller] = useState(null)
    const [ productdetail , setProductdetail ] = useState([]);
    const [ quantity , setQuantity ] = useState(1);
    const  [ review , setReview ] = useState([]) ;
    const [modalOpen, setModalOpen] = useState(false);
    const [commentOpen , setCommentOpen] = useState(false);
    const [show , setShow] = useState("S H O W__R E V I E W S ↓");

    const openModal = () => {
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };

    useEffect(()=>{
       async function fetchDetailsofProduct(){
        const token = localStorage.getItem("buyer_TOKEN");
            const response = await fetch(`http://localhost:5000/fetchproductdetails/${id}` , {
                   method: 'GET',
                   headers:{
                    "authorization" : `Bearer ${token}`,
                    "Content-Type" : "application/json"
                   }
                })
            const data = await response.json();
            setProductdetail(data); 
            // console.log(productdetail[0])
            console.log(BUYERID);
        }
        fetchDetailsofProduct();
    },[])
    useEffect(()=>{
        async function fetchDetailsofSeller(){
            try {
                const response = await fetch(`http://localhost:5000/fetchsellerforcart/${productdetail[0].sellerobj.email}`, {
                    method: 'GET',
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch seller profile');
                }
    
                const sellerData = await response.json();
                setSeller(sellerData[0]);
                setReview(productdetail[0].reviews.reverse())
                // console.log(sellerData); // Make sure the data is correct
    
            } catch (error) {
                console.error('Error fetching seller profile:', error);
            }
        }
        fetchDetailsofSeller();
    } , [productdetail])
    // useEffect(()=>{
    //     console.log(productdetail[0]);
    //     console.log(seller);
    // })
    

    async function addToCart(){
        const productdetailWithQuantity = {
            ...productdetail[0],
            quantity : quantity
        };
        const cartObject = {
            sellerId:productdetail[0].sellerobj,
            productsToCart:[productdetailWithQuantity]
        }
        toast("Item added to cart")
        const res = await fetch(`http://localhost:5000/addtocart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ BUYERID , cartObject })
        });
        console.log(res);
        if(res.status===200){
            // toast("Item added to cart")
        }
        if(res.status===405){
        const result = await fetch(`http://localhost:5000/addtocart`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ BUYERID , cartObject })
        });
        console.log(result);
        if(res.status==200){
                       // toast("Item added to cart")
        }
        }
}   

 const handlebuy = async ()=>{
        const sellerobj = productdetail[0].sellerobj;
        const buyerid = localStorage.getItem("buyerId");
        try{
            const res = await fetch(`http://localhost:5000/getbuyer/${buyerid}` , {
            method:"GET"
            }) 
            const buyerobj = await res.json();
            console.log(buyerobj);
            const productdetailWithQuantity = {
                ...productdetail[0],
                quantity : quantity
            };
            const cartObject = {
                sellerId:productdetail[0].sellerobj,
                productsToCart:[productdetailWithQuantity]
            }
            const response = await fetch(`http://localhost:5000/billcreation`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({sellerobj , buyerobj , cartObject})
            });
            const billid = await response.json();
            if(response.ok) {
                navigate(`/productbuy/${billid}`);
            }
        }
        catch(e)
        {
            console.log(e);
        }
       
 }

  return (
    <div className='product-details-page'>

        <div className='container'>
                <Navbar/>
        </div>

    <div>
 
        <div className='pd-div-img-content'>
      {productdetail.length ? (
        
        <>
          <div className='pd-left'>
            <img src={productdetail[0].picture} alt={productdetail[0].name} className='product-image' />
            <h2 className='product-price'>Rs.{productdetail[0].price}</h2>
          </div>

          <div className='pd-right'>
            <div className='pd-contents'>
              <h3>
                Product name : <span className='pd-content-italic'>{productdetail[0].name}</span>
              </h3>
              <h3>
                Product price : <span className='pd-content-italic'>Rs. {productdetail[0].price}</span>
              </h3>
              <h3>
                Category : <span className='pd-content-italic'>{productdetail[0].category}</span>
              </h3>
              <h3>
                Description : <span className='pd-content-italic'>{productdetail[0].description}</span>
              </h3>
              <h3>
                Seller : <span className='pd-content-italic'>{productdetail[0].sellerobj.name}</span>
              </h3>
              <Rate defaultValue={4.5} allowHalf/>
              <h3>
                Available Quantity :{' '}
                <span className='pd-content-italic'>{productdetail[0].fquantity}</span>
              </h3>
              <input
                className='inp-pd'
                type='number'
                placeholder='Quantity'
                value={quantity}
                onChange={(e) => {
                    if(e.target.value<productdetail[0].fquantity)
                    setQuantity(e.target.value>=1 ? e.target.value : 1);

                    if(e.target.value>=productdetail[0].fquantity)
                    setQuantity(productdetail[0].fquantity);
                }}
              />
            </div>

            <div className='pd-buttons'>
              <button
                className='pd-buy-cart-btn'
                onClick={() => {
                    //  navigate(`/productbuy/${id}`)
                    handlebuy()
                }}
              >
                Buy
              </button>
                    {/* <div> */}
                        <button className='pd-buy-cart-btn' onClick={addToCart}>Add to Cart</button>

                        <button className='pd-buy-cart-btn' onClick={openModal}>Give ratings</button>
                        <Modal isOpen={modalOpen} onClose={closeModal} product= {{...productdetail[0]}}>
                            
                        </Modal>

                        <ToastContainer />
                    {/* </div> */}
            </div>
          </div>
         
        </>
      ) : (
        <Spinner />
      )}

    </div>

   {/* Accordian */}
   
  { 
    productdetail.length ? (
    <div className='accordion-div' onClick={()=>{
        setCommentOpen(!commentOpen)
        if(commentOpen){
            setShow("S H O W__R E V I E W S ↓")
        }
        else{
            setShow("H I D E__R E V I E W S ↑")
        }
        }}>
       <h4 className='acc-head'> {show}</h4>
    </div>):(<></>)  
  }
   {
    commentOpen && (
        review.length > 0 ? (
            <div className='accordian-bdy'>
                {review.map((rev, index) => (
                    <div className='bdy-part-user' key={index}>
                        <div className='user-rat-date'>
                            <h3 className='usename-review'>{rev.data.name} <Rate defaultValue={rev.rating} allowHalf/>  {rev.rating}/5</h3>
                            <h6>{rev.formattedDate}</h6>
                        </div>
                        <p className='para-review'>" {rev.review} "</p>
                    </div>
                ))}
            </div>
        ) : (
            
            <div className='accordian-bdy'>
            <div className='bdy-part-user'>
                        <p className='para-review'>" NO REVIEW ADDED "</p>
                    </div>
            </div>
            
        )
    )
}

  
    </div>




    </div>
  )
}

export default Productdetails;