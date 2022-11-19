import React,{useEffect,useState} from "react";
import { isUserAuth,getUser, updateUser } from "../controllers/user";
const Profile = () =>{
    const [user,setUser] = useState({});
   
    useEffect(()=>{
     
        if(isUserAuth()){
         getUser().then((resp)=>{ 
           let {name,borrowed,gmail,reg_no,list,fine_paid,fee,_id} = resp.data.resp;
           let x = {name,borrowed,gmail,reg_no,list,fine_paid,fee,_id};
           if(!user.gmail || user.borrowed!==x.borrowed || user.gmail!==x.gmail || x.reg_no!==user.gmail || x.list!=user.list){
           setUser(x);
         
           }
         })
         .catch((err)=>{console.log(err);})
          
           
          
        }
         },[]);
         const Change = (e) =>{
          console.log(e);
         };
         const updateProfile=()=>{
           let name = user.name;
           let password=user.password;
           
           let obj = {reg_no:user.reg_no};
          
           if(password!==""){
              obj.password  = password;
           }
           if(name!==""){
            obj.name = name;
           }
           updateUser(obj).then((resp)=>{
          setUser(resp.data.user);
           })
           .catch((err)=>{
            console.log(err);
           })
         }
    return (

<div className="container rounded bg-white mt-5 mb-5">
    <div className="row">
        <div className="col-md-3 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5"><img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"/><span className="font-weight-bold">{user.name}</span><span className="text-black-50">{user.gmail}</span><span> </span></div>
        </div>
        <div className="col-md-5 border-right">
            <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-right">Profile</h4>
                </div>
                <div className="row mt-2">
                    <div className="col-md-6"><label className="labels">Name</label><input type="text" className="form-control" placeholder="Name" value={user.name} onChange={(e)=>{setUser({...user,name:e.target.value});}}/></div>
                    <div className="col-md-6"><label className="labels">Registration No</label><input type="text" className="form-control" placeholder="Reg no" value={user.reg_no} readOnly/></div>  
                </div>
                <div className="row mt-3">
                <div className="col-md-6"><label className="labels">Password</label><input type="password" className="form-control" placeholder="password" value={user.password} onChange={(e)=>{setUser({...user,password:e.target.value});}} /></div>
                </div>
                <div className="row mt-3">
                <div className="col-md-10"><label className="labels">Gmail</label><input type="text" className="form-control" placeholder="Gmail" value={user.gmail} readOnly/></div>
                </div>
                <div className="row mt-3">
                <div className="col-md-6"><label className="labels">Fine (Rs)</label><input type="text" className="form-control" placeholder="fine" value={user.fee-user.fine_paid} readOnly/></div>
                </div>
                <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="button" onClick={updateProfile}>Save Profile</button></div>
            </div>
        </div>
       
    </div>
</div>

    );

}
export default Profile;