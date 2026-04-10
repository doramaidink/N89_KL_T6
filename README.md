## 🚀CÁC YÊU CẦU CHUNG

## 📌 Lưu ý khi upload code
  👤 Cấu hình username là tên của mình 
  📝 Khi commit nhớ ghi rõ cái nào là upload cái nào là chỉnh sửa và ghi kèm tên mình
   Yêu cầu chung:
    * Cấu hình điền rõ tên mình;
    * ghi rõ tên mình khi cập nhập - upload
  - Cấu hình và cài đặt git: https://www.udemy.com/course/nhap-mon-git-github-cho-nguoi-moi-bat-dau-2023/learn/lecture/39703446#overview


## 📥Tải code về :
   - git clone https://github.com/doramaidink/N89_KL_T6.git
  - trước khi sửa gì rồi commit lên lại thì "git pull" để kiểm tra trước khi commit lại
  - Các bước upload lên git:
    * git init
    * git add . (. là tất cả các code còn khi chỉ upload 1 file nào thì chỉ cần ghi tên file đó ra VD: git add "trangchu.jsx")
    * git commit -m ""( trong "" là nội dung điền theo format đã định sẵn)
    * git push -u origin master ( nếu sài main thì đổi master sang main)
 
## ⚠️Chạy dự án sau khi tải về:
   B1: vào từng thư mục frontend và backend sau đó chạy npm install
   B2: Tạo 1 file .env ở backend bên ngoài thư mục src
   B3: Vào file .env vừa tạo và dán code sau:
   NODE_ENV=development
   MONGODB_CONNECTIONSTRING =  mongodb+srv://vqthanh1999_db_user:6OsbfK3lpmqcgMk0@cluster0.twyp2qx.mongodb.net/?appName=Cluster0;
   B4: chạy 2 thư mục đồng thời cùng 1 lúc và gõ npm run dev

   
## 🚀format code:
   - Frontend:
   * Page: trang lớn chỉ gọi lại các UI không code html bên trong
   * UI: các UI bên trong Page nới code html
   * HTML: đặt tên các class cho dễ hiểu, không bị trùng - có thể thêm tên trang ở mỗi class (VD: trang trangchu các class sẽ có tên như là header-trangchu)
   * CSS: CSS cho phần trang nào thì gạch ngang tên trang và kết thúc cũng z VD: ---<tên trang>--- nội dung css cho trang ---<tên trang>---
   * ở các ảnh trong img phải tạo thư mục đàng hoàng rồi bỏ ảnh đó vào không để từa lưa VD: địa điểm sơn trà sẽ tạo 1 thư mục sontra và để các ảnh về sơn trà bên trong.
  ## ⚠️Code xong giao diện nào thì mở console lên xem có lỗi j không 
  ## ❌ Không được để bất cứ lỗi j cônsole không được dòng đỏ nào

  
