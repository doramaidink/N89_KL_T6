import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Trangchu from './Pages/Nguoidungs/Trangchu';
import Notfound from './Pages/Notfound';
import Dangki from './Pages/Nguoidungs/Dangki';
import Dangnhap from './Pages/Nguoidungs/Dangnhap';
import Khampha from './Pages/Nguoidungs/Khampha';
import Huongdanvien from './Pages/Nguoidungs/Huongdanvien';
import Dangkihuongdanvien from './Pages/Nguoidungs/Dangkihuongdanvien';
import Thongtintaikhoan from './Pages/Nguoidungs/Thongtintaikhoan';
import Thongbao from './Pages/Nguoidungs/Thongbao';
import Lichsuchuyendi from './Pages/Nguoidungs/Lichsuchuyendi';
import Hoadon from './Pages/Nguoidungs/Hoadon';
import Baocao from './Pages/Nguoidungs/Baocao';
import Nhom from './Pages/Nguoidungs/Nhom';
import Danhgia from './Pages/Nguoidungs/Danhgia';
import Trangchunguoidung from './Pages/Nguoidungs/Trangchunguoidung';
import Chitietdiadiem from './Pages/Nguoidungs/Chitietdiadiem';
import Quenmatkhau from './Pages/Nguoidungs/Quenmatkhau';
import Datlaimatkhau from './Pages/Nguoidungs/Datlaimatkhau';
import Khamphauser from './Pages/Nguoidungs/Khamphauser';
import Huongdanvienuser from './Pages/Nguoidungs/Huongdanvienuser';
import Chitietdiadiemuser from './Pages/Nguoidungs/Chitietdiadiemuser'
import Chonloainhom from './Pages/Nguoidungs/Chonloainhom';
import Chonnhom from './Pages/Nguoidungs/Chonnhom';
import Thanhtoan from './Pages/Nguoidungs/Thanhtoan';
import Danhgiavanglai from './Pages/Nguoidungs/Danhgiavanglai';


import Nhomchat from './Pages/Nguoidungs/Nhomchat';

import ThongKe from './Pages/Quantriviens/Thongke';
import ThongKeNguoiDung from './Pages/Quantriviens/ThongKeNguoiDung';
import DuyetDiaDiem from './Pages/Quantriviens/DuyetDiaDiem';
import QuanLyBaoCao from './Pages/Quantriviens/QuanLyBaoCao';
import ThongBaoHeThong from './Pages/Quantriviens/ThongBaoHeThong';
import QuanLyDiaDiem from './Pages/Quantriviens/QuanLyDiaDiem';
import DonDangKy from './Pages/Quantriviens/DonDangKy';
import CheckinAdmin from './Pages/Quantriviens/CheckinAdmin';


import Bangdieukhien from './Pages/Doitacs/Bangdieukhien';
import Hoso from './Pages/Doitacs/Hoso';
import Themdiadiem from './Pages/Doitacs/Themdiadiem';
import Loimoinhom from './Pages/Doitacs/Loimoinhom';
import Groupchat from './Pages/Doitacs/Groupchat';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage khi trang web load
    const savedUser = JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("authUser"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  return <>
    <ToastContainer position="top-right" autoClose={2000} />
    <BrowserRouter>

      <Routes>

        {/* Người dùng */}
        <Route path='*' element={<Notfound />} />

        <Route path='/dangki' element={<Dangki />} />


        <Route path='/dangnhap' element={<Dangnhap />} />

        <Route path='/' element={<Trangchu />} />


        <Route path="/quen-mat-khau" element={<Quenmatkhau />} />
        <Route path="/dat-lai-mat-khau" element={<Datlaimatkhau />} />

        <Route path='/khampha' element={<Khampha />} />

        <Route path='/huongdanvien' element={<Huongdanvien />} />

        <Route path='/:hoten' element={<Trangchunguoidung />} />

        <Route path='/:hoten/khamphauser' element={<Khamphauser />} />

        <Route path='/:hoten/huongdanvienuser' element={<Huongdanvienuser />} />

        <Route path='/:hoten/dangkihuongdanvien' element={<Dangkihuongdanvien />} />

        <Route path='/thongtintaikhoan' element={<Thongtintaikhoan />} />

        <Route path='/thongbao' element={<Thongbao />} />

        <Route path='/lichsuchuyendi' element={<Lichsuchuyendi user={user} />} />

        <Route path='/chonloainhom' element={<Chonloainhom />} />

        <Route path='/chonnhom' element={<Chonnhom />} />

        <Route path='/thanhtoan' element={<Thanhtoan />} />

        <Route path='/hoadon' element={<Hoadon />} />

        <Route path='/:hoten/baocao' element={<Baocao />} />

        <Route path='/nhom' element={<Nhom />} />

        <Route
          path='/chitietdiadiem/:slug/danhgia'
          element={<Danhgia user={user} canReview={true} />}
        />
        <Route path='/:hoten/chitietdiadiemuser/:slug/danhgia' element={<Danhgia />} />

        <Route path='/nhomchat/:groupId' element={<Nhomchat user={user} />} />




        <Route path='/chitietdiadiem/:slug' element={<Chitietdiadiem user={user} />} />
        <Route path='/:hoten/chitietdiadiemuser/:slug' element={<Chitietdiadiemuser />} />
















































        {/* Đối tác */}

        <Route path='/doitac/:slug' element={<Bangdieukhien />} />
        <Route path='/doitac/:slug/hoso' element={<Hoso />} />
        <Route path='/doitac/:slug/themdiadiem' element={<Themdiadiem />} />
        <Route path='/doitac/:slug/loimoinhom' element={<Loimoinhom />} />
        <Route path='/doitac/:slug/groupchat' element={<Groupchat />} />



























































        {/* Quản trị viên */}

        <Route path='/admin/:slug' element={<ThongKe />} />
        <Route path='/admin/:slug/thongkenguoidung' element={<ThongKeNguoiDung />} />
        <Route path='/admin/:slug/duyetdiadiem' element={<DuyetDiaDiem />} />
        <Route path='/admin/:slug/quanlybaocao' element={<QuanLyBaoCao />} />
        <Route path='/admin/:slug/quanlydiadiem' element={<QuanLyDiaDiem />} />
        <Route path='/admin/:slug/thongbaohethong' element={<ThongBaoHeThong />} />
        <Route path='/admin/:slug/dondangky' element={<DonDangKy />} />
        <Route path='/admin/:slug/checkin' element={<CheckinAdmin />} />

      </Routes>


    </BrowserRouter>
  </>
}

export default App
