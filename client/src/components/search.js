import axios from "axios";
import React,{useState} from "react";
import BookItem from "./book/bookitem";
import "./signin.css";
 const Search = () =>{
     const [err,seterr] = useState("");
     const [msg,setmsg] = useState("");
     const [books,setbooks] = useState([]);
     const Submit = (e) =>{
       let book_name= e.target[0].value;
       axios.get(`http://localhost:8000/users/book/search/${book_name}`)
       .then((resp)=>{
        if(resp.data.bk){
          if(resp.data.bk.length==0){return seterr("No Books Found");}
          else{
            let x = resp.data.bk;
            
            return setbooks(resp.data.bk);}
        }
        else{return seterr("No Books Found");}
        
       })
       .catch((err)=>{
        console.log(err);
       })
      
       
     }
    return (
        <div className="">
            <div className="main">
          <p className="sign" align="center">Search Book</p>
          {err.length>0?<p className="" align="center" style={{color:"red",fontSize:"17px",fontFamily:"Ubuntu"}} >{err}</p>:<></>}
          {msg.length>0?<p className="" align="center" style={{color:"green",fontSize:"17px",fontFamily:"Ubuntu"}}>{msg}</p>:<></>} 
          <form className="form1" id="form5" style={{paddingTop:"10px"}} onSubmit={(e)=>{e.preventDefault();Submit(e)}}>
            <input className="un " type="text" align="center" placeholder="Search" onChange={()=>{seterr("");setmsg("");}} />
            <button className="submit" align="center" type="submit">Search</button>
          
               </form>  
               </div> 
               <p className="p-3 mt-2 ms-5 " style={{fontFamily:"Ubuntu",fontSize:"30px",textAlign:"center"}} ><u>Searched Books</u></p>
               <div className="d-flex flex-wrap mt-2 ms-5 mr-5" style={{}} >
               {books.length>0?books.map((e)=>{
                    return <BookItem key={e.refno} name={e.name} author={e.author} publishedDate={e.publishedDate} no_of_copies={e.no_of_copies} photo={e.photo} />
               }):<></>}   
               </div>    
          </div>);


}
export default Search;