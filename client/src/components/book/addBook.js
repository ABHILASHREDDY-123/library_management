import React,{useState} from "react";
import { addBook } from "../../controllers/book";
const AddBook = () =>{
    const [msg,setmsg] = useState("");
    const [err,seterr] = useState("");
    const [f,setf] = useState(new FormData());
    const fileChange = (e) =>{
      console.log("HELLO");
      let form = f;
      form.set("photo",e.target.files[0]);
      setf(form);
    }
   const submitForm = (data) =>{
    
    data = data.target;
    let form = new FormData();
    form = f;
    form.set("name",data[0].value);
    form.set("author",data[1].value);
    form.set("refno",data[2].value);
    form.set("no_of_copies",data[4].value);
    // let book = {
    //     name:data[0].value,
    //     author:data[1].value,
    //     refno:data[2].value,
    //     photo:data[3].value,
    //     no_of_copies:data[4].value
    // };

  
    addBook(form).then((resp)=>{
      console.log(resp);
      if(resp.data.err==1){
       seterr(resp.data.error);
       setmsg("");
      }
      else{
        setmsg("Successful");
        seterr("");
        document.getElementById("form2").reset();
      }
    })
    .catch((err)=>{
      console.log(err);
    })
   }
    return (
        <div className="main">
          <p className="sign" align="center">New Book</p>
          <form className="form1" id="form2" onSubmit={(e)=>{e.preventDefault();submitForm(e)}}>
            {err.length>0?<p className="" align="center" style={{color:"red",fontSize:"17px",fontFamily:"Ubuntu"}} >{err}</p>:<></>}
            {msg.length>0?<p className="" align="center" style={{color:"green",fontSize:"17px",fontFamily:"Ubuntu"}} >{msg}</p>:<></>}
            <input className="un " type="text" align="center" placeholder="Title"/>
            <input className="un " type="text" align="center" placeholder="Author"/>
            <input className="un " type="text" align="center" placeholder="Reference no"/>
            <input className="un" type="file" align="center" placeholder="picture" onChange={(e)=>{fileChange(e)}}/>
            <input className="un " type="text" align="center" placeholder="number of copies"/>
            <button className="submit" align="center" type="submit">Add Book</button>
          </form>           
          </div>);

}
export default AddBook;