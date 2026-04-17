import React from 'react'
import HeaderDoitac from '../../UI/Doitacs/HeaderDoitac'
import SidebarDoitac from '../../UI/Doitacs/SidebarDoitac'
import ContentHoso from '../../UI/Doitacs/ContentHoso'

const Hoso = () => {
    return (
      <div className="doitac-layout-container">
        <SidebarDoitac />
        <HeaderDoitac />
        <ContentHoso />
      </div>
    );
  }
  export default Hoso;