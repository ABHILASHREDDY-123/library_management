import axios from "axios";
import { isAdminAuth } from "./admin";
export const getBooks = ()=>{
   if(isAdminAuth()){
      console.log(isAdminAuth().token);
      return axios.get("http://localhost:8000/admin/book",{
       headers:{ Authorization:`Bearer ${isAdminAuth().token}` }
      }).
      then((resp)=>{
         return resp.data.resp;
      })
   }
   else{
        return  axios.get("http://localhost:8000/users/book/").then((resp)=>{
            return resp.data.resp;

         })
         .catch((err)=>{
            console.log(err);
            return err;
         })
      }
};
export const addBook = (book) =>{
   return axios.post("http://localhost:8000/admin/book/",book,{headers:{Authorization:`Bearer ${isAdminAuth().token}`}}).then((resp)=>{
     
      return resp;
   })
   .catch((err)=>{
      console.log(err);
      return err;
   })

};
export const getBookDetail = (props) =>{
   return axios.get(`http://localhost:8000/users/book/${props}`).then((resp)=>{
      return resp.data.book;
      
   })
   .catch((err)=>{
      console.log(err);
   })
}
export const BookManage = (book) =>{
  if(book.take==1){
    return axios.put(`http://localhost:8000/admin/take/${book.ref_no}/${book.reg_no}`,
    {},{headers:{Authorization:`Bearer ${isAdminAuth().token}`}})
    .then((resp)=>{
      return resp;
    })
    .catch((err)=>{
      console.log(err);
    });

  }
  else{
   return axios.put(`http://localhost:8000/admin/give/${book.ref_no}/${book.reg_no}`,{}
   ,{headers:{Authorization:`Bearer ${isAdminAuth().token}`}})
   .then((resp)=>{
      return resp;
   })
   .catch((err)=>{
      console.log(err);
   });
  }
}