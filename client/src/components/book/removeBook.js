import axios from "axios";
import React,{useState} from "react";
import { isAdminAuth } from "../../controllers/admin";

import "../signin.css";
 const RemoveBook = () =>{
     const [err,seterr] = useState("");
     const [msg,setmsg] = useState("");
     const Submit = (e) =>{
       let refno = e.target[0].value;
       axios.delete(`http://localhost:8000/admin/book/${refno}`,{headers:{Authorization:`Bearer ${isAdminAuth().token}`}})
       .then((resp)=>{
        console.log(resp);
        if(resp.data.err){
            seterr("Invalid Ref no");
            setmsg("");
        }
        else{
            setmsg("Successful");
            seterr("");
            document.getElementById("form5").reset();

        }
       })
       .catch((err)=>{
        console.log(err);
       })
     }
    return (
        <div className="main">
          <p className="sign" align="center">Remove Book</p>
          {err.length>0?<p className="" align="center" style={{color:"red",fontSize:"17px",fontFamily:"Ubuntu"}} >{err}</p>:<></>}
          {msg.length>0?<p className="" align="center" style={{color:"green",fontSize:"17px",fontFamily:"Ubuntu"}}>{msg}</p>:<></>} 
          <form className="form1" id="form5" style={{paddingTop:"10px"}} onSubmit={(e)=>{e.preventDefault();Submit(e)}}>
            <input className="un " type="text" align="center" placeholder="Ref no" onChange={()=>{seterr("");setmsg("");}} />
            <button className="submit" align="center" type="submit">Remove</button>
          
               </form>   
                      
          </div>);


}
export default RemoveBook;