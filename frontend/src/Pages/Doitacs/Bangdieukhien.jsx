import React from 'react'
import HeaderDoitac from '../../UI/Doitacs/HeaderDoitac'
import SidebarDoitac from '../../UI/Doitacs/SidebarDoitac'
import ContentBangdieukhien from '../../UI/Doitacs/ContentBangdieukhien'

const Bangdieukhien = () => { 
  return (    
    <div className="doitac-layout-container">
      <SidebarDoitac />     
      <HeaderDoitac />  
      <ContentBangdieukhien />             
    </div>
  );
}
export default Bangdieukhien;