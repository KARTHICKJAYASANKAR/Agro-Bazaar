import React from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState , useEffect } from 'react';
import { useParams   } from 'react-router-dom';
import './productbuy.css';
import Spinner from './Spinner';
import Navbar from './Navbar';
import StripeCheckout from "react-stripe-checkout";



function Productbuy() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ bill , setBill ] = useState(null);
    const [name , setName] = useState('');
    const [phn , setPhn] = useState('');
    const [email , setEmail] = useState('');
    const [addr , setAddr] = useState('');
    const [loading , setLoading] = useState(false);

    useEffect(()=>{
        async function fetchDetailsofBill(){
         const token = localStorage.getItem("buyer_TOKEN");
             const response = await fetch(`http://localhost:5000/getbill/${id}` , {
                    method: 'GET',
                    headers:{
                     "authorization" : `Bearer ${token}`,
                     "Content-Type" : "application/json"
                    }
                 })
             const data = await response.json();
             console.log(data);
             
             setBill(data); 
             // console.log(productdetail[0])
            //  history.replace(history.location.pathname);
           
         }
 
         fetchDetailsofBill();
     },[])
    //  useEffect(()=>{
    //         setNofp(bill.cartObject.productsToCart.length);
    //  },[bill])


     const cancelbill = async() =>{
          const res =  window.confirm("Are you sure to Cancel this Bill?")
          console.log(res);
          if(res){
            const response = await fetch(`http://localhost:5000/deletebill/${id}` , {
                method:"DELETE"
            })
            if(response.ok){
                if(bill.cartObject.productsToCart.length==1)
                navigate(`/productdetails/${bill.cartObject.productsToCart[0]._id}`);

                else{
                    const BUYERID = localStorage.getItem("buyerId")
                    navigate(`/cart/${BUYERID}`);
                }

            }
          }
          else{
            
          }
     }

     const cashOnDelivery = async() =>{
        
        const mode = "CASH ON DELIVERY";
        setLoading(true);
        if(name==='' || phn==='' || email==='' || addr==='')
        {
            toast("Fill all details to place order");
            setLoading(false)
            return;
        }
            

            try{
                console.log(mode);
                  const res = await fetch(`http://localhost:5000/confirmorder/${id}`,{
                    method:"POST",
                    headers:{
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phn,
                        addr,
                        mode
                    })
                  })
                  console.log(res)
                  if(res.ok)
                  {
                    setLoading(false);
                    setTimeout(()=>{
                        toast("Your Order Placed!!")
                    },600)
                    navigate(`/productdetails/${bill.cartObject.productsToCart[0]._id}`)
                  }
                  
            }
            catch(e){
                console.log(e);
            }
     }


     const makePay = (token) =>{
        if(name=='' || email=='' ||  phn=='' || addr==''){
            toast("fill all details")
            return;
        }
        else{
            const mode = "CARD PAYMENT";
            const body ={token,bill,name,email,phn,addr,mode}
            const headers = {"Content-Type" : "application/json"}
            return fetch("http://localhost:5000/payment",{
                method:"POST",
                headers,
                body:JSON.stringify(body)
            }).then((response)=>{
                console.log(response);
                if(response.ok){
                    setLoading(true);
                    const res = fetch(`http://localhost:5000/confirmorder/${id}`,{
                    method:"POST",
                    headers:{
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phn,
                        addr,
                        mode
                    })
                  }).then((response)=>{
                     if(response.ok){
                        setLoading(false);
                        setTimeout(()=>{
                            toast("Your Order Placed!!")
                        },600)
                        navigate(`/productdetails/${bill.cartObject.productsToCart[0]._id}`)
                     }
                     else{
                        toast("Payment failed. Please try again");
                      }
                  }).catch((e)=>{
                    console.log(e);
                  })
                }
            }).catch((e)=>{
                console.log(e);
            })
        }
       
     }

  return (
    <div>
        <Navbar />

     {    bill!==null ?(<div className='pd-div-img-content'>

            <div className='pd-left'>
                <img src="https://res.cloudinary.com/dgtonwmdv/image/upload/v1708627996/images/5910060_lmj9qx.jpg" className='product-image'/>
                <h2 className='product-price'>Total = ₹{bill.totalamount}</h2>
            </div>

            <div className='pb-right'>
                <div className='pb-form-div'>
                <ToastContainer />
                {loading?(<Spinner/>):(<></>)}
                <input className='inp-pb' type='text' placeholder='Name..' required value={name} onChange={e =>setName(e.target.value)}/>
                <input className='inp-pb' type='text' placeholder='Phone number..' required value={phn} onChange={e =>setPhn(e.target.value)}/>
                <input className='inp-pb' type='text' placeholder='Email..' required value={email} onChange={e =>setEmail(e.target.value)}/>
                <input className='inp-pb' type='text' placeholder='Address..' required value={addr} onChange={e =>setAddr(e.target.value)}/>
                <h3>Choose the Payment method</h3>
                </div>

                <div className='pb-btn-div'>
                    <ToastContainer/>
                    <button className='pb-btn' onClick={cashOnDelivery}>Cash on Delivery</button>
                    <StripeCheckout 
                    name="Card payment" 
                    amount={bill.totalamount*100} 
                    currency='INR' 
                    token={makePay}
                    stripeKey='pk_test_51ODJlUSBncmV7btftNtonc4Zms89o3lbHKk8qSgzK69Zu4qEFYJJ4OoIDQh02qWPlxjCLorXf2xe5bigvfKR23ea00EhGiFuIy'
                    >
                         <button className='pb-btn' >Card</button>
                    </StripeCheckout>
                    
                    <button className='pb-btn' onClick={cancelbill}>Cancel</button>
                </div>
                
            </div>

        </div>):(
            <Spinner/>
        )
    } 

    </div>
  )
}

export default Productbuy