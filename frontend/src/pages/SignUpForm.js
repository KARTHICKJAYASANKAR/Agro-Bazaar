import React, { useState } from 'react';
import '../App.css'
import {Cloudinary} from "@cloudinary/url-gen";
import { useNavigate } from 'react-router-dom';



const SignUpForm = () => {

    const navigate = useNavigate();
    const [ img , setImg ] = useState(null);
  //--
  const [ username , setUsername] = useState('');
  const [ password , setPassword] = useState('');
  const [ email , setEmail] = useState('');
  const [ farmerid , setFarmerid] = useState('');
  const [ phoneNumber , setPhoneNumber ] = useState('');
  const [ address , setAddress] = useState('');
  const [ city , setCity] = useState('');
  const [ upid , setUpid] = useState('');
//   const [ farmercertificate , setFarmercertificate ] = useState('');
  const [ profilePicture , setProfilePicture ] = useState('');
  var imgurl;
  //--
  

  const storeDB = async()=>{

    try{
        console.log("image url : " + imgurl);
        console.log(username , email , password , city , phoneNumber , address , upid);
         
        const response = await fetch("http://localhost:5000/registerSeller" , {
        method: 'POST',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
        username,
        email,
        password,
        farmerid,
        phoneNumber,
        address,
        profilePicture : imgurl,
        city,
        upid
        })
      })
      const data = response.json();
      if(data)
      {
        console.log(data);
        setImg(null);
        navigate(`/sellerhome/${email}`);
      }
      else
      console.log("Some err in storing in DB");
    
       }
       catch(err)
       {
        console.log(err);
       }

}




  function uploadFile(type){
    const data = new FormData();
    data.append("file" , img);
    data.append("upload_preset" , "image_preset");
    try {
        const cloudName = 'dgtonwmdv';
        const resourceType = 'image';
        const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
      
        fetch(api, {
          method: 'POST',
          body: data
        })
          .then(response => response.json())
          .then(result => {
            imgurl = result.secure_url;
            console.log("res.data from cloud:", result.secure_url);
            storeDB();
          })
          .catch(error => {
            console.error("Error uploading to Cloudinary:", error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
}



   const handleSubmit= (e)=>{
    e.preventDefault();
    uploadFile('image');
    // storeDB();
}




  return (
    <form className="sellform" onSubmit={(e)=>handleSubmit(e)}>
        <h3 className='heding-sell'>Register to sell products</h3>

        <div>
        <label>Name:</label>
        <input type="text" name="name" value={username} onChange={e=>setUsername(e.target.value)} required />
      </div>

      <div>
        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      </div>

      <div>
        <label>Password:</label>
        <input type="password" name="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      </div>

      <div>
        <label>Phone Number:</label>
        <input type="tel" name="phoneNumber" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} />
      </div>


      <div>
        <label>Enter Farmer ID:</label>
        <input type="text" name="farmerId" value={farmerid} onChange={e=>setFarmerid(e.target.value)} required />
      </div>

      <div>
        <label>Address:</label>
        <input type="text" name="address" value={address} onChange={e=>setAddress(e.target.value)} required />
      </div>

      <div>
        <label>City:</label>
        <input type="text" name="city" value={city} onChange={e=>setCity(e.target.value)} required />
      </div>

      <div>
        <label>UPID:</label>
        <input type="text" name="upid" value={upid} onChange={e=>setUpid(e.target.value)} required />
      </div>

      <div className='img-section-s'>
        {/* <label>Farmer certificate:</label>
        <input type="file" name="farmercertificate" onChange={e => setImg((prev)=>e.target.files[0])}  accept="image/*" /> */}

        <label>Profile image:</label>
        <input type="file" name="profilePicture" onChange={e => setImg((prev)=>e.target.files[0])}  accept="image/*" />
      </div>


      {/* <div>
        <label>Upload QR Image:</label>
        <input type="file" name="qrCode" onChange={handleChange} accept="image/*" />
      </div> */}


        <button className='btn-model' type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;

