import React,{useState,useEffect} from "react";
import CartItem from "./cartitem";
const Cartk=(props)=>{

   return (
   <div>
    <p className="p-3 mt-2 ms-5 " style={{fontFamily:"Ubuntu",fontSize:"30px",textAlign:"center"}} ><u>Books Taken</u></p>
   <div className="d-flex flex-wrap mt-2 ms-5 mr-5" style={{padding:"10px",borderBottom:"black solid 2px"}} >
    { props.books?props.books.map((e)=><CartItem key={e.refno} name={e.name} author={e.author} publishedDate = {e.publishedDate} no_of_copies={e.no_of_copies} takendate={e.takendate} photo={e.photo}></CartItem>):<></>} 
   </div>
   <div>
   <p className="p-3 mt-2 ms-5 " style={{fontFamily:"Ubuntu",fontSize:"30px",textAlign:"center"}} ><u>Books History</u></p>
    <div className="d-flex flex-wrap mt-2 ms-5 mr-5"  style={{ padding:"10px",borderBottom:"black solid 2px"}}>
    {props.list?props.list.map((e)=><CartItem key={e.refno} name={e.name} author={e.author} publishedDate={e.publishedDate} no_of_copies={e.no_of_copies} takendate={e.takendate} givendate = {e.givendate} photo={e.photo}/>):<></>}
    </div>
   </div>
   <p className="mt-5 ms-5" style={{fontFamily:"Ubuntu",fontSize:"20px"}}><u>Fine To be Paid</u> : {props.fine}rs</p>
   <p className="mt-5 ms-5" style={{fontFamily:"Ubuntu",fontSize:"20px"}}><u>Fine Paid Till Now</u> :  {props.fee}rs</p>
   </div>
   );
}
export default Cartk;