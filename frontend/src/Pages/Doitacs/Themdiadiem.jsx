import React from 'react'
import HeaderDoitac from '../../UI/Doitacs/HeaderDoitac'
import SidebarDoitac from '../../UI/Doitacs/SidebarDoitac'
import ContentThemdiadiem from '../../UI/Doitacs/ContentThemdiadiem'

const Themdiadiem = () => {
    return (
      <div className="doitac-layout-container">
        <SidebarDoitac />
        <HeaderDoitac />
        <ContentThemdiadiem />
      </div>
    );
  }
  export default Themdiadiem;