# 🍎 Nhật Minh Phone - Website Bán Điện Thoại Apple

Website thương mại điện tử chuyên bán các sản phẩm Apple (iPhone, iPad, AirPods, phụ kiện) với giao diện hiện đại và đầy đủ tính năng.

## ✨ Tính Năng

### 🛒 Mua Sắm
- **Danh mục sản phẩm đa dạng:**
  - iPhone 15 Series
  - iPhone 14 Series
  - iPhone 13 Series
  - iPad (Pro, Mini)
  - AirPods
  - Phụ kiện Apple & bên thứ 3
- **Flash Sale** với giảm giá lên đến 17%
- **Giỏ hàng** với quản lý số lượng, xóa sản phẩm
- **Checkout** với nhiều phương thức thanh toán

### 👤 Quản Lý Tài Khoản
- Đăng ký/Đăng nhập
- Quản lý thông tin cá nhân
- Lưu địa chỉ giao hàng
- Lịch sử đơn hàng
- Đăng xuất

### 🎨 Giao Diện & UX
- **Dark Mode** - Chế độ tối thoải mái cho mắt
- **Lazy Loading** - Tải hình ảnh thông minh
- **Scroll Animations** - Hiệu ứng cuộn mượt mà
- **Loading Screen** - Màn hình chờ đẹp mắt
- **Breadcrumb Navigation** - Điều hướng rõ ràng
- **Responsive Design** - Tương thích mọi thiết bị

### 💬 Hỗ Trợ
- **Live Chat** - Chatbox tự động trả lời
- Quick replies - Câu trả lời nhanh
- Tích hợp Facebook, Zalo, Instagram

## 🛠️ Công Nghệ Sử Dụng

- **HTML5** - Cấu trúc trang web
- **CSS3** - Styling với animations, gradients
- **JavaScript (Vanilla)** - Logic xử lý
- **Bootstrap 3.4.1** - UI Framework
- **jQuery 3.5.1** - DOM manipulation
- **LocalStorage** - Lưu trữ dữ liệu client-side

## 📁 Cấu Trúc Project

```
Webbandienthoai/
├── index.html              # Trang chính
├── styles.css              # CSS chính
├── scripts.js              # JavaScript chính
├── image/                  # Thư mục hình ảnh
├── chitiet*.html          # Trang chi tiết sản phẩm (39 files)
├── chinhsach*.html        # Trang chính sách (6 files)
├── ACCOUNT_SYSTEM_README.md
└── TEST_LOGIN.md
```

## 🚀 Hướng Dẫn Sử Dụng

### 1. Clone Repository
```bash
git clone https://github.com/your-username/Webbandienthoai.git
cd Webbandienthoai
```

### 2. Chạy Website
Chỉ cần mở file `index.html` trong trình duyệt:
- Nhấp đúp vào `index.html`
- Hoặc kéo thả vào trình duyệt
- Hoặc dùng Live Server trong VS Code

### 3. Test Tính Năng

#### Đăng Ký Tài Khoản
1. Click "Tài Khoản" → "Đăng Ký"
2. Điền thông tin (họ tên, SĐT, email, mật khẩu)
3. Submit → Tự động đăng nhập

#### Mua Hàng
1. Thêm sản phẩm vào giỏ
2. Xem giỏ hàng
3. Click "Tiến hành thanh toán"
4. Chọn phương thức thanh toán
5. Đặt hàng

#### Xem Lịch Sử
1. Click tên người dùng
2. Chọn "Lịch sử đơn hàng"

## 💾 Dữ Liệu

Tất cả dữ liệu được lưu trong **localStorage**:
- `currentUser` - Thông tin user đang đăng nhập
- `users` - Danh sách tất cả users
- `cart` - Giỏ hàng
- `orders` - Đơn hàng
- `theme` - Dark/Light mode

## 🎨 Màu Sắc Chủ Đạo

- **Gold:** `#ffd700`, `#ffed4e` - Màu vàng sang trọng
- **Navy:** `#1a1a2e`, `#16213e`, `#0f3460` - Màu nền tối
- **Red:** `#e74c3c` - Màu nhấn

## 📱 Responsive Breakpoints

- Desktop: > 1200px
- Tablet: 768px - 1199px
- Mobile: < 767px

## 🔧 Tùy Chỉnh

### Thay Đổi Tên Website
Tìm và thay thế `Nhật Minh Phone` trong:
- `index.html`
- `styles.css`
- Các file sản phẩm

### Thêm Sản Phẩm Mới
1. Thêm hình ảnh vào thư mục `image/`
2. Thêm code HTML trong `index.html`:
```html
<div class="product-card scroll-animate">
    <img data-src="image/product.png" class="lazy-load" alt="Product Name">
    <a href="product-detail.html"><h3>Product Name</h3></a>
    <p class="price-old">Giá: 10.000.000 VNĐ</p>
    <p class="price-new">Còn: 9.000.000 VNĐ</p>
    <button class="add-to-cart">Thêm vào giỏ</button>
</div>
```

## 🐛 Debug

### Clear LocalStorage
Mở Console (F12) và chạy:
```javascript
localStorage.clear();
location.reload();
```

### Xem Dữ Liệu
DevTools → Application → Local Storage → file://

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 👨‍💻 Tác Giả

**Nhật Minh Phone**
- 📧 Email: tranminh29012005@gmail.com
- 📱 Hotline: 0902578541

## 🙏 Đóng Góp

Mọi đóng góp đều được chào đón! Hãy tạo Pull Request hoặc mở Issue.

---

**⭐ Nếu thấy project hữu ích, hãy cho 1 Star nhé! ⭐**
