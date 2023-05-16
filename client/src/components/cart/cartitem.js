import React,{useRef} from "react";


const CartItem = (prod)=>{
    const imgRef = useRef();
    const onImageError = () => imgRef.current.src="/fallback-image.png";
    
    let base64string;
    if(prod.photo){
    base64string = btoa(String.fromCharCode(...new Uint8Array(prod.photo.data.data)));
    }
    let date =prod.takendate;
    let d = date.substring(0,10);
    
    let dx = prod.givendate;
    let f ;
    if(prod.givendate){f=dx.substring(0,10);}
    else{f="";
    }
    
    return (<div className="" style={{height:"auto",width:"250px",
    backgroundColor:"white",color:"black",borderColor:"black",boxShadow:"1px 1px 2px 2px black",borderRadius:"10px"
    ,textAlign:"center",marginRight:"4rem",marginTop:"1rem"}}>
     <img className="mt-1" ref={imgRef} src={`data:image/png;base64,${base64string}`} height="100px" width="auto" alt="no-image" onError={(e)=>{e.target.onerror=null;e.target.src=`default${Math.ceil(4*Math.random())}.webp`}} ></img>
    <h4 className="">{prod.name}</h4>
    <div className="" >
    <h6 className="ms-4" style={{float:"left"}}>author : {prod.author}</h6>
    {/* <h6  className="ms-4" style={{float:"left"}}>status : {prod.no_of_copies>0?"Available":"Not available"} </h6>
    <h6 className="ms-4" style={{float:"left"}}>Copies Available : {prod.no_of_copies}</h6> */}
    <h6 className="ms-4 " style={{float:"left"}}>Taken Date : {d}</h6>
    {prod.givendate? <h6 className="ms-4 mb-4" style={{float:"left"}}>Given Date : {f}</h6>:<></>}
    </div>
    </div>);
}
export default CartItem;