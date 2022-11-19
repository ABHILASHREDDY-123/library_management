import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import {BookManage} from "../../controllers/book";
import "../signin.css";
 const MangageBook = () =>{
    const [err,seterr] = useState("");
    const [take,settake]  = useState(1);
    const [msg,setmsg] = useState("");
    const optionSelection = () =>{
        let val = document.getElementById("ctx").value;
        seterr("");
        if(val==="give"){settake(0);}
        else{
          settake(1);
        }
    }     
    const navigate = useNavigate();
         
         const Submit = (book) =>{
            let b = book.target;
            let x = {
                reg_no:b[0].value,
                ref_no:b[1].value,
                take:take
            };
            BookManage(x)
            .then((resp)=>{
                if(resp.data.err==1){
                    seterr(resp.data.error);
                }
                else{
                   document.getElementById("form1").reset();
                   setmsg("Successful");
                }
            })
            .catch((err)=>{
                console.log(err);
            })
         }
    return (
        <div className="main">
          <p className="sign" align="center">Book Management</p>
          {msg.length>0?<p className="" align="center" style={{color:"green",fontSize:"17px",fontFamily:"Ubuntu"}} >{msg}</p>:<></>}
          <form className="form1"id="form1" style={{paddingTop:"10px"}} onSubmit={(e)=>{e.preventDefault();Submit(e);}}>
            <input className="un " type="text" align="center" placeholder="Admission No" onChange={()=>{seterr("");}}/>
            <input className="un " type="text" align="center" placeholder="Book Reference" onChange={()=>{seterr("");}}/>
            <select className="un" type="text" id="ctx" onChange={(e)=>optionSelection()}>
              <option className="un" value="take">Student taking</option>
              <option className="un" value="give">Student giving</option>
            </select>
            {err.length>0?<p className="" align="center" style={{color:"red",fontSize:"17px",fontFamily:"Ubuntu"}} >{err}</p>:<></>}
            <button className="submit" align="center" type="submit">Submit</button>
            
             </form>   
                      
          </div>);


}
export default MangageBook;