import React, { useState , useContext , useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BuyerIdContext } from '../App'



function Register() {
    const { buyerId , setBuyerId } = useContext(BuyerIdContext);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    async function handleSubmit(e){

        e.preventDefault()
        const res = await fetch("http://localhost:5000/register",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                name:name,
                email:email,
                password:password
            })
        })
        // .then(res=>res.json())
        // .then(data=>{
        //     navigate(`/home/${}`)
        //     console.log(data)
        // })
        const data = await res.json();
        //console.log(data);
        if(res.ok)
        {
           // setBuyerId(data);
           toast("Signup success !!");
               setTimeout(() => {
                   setBuyerId(data);
               }, 800);
        }
        else
        {
           toast("Username not available!");
                   navigate('/register');
                   return;
        }
        
}
    useEffect(() => {
        if (buyerId) {
            console.log("buyer id : " + buyerId);
            navigate(`/home/${buyerId}`);
        }
    }, [buyerId]);

    return (
        <div className='register'>
            <form className='reg-form' onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type='text' value={name} onChange={handleNameChange} required />
                </label>

                <label>
                    Email:
                    <input type='email' value={email} onChange={handleEmailChange} required />
                </label>

                <label>
                    Password:
                    <input type='password' value={password} onChange={handlePasswordChange} required />
                </label>

                <div>
                <button className='btn-model' type='submit'>Register</button>
                <ToastContainer />
                </div>
                
            </form>
        </div>
    );
}

export default Register;
