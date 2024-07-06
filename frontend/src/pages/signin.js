import React, { useEffect , useState ,useContext } from 'react';
import '../App.css';
import {Link , useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BuyerIdContext } from '../App'
//----------------------------------------------------------> Buyer


function Signin() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token,setToken] = useState('');
    const { buyerId , setBuyerId } = useContext(BuyerIdContext);
    
    

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(email==='' || password==='')
        {
            toast("Enter all fields");
            navigate('/signin');
            return;
        }
         const res = await fetch("http://localhost:5000/loginbuyer" , {
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email:email,
                password:password
            })
         })
        
        const data = await res.json();
         if(res.ok)
         {
            // setBuyerId(data);
            toast("Login success !!");
                setTimeout(() => {
                    setBuyerId(data[0]);
                    setToken(data[1]);
                }, 800);
         }
         else
         {
            toast("Invalid username or password!");
                    navigate('/signinbuyer');
                    return;
         }
    };

    useEffect(() => {
        if (buyerId) {
            console.log(buyerId);
            console.log(token)
           
            localStorage.setItem("buyerId", buyerId);
            localStorage.setItem("buyer_TOKEN" , token);
            const BUYERID = localStorage.getItem("buyerId");
            navigate(`/home/${BUYERID}`);
        }
    }, [buyerId]);


    return (
        <div className='register'>
            <form className='reg-form' onSubmit={handleSubmit}>

                <label>
                    Email:
                    <input type='email' value={email} onChange={handleEmailChange} required />
                </label>

                <label>
                    Password:
                    <input type='password' value={password} onChange={handlePasswordChange} required />
                </label>
                
                <div>
                <button className='btn-model' type='submit'>Login</button>
                <ToastContainer />
                </div>
                
                <h4><Link to="/register">Doesn't have account?</Link></h4>
            </form>
        </div>
    );
}


export default Signin;
