import React from 'react'
import Header from '../../UI/Nguoidungs/Headers/HeaderKhamPha'
import Footer from '../../UI/Nguoidungs/Footer'
import ContentKhampha from '../../UI/Nguoidungs/ContentKhampha'

 const Khampha = () => {
  return (
    <div>
        <Header/>
        <div style={{ height: "20px" }}></div>
        <ContentKhampha/>
        <Footer/>
    </div>
  )
}
export default Khampha;