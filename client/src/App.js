import React,{useEffect,useState} from "react";
import Navbar from "./components/navbar";
import Home from "./components/home";
import {Route,Routes} from "react-router-dom";
import { getBooks } from "./controllers/book";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import AddBook from "./components/book/addBook";
import Cart from "./components/cart/cart";
import Profile from "./components/profile";
import { isUserAuth,getUser } from "./controllers/user";
import MangageBook from "./components/admin/givetakebook";
import {getBookDetail} from "./controllers/book";
import ForgotPassword from "./components/forgotPassword";
import ForgotPass from "./components/forgotPass";
import Loading from "./components/loading";
import RemoveBook from "./components/book/removeBook";
import Search from "./components/search";
function App() {
  const [books,setBooks] = useState([]);
  const [user,setUser] = useState({});
  const [loading,setLoading] = useState(1);
  const [borrowed,setBorrowed] = useState([]);
  const [list,setList] = useState([]);
 useEffect(()=>{
  setLoading(1);
 
  if(isUserAuth()){
    getUser().then((respx)=>{
      setUser(respx.data.resp);
      getBooks().then((resp)=>{
        let flag=1;
        if(resp && books.length===resp.length){let f=0;
          for(let i=0;i<books.length;i++){
          if(books[i]!==resp[i]){flag=1;}}
        if(f===0){flag=0;}}
      if(flag){setBooks(resp);
         let x = [{}];
         let f = new Map();
         if(respx.data.resp.borrowed){
         respx.data.resp.borrowed.map((e)=>{f.set(e.book_id,e);})
         resp.map((e)=>{
          if(f.has(e._id)){
                let hh = e;
                let gg = f.get(e._id);
                hh.givendate = gg.givendate;
                hh.takendate = gg.takendate;
               x.push(hh);
          }
         });
         x.splice(0,1);
         setBorrowed(x);
        }
        if(respx.data.resp.list){
          let y = [{}];
          let fx  = new Map();
            respx.data.resp.list.map((e)=>{
              fx.set(e.book_id,e);
            });
            resp.map((e)=>{
              if(fx.has(e._id)){
                let hh = e;
                let gg = fx.get(e._id);
                hh.givendate = gg.givendate;
                hh.takendate = gg.takendate;
                y.push(hh);
              }
            });
            y.splice(0,1);
            setList(y);        
        }
    
      }
      
    });
      
    })
      .catch((err)=>{
        console.log(err);
      });
 

}
else{
  getBooks().then((resp)=>{
    setBooks(resp);
  })
  .catch((err)=>{
    console.log(err);
  })
}
var now = new Date().getTime();
var interval = setInterval(function () {
   if (new Date().getTime() - now > 500) {
      clearInterval(interval);
      setLoading(0);
      return;
   }
   
}, 500);

 },[]);
  return (
     <div className="App">
       <Navbar/>
      {loading?<div style={{width:"100%",justifyContent:"center",justifyItems:"center",display:"flex"}}><Loading/></div>:
     <div className="App">
           <Routes>
            <Route path='/signin' element={<SignIn/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/addbook' element={<AddBook/>}/>
            <Route path='/deletebook' element={<RemoveBook/>}/>
            <Route path="/cart" element={<Cart list={list} books={borrowed} fine={user.fine_paid} fee={user.fee}/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/search" element={<Search/>}/>
            <Route path="/managebook" element={<MangageBook/>}/>
            <Route path="/forgot/verify/:token" element={<ForgotPassword/>}/>
            <Route path="/forgot" element={<ForgotPass/>}/>
            <Route exact path='/' element={<Home books={books} load={loading}/>}/>
           

           </Routes>
           
    </div>
}
    </div>
  );
}

export default App;
