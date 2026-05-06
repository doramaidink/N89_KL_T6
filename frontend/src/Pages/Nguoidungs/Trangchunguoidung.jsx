import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ContentTrangchu from '../../UI/Nguoidungs/ContentTrangchu';
import Footer from '../../UI/Nguoidungs/Footer';
import HeaderTaikhoan from '../../UI/Nguoidungs/Headers/HeaderTaikhoan';
import ChatBot from '../../ChatBot'

const Trangchunguoidung = () => {
  const { hoten } = useParams();

  const [user, setUser] = useState(null);

  const [data, setData] = useState({
    user: null,
    diaDiemnoibat: [],
  });

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("authUser")) ||
      JSON.parse(localStorage.getItem("currentUser"));

    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/homeuser/${encodeURIComponent(hoten)}`
        );

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
      <HeaderTaikhoan user={user} />
      <ContentTrangchu data={data} user={user || data.user} />
      <Footer />
      <ChatBot/>
    </div>
  );
};

export default Trangchunguoidung;