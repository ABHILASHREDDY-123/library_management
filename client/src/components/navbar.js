import React from "react";
import {isUserAuth} from "../controllers/user";
import { isAdminAuth } from "../controllers/admin";
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const navigate = useNavigate();
  const LogOut = () =>{
    localStorage.removeItem("libstudent");
    localStorage.removeItem("libadmin");
    navigate("/");
    
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-collapse" style={{fontSize:"20px"}}>
        <a className="navbar-brand ms-5" style={{fontSize:"24px",fontFamily:"Times New Roman", color: "yellow",marginRight:"35px" }} href="/">Library</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active ">
              <a className="nav-link ab" style={{fontFamily:"Times New Roman",  color: "white",marginRight:"35px" }} href="/"
              >Home <span className="sr-only"></span></a>
            </li>
            {(isUserAuth() && isUserAuth().token && isUserAuth().user)?
            <li className="nav-item">
              <a className="nav-link" style={{fontFamily:"Times New Roman",  color: "white",marginRight:"35px" }} href="/cart">Cart</a>
            </li>:<></>
}
{(isUserAuth() && isUserAuth().token && isUserAuth().user)?
            <li className="nav-item">
              <a className="nav-link" style={{fontFamily:"Times New Roman",  color: "white",marginRight:"35px" }} href="/profile">Profile</a>
            </li>
            :<></>}
           
            {isAdminAuth() && isAdminAuth().token && isAdminAuth().admin?
            <li className="nav-item">
              <a className="nav-link" style={{fontFamily:"Times New Roman",  color: "white",marginRight:"35px" }} href="/addbook">Add Book</a>
            </li>
            :<></>}
             {isAdminAuth() && isAdminAuth().token && isAdminAuth().admin?
            <li className="nav-item">
              <a className="nav-link" style={{fontFamily:"Times New Roman",  color: "white",marginRight:"35px" }} href="/deletebook">Remove Book</a>
            </li>
            :<></>}
             {isAdminAuth() && isAdminAuth().token && isAdminAuth().admin?
            <li className="nav-item">
              <a className="nav-link" style={{fontFamily:"Times New Roman",  color: "white",marginRight:"35px" }} href="/managebook">ManageBook</a>
            </li>
            :<></>}
              <li className="nav-item">
              <a className="nav-link" style={{fontFamily:"Times New Roman",  color: "white",marginRight:"35px" }} href="/search">Search</a>
            </li>
             {isUserAuth() || isAdminAuth()?
             <li className="nav-item">
             <a className="nav-link" style={{fontFamily:"Times New Roman",  color: "white",marginRight:"35px" }} href="/" onClick={LogOut}>LogOut</a>
             </li>
             :
            <>
            <li className="nav-item">
              <a className="nav-link" style={{fontFamily:"Times New Roman",  color: "white",marginRight:"35px" }} href="/signin">SignIn</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" style={{fontFamily:"Times New Roman",  color: "white",marginRight:"35px" }} href="/signup">SignUp</a>
            </li>
            </>
}
          </ul>

        </div>
      </nav>
    </>
  )
}
export default Navbar;