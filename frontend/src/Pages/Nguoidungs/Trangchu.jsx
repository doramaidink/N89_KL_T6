import React, {useEffect, useState} from "react";
import Header from '../../UI/Nguoidungs/Headers/Header'
import Footer from '../../UI/Nguoidungs/Footer'
import ContentTrangchu from '../../UI/Nguoidungs/ContentTrangchu'
import axios from "axios";

 const Trangchu = () => {
   const [data, setData] = useState({
      diaDiemnoibat: []
   });
    useEffect(() =>{
      diaDiemNoiBat();
    },[]);
    const diaDiemNoiBat = async () => {
      try {
        const res = await axios.get('http://localhost:5000/');
        setData(res.data);
      } catch (error) {
        console.error('loi:', error);
      }
    } ;    
  return (
    <div>
        <Header/>
        <ContentTrangchu data = {data}/>
        <Footer/>
    </div>
  )
}
export default Trangchu;
