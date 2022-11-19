import React,{useState} from "react";
import { signIn } from "../controllers/user";
import { useNavigate } from "react-router-dom";
import "./signin.css";
 const SignIn = () =>{
         const navigate = useNavigate();
         const [err, seterr] = useState("");
         const [student,setStudent]=useState(1);
        const Submit = (data) =>{
              data = data.target;
              let x = {
                gmail:data[0].value,
                password:data[1].value
                ,isuser:student
              };
              signIn(x).then((resp)=>{
                console.log(resp);
                if(resp.data.err!=1){
                  if(student==0){
                    localStorage.setItem("libadmin",JSON.stringify(resp.data));
                    navigate("/");
                  }
                  else{
                  localStorage.setItem("libstudent",JSON.stringify(resp.data));
                 navigate("/");
                  }
                }
                  else{
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
          <p className="sign" align="center">Sign in</p>
          
          
          {err.length>0?<p className="" align="center" style={{color:"red",fontSize:"17px",fontFamily:"Ubuntu"}} >{err}</p>:<></>}
            
          <form className="form1" style={{paddingTop:"10px"}} onSubmit={(e)=>{e.preventDefault();Submit(e);}}>
            <input className="un " type="text" align="center" placeholder="Gmail" onChange={()=>{seterr("");}}/>
            <input className="pass" type="password" align="center" placeholder="Password" onChange={()=>{seterr("");}}/>
            <select className="un" type="text" id="ctx" onChange={(e)=>optionSelection()}>
              <option className="un" value="student">Student</option>
              <option className="un" value="admin">Admin</option>
            </select>
          
            <button className="submit" align="center" type="submit">Sign in</button>
            <p className="forgot" align="center"><a href="/forgot">Forgot Password?</a></p>
               </form>   
                      
          </div>);


}
export default SignIn;