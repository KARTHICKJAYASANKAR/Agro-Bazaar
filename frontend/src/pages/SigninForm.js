import React, { useState } from 'react';
import '../App.css';
import { Link , useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function SigninForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };


const handleSubmit =async (event) => {

        event.preventDefault();
        //toast("Loging in!");
        try{
            if(email=='' || password=='')
            {
                toast("Enter all fields");
                navigate('/signinseller');
                return;
            }
            console.log('signin data:', { email, password });
         const res = await fetch("http://localhost:5000/loginseller" , {
        method: 'POST',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await res.json();
      console.log(data);
      if(res.ok)
    {
        toast("Login success !!");
        setTimeout(() => {
            navigate(`/sellerhome/${email}`);
          }, 800);
    }
    else{
        toast("Invalid username or password!");
        navigate('/signinseller');
        return;
    }
        }
        catch(e){
       console.log(e);
        }
       
   
};

    return (
        <div className='register'>
            <form className='reg-form'>

                <label>
                    Email:
                    <input type='email' value={email} onChange={handleEmailChange} required />
                </label>

                <label>
                    Password:
                    <input type='password' value={password} onChange={handlePasswordChange} required />
                </label>
   
                <div>
                <button className='btn-model' type='submit' onClick={handleSubmit}>Login</button>
                <ToastContainer />
                </div>
               
                <h4><Link to="/registerseller">Doesn't have account?</Link></h4>
            </form>
        </div>
    );
}


export default SigninForm;
