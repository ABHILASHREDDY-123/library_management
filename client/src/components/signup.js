import React,{useState,useNavigate} from "react";
import "./signin.css";
import { createUser } from "../controllers/user";
 const SignUp = () =>{
        const [message,setMessage] = useState("");
        const [student,setStudent]=useState(1);
        const submitForm = (data)=>{
          data = data.target;
          let user = {gmail:data[0].value
            ,password:data[2].value,name:data[1].value,reg_no:data[3].value,isuser:student};
          createUser(user).then((resp)=>{
             setMessage(resp.data);
             
          })
          .catch((err)=>{
            console.log(err);
          }) 
        }
        const optionSelection = () =>{
              let val = document.getElementById("ctx").value;
              if(val==="admin"){setStudent(0);}
              else{
                setStudent(1);
              }
        }
       
    return (
        <div className="main">
          <p className="sign" align="center">Sign up</p>
          {message!==""?<p className="sign" style={{textAlign:"center",fontSize:"15px",color:"red"}}>{message}</p>:<></>}
          <form className="form1" onSubmit={(e)=>{;e.preventDefault();submitForm(e)}}>
            <input className="un " type="text" align="center" placeholder="Gmail"/>
            <input className="un " type="text" align="center" placeholder="UserName"/>
            <input className="pass" type="password" align="center" placeholder="Password"/>
            {student?<input className="un" type="text" align="center" placeholder="registration no"/>:<></>}
            <select className="un" type="text" id="ctx" onChange={(e)=>optionSelection()}>
              <option className="un" value="student">Student</option>
              <option className="un" value="admin">Admin</option>
            </select>
            <button className="submit" align="center" type="submit">Sign up</button>
            <p className="forgot" align="center"><a href="/signin">Have an account?</a></p>
               </form>   
                      
          </div>);


}
export default SignUp;