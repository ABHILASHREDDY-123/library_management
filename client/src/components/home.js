import React from "react";
import BookItem from "./book/bookitem";
import Loading from "./loading";
const Home=(props)=>{
   return (<div className="d-flex flex-wrap mt-2 ms-5 mr-5" style={{}} >
   {props.books?props.books.map((e)=>{
        return <BookItem key={e.refno} name={e.name} author={e.author} publishedDate={e.publishedDate} no_of_copies={e.no_of_copies} photo={e.photo} />
    }):<></>}
   </div>)

}
export default Home;