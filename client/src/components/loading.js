import { RotatingLines } from 'react-loader-spinner';
const Loading = () =>{

 return (
  <div style={{alignContent:"center",justifyItems:"center",justifyContent:"center"}}>
<RotatingLines
  strokeColor="black"
  strokeWidth="5"
  animationDuration="0.75"
  width="50"
  visible={true}
/>
</div>
 );
}
export default Loading;