import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import {forgotPass} from "../controllers/user";
import { useParams } from "react-router-dom";
import "./signin.css";
 const ForgotPass = () =>{
         const navigate = useNavigate();
         const [msg,setmsg] = useState("");
         const [err, seterr] = useState("");
         const [student,setStudent]=useState(1);
        const Submit = (data) =>{
              data = data.target;
              let x = {
                gmail:data[0].value
                ,admin:!student
              };
              forgotPass(x).then((resp)=>{
                if(resp.data.err==undefined){
                    setmsg(resp.data.data);
                    seterr("");
                  document.getElementById("form3").reset();
                }
                  else{
                    setmsg("");
                    seterr(resp.data.error);
                  }
              })
              .catch((err)=>{
                console.log(err);
              })
        }
      
        const optionSelection = () =>{
              let val = document.getElementById("ctx").value;
              seterr("");
              if(val==="admin"){setStudent(0);}
              else{
                setStudent(1);
              }
        }
       
    return (
        <div className="main">
          <p className="sign" align="center">Forgot Password</p>
         {err.length>0?<p className="" align="center" style={{color:"red",fontSize:"17px",fontFamily:"Ubuntu"}}>{err}</p>:<></>}
          {msg.length>0?<p className="" align="center" style={{color:"green",fontSize:"17px",fontFamily:"Ubuntu"}}>{msg}</p>:<></>}
          <form className="form3" id="form3" style={{paddingTop:"10px"}} onSubmit={(e)=>{e.preventDefault();Submit(e);}}>
            <input className="un" type="text" align="center" placeholder="Gmail" onChange={()=>{seterr("");setmsg("");}}/>
            <select className="un" type="text" id="ctx" onChange={(e)=>optionSelection()}>
              <option className="un" value="student">Student</option>
              <option className="un" value="admin">Admin</option>
            </select>
            <button className="submit" align="center" type="submit">Submit</button>
            <p className="forgot" align="center"><a href="/signin">Sign In</a></p>
               </form>   
                      
          </div>);


}
export default ForgotPass;