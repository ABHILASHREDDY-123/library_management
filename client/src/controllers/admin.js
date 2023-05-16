export const isAdminAuth = () =>{
    let x = localStorage.getItem("libadmin");
    let y = JSON.parse(x);
    return y;
}