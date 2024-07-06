import React,{useState , useEffect} from 'react';
import './Modal.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './Spinner';

const Modal = ({ isOpen, onClose, onSubmit ,seller}) => {
    
    const [bid , setBid] = useState(null);
    const [sid , setSid] = useState(null);
    const [load , setLoad] = useState(false);
    const [sug , setSug] = useState("");
    useEffect(()=>{
        setLoad(false);
        setSid(seller._id);
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
           
            const response = await fetch(`http://localhost:5000/getbuyer/${BUYERID}`,{
                method:"GET"
            })
            
            const data = await response.json();
            const obj = {
                data,
                sug
            }
            const res = await fetch(`http://localhost:5000/addsuggestion/${sid}`,{
                method:"POST",
                headers:{ "Content-Type": "application/json"},
                body: JSON.stringify({ obj })
            })
            if(res.ok){
                setLoad(false);
                console.log("Added");
                toast("Thanks for your Suggestion!")
                setSug("");
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
        <ToastContainer/>
          <div className="modal-content">
          {
            load?<Spinner/>:<></>
          }
            <h2 className='review-h'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Give your suggestions</h2>
            <textarea className='txt-review' name="feedback" rows="8" cols="50" value={sug} onChange={(e)=>{setSug(e.target.value)}} />
          </div>
         
          <button type="submit" onClick={submitreview}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
