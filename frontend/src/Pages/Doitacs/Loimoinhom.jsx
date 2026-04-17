import React from 'react'
import HeaderDoitac from '../../UI/Doitacs/HeaderDoitac'
import SidebarDoitac from '../../UI/Doitacs/SidebarDoitac'
import ContentLoimoinhom from '../../UI/Doitacs/ContentLoimoinhom'

const Loimoinhom = () => {
    return (
      <div className="doitac-layout-container">
        <SidebarDoitac />
        <HeaderDoitac />
        <ContentLoimoinhom />
      </div>
    );
  }
  export default Loimoinhom;