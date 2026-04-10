import{Toaster, toast} from 'sonner';
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Trangchu from './Pages/Nguoidungs/Trangchu';
import Notfound from './Pages/Notfound';
import Dangki from './Pages/Nguoidungs/Dangki';
import Dangnhap from './Pages/Nguoidungs/Dangnhap';
import Khampha from './Pages/Nguoidungs/Khampha';
import Huongdanvien from './Pages/Nguoidungs/Huongdanvien';
import Taikhoan from './Pages/Nguoidungs/Taikhoan';
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


function App() {

  return <>
     <ToastContainer position="top-right" autoClose={2000} />
    <BrowserRouter>

      <Routes>
        <Route path='*' element={<Notfound />} />

        <Route path='/dangki' element={<Dangki />} />

        <Route path='/dangnhap' element={<Dangnhap />} />

        <Route path='/' element={<Trangchu />} />

        <Route path='/user/:slug' element={<Trangchunguoidung/>} />

        <Route path='/khampha' element={<Khampha />} />

        <Route path='/Huongdanvien' element={<Huongdanvien />} />

        <Route path='/taikhoan' element={<Taikhoan />} />

        <Route path='/dangkihuongdanvien' element={<Dangkihuongdanvien />} />

        <Route path='/thongtintaikhoan' element={<Thongtintaikhoan />} />

        <Route path='/thongtintaikhoan' element={<Thongtintaikhoan />} />

        <Route path='/thongbao' element={<Thongbao />} />

        <Route path='/lichsuchuyendi' element={<Lichsuchuyendi />} />

        <Route path='/hoadon' element={<Hoadon />} />

        <Route path='/baocao' element={<Baocao/>} />

        <Route path='/nhom' element={<Nhom />} />

        <Route path='/danhgia' element={<Danhgia />} />



        <Route path='/chitietdiadiem/:slug' element={<Chitietdiadiem />} />

      </Routes>

    </BrowserRouter>
  </>
}

export default App
