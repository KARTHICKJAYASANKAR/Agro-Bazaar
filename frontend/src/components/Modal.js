import React,{useState , useEffect} from 'react';
import './Modal.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './Spinner';

const Modal = ({ isOpen, onClose, onSubmit ,product}) => {
    const [rating , setRating] = useState(0);
    const [review , setReview]= useState("");
    const [bid , setBid] = useState(null);
    const [pid , setPid] = useState(null);
    const [load , setLoad] = useState(false);
    useEffect(()=>{
        setRating(0);
        setReview("");
        setLoad(false);
        setPid(product._id);
    },[])
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const rating = formData.get('rating');
    const feedback = formData.get('feedback');
    onSubmit({ rating, feedback });
    onClose();
  };
  const submitreview = async(event)=>{
    setLoad(true);
    const BUYERID = localStorage.getItem("buyerId");
   // setPid(product._id);
           try{ 
            event.preventDefault();
            setBid(BUYERID);
            const reviewObj = {
                rating:rating,
                review:review
            }
            const response = await fetch(`http://localhost:5000/getbuyer/${BUYERID}`,{
                method:"GET"
            })
            console.log(product);
            const data = await response.json();
            const res = await fetch(`http://localhost:5000/addreview/${pid}`,{
                method:"POST",
                headers:{ "Content-Type": "application/json"},
                body: JSON.stringify({reviewObj , data })
            })
            if(res.ok){
                setLoad(false);
                console.log("Added");
                toast("Review added!")
                setRating(0);
                setReview("");
                onClose();
            }
        }
        catch(e){
            console.log(e);
        }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>X</button>
        <form >
          <div className="modal-content">
          {
            load?<Spinner/>:<></>
          }
            <input className='rat-inp' type="number" name="rating" min="1" max="5" placeholder='Give your rating out of 5' value={rating} onChange={(e)=>{setRating(e.target.value)}} required />
            <h2 className='review-h'>Give your review</h2>
            <textarea className='txt-review' name="feedback" rows="4" cols="50" value={review} onChange={(e)=>{setReview(e.target.value)}} />
          </div>
          <ToastContainer/>
          <button type="submit" onClick={(event)=>submitreview(event)}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
