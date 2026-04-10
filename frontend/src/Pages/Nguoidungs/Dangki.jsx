import React, { useState } from "react";
import HeaderLogin from "../../UI/Nguoidungs/HeaderLogin";
import ContentDangki from "../../UI/Nguoidungs/ContentDangki";


const Dangki = () => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <HeaderLogin onOpenRegister={() => setOpen(true)} />
      {open && <ContentDangki />}
    </div>
  );
};

export default Dangki;