import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentTrangchu from '../../UI/Nguoidungs/ContentTrangchu';
import Footer from '../../UI/Nguoidungs/Footer';
import HeaderTaikhoan from '../../UI/Nguoidungs/Headers/HeaderTaikhoan';

const Trangchunguoidung = () => {
    const { hoten } = useParams();
  const [data, setData] = useState({
    user: null,
    diaDiemnoibat: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/homeuser/${encodeURIComponent(hoten)}`);
        const result = await res.json();

        if (res.ok) {
          setData(result);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.log('Lỗi fetch trang chủ người dùng:', error);
      }
    };

    if (hoten) {
      fetchData();
    }
  }, [hoten]);
    return (
        <div>
            <HeaderTaikhoan  user={data.user}/>
            <ContentTrangchu data={data} user={data.user} />
            <Footer />
        </div>
    )
}
export default Trangchunguoidung;