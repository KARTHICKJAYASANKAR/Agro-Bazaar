import React, { useState , useEffect} from 'react';
import '../App.css';
import '../pages/Edit.css';
import {Cloudinary} from "@cloudinary/url-gen";
import { Link , useNavigate  , useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const CreateProduct = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [ img , setImg ] = useState(null);
    const [sellerobj , setSellerobj] = useState(null);
    var imgurl;

   const [ name , setName] = useState('');
   const [ description , setDescription] = useState('');
   const [ price , setPrice] = useState(0);
   const [ category , setCategory] = useState('');
   const [ picture , setPicture] = useState('');
//    const [ sellerid , setSellerid] = useState('');
   const [ quantity , setQuantity] = useState(0);


   useEffect(()=>{
       async function getSeller(){
            const res = await fetch(`http://localhost:5000/sellerhome/${id}` , {
                method:'GET',
            })
            const data = await res.json();
            console.log(data[0]);
            setSellerobj(data[0]);
        }
        getSeller();
   },[])

   const storeDB = async()=>{

    try{
        console.log("image url : " + imgurl);
        console.log(name , description , price , category , quantity);
         
        const response = await fetch(`http://localhost:5000/createproduct/${id}` , {
        method: 'POST',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
        name,
        description,
        price,
        category,
        imgurl,
        id,
        sellerobj,
        quantity
        })
      })
      console.log("response : " + response);
      const data = response.json();
      console.log("data :" +  data);
      if(data)
      {
        toast("Your Product created");
        setTimeout(() => {
            navigate(`/sellerhome/${id}`);
          }, 800);
      }
      else
      console.log("Some err in storing in DB");
    
       }
       catch(err)
       {
        console.log(err);
       }

       

}
// async function editpro() {
//     try {
//         const res = await fetch(`http://localhost:5000/editProduct/65cd2affd4810c643681b922`, {
//             method: 'PUT',
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ sellerobj }) // Wrap sellerobj in an object
//         });

//         if (res.ok) {
//             console.log("Success");
//         } else {
//             console.log("Something went wrong:", res.statusText);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }


// this function is to upload image in cloudinary and get the url.....//
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






  const handleSubmit = (e) => {
    e.preventDefault();
    uploadFile('image');
    // console.log('Submitted Product Data:', productData);
  };

  return (
    <div className='create-page'>
        <form  className="p-form" autoComplete="off">
            <div className='p-h-div'>
            <h3 className='p-heading'>CREATE AND SELL YOUR PRODUCTS :)</h3>
            </div>
            
        <label className='p-label'>
            NAME :
            <input
            className='p-input'
            type="text"
            name="name"
            value={name} onChange={e=>setName(e.target.value)} required
            />
        </label>

        <label className='p-label'>
            DESCRIPTION :
            <textarea
            className='p-textarea'
            name="description"
            value={description} onChange={e=>setDescription(e.target.value)} required
            />
        </label>


        <label className='p-label'>
            PRICE :
            <input
            className='p-input'
            type="number"
            name="price"
            value={price} onChange={e=>setPrice(e.target.value)} required
            />
        </label>


        <label className='p-label'>
            QUANTITY :
            <input
            className='p-input'
            type="number"
            name="quantity"
            value={quantity}
            onChange={e=>setQuantity(e.target.value)}
            required
            />
        </label>


        <label className='p-label'>
            CATEGORY :
            <select
            name="category"
            value={category}
            onChange={e=>setCategory(e.target.value)}
            required
            >
            <option value="select one">Select one</option>
            <option value="vegetables/fruits">Vegetables/Fruits</option>
            <option value="Dairy products">Dairy Products</option>
            <option value="handmade snacks/sweets">Handmade Snacks/Sweets</option>
            <option value="Cereals/Legumes/Nuts">Cereals/Legumes/Nuts</option>
            <option value="Oilseeds">Oilseeds</option>
            <option value="Sugars and Starches">Sugars and Starches</option>
            <option value="Meat or soya Products">Meat or soya Products</option>
            <option value="Fibres">Fibres</option>
            <option value="Herbs/Spices/Aromatic Plants">Herbs/Spices/Aromatic Plants</option>
            <option value="Flowers">Flowers</option>
            <option value="Honey and Bee Products">Honey and Bee Products</option>
            <option value="Health and Wellness Products">Health and Wellness Products</option>
            </select>
        </label>

        <div className='create-prod-sub-btn'>

        <div>
            <label className='p-label'>UPLOAD PRODUCT IMAGE</label>
            <input type="file" name="profilePicture" onChange={e => setImg((prev)=>e.target.files[0])}  accept="image/*" />
        </div>
            
        <div>
            <button type="submit" className='create-p-btn' onClick={handleSubmit}>Submit</button>
            <ToastContainer />
        </div>
            
        </div>

                
    </form>
    </div>
    
  );
};

export default CreateProduct;
