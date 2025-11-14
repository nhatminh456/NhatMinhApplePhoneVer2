// ==================== USER ACCOUNT SYSTEM ====================
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize account system
function initializeAccountSystem() {
    updateAccountMenu();
    updateCartCount();
    
    // Attach event listeners for forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const profileForm = document.getElementById('profile-form');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (profileForm) profileForm.addEventListener('submit', handleProfileUpdate);
    if (checkoutForm) checkoutForm.addEventListener('submit', handlePlaceOrder);
}

// Update account menu based on login status
function updateAccountMenu() {
    const accountMenu = document.querySelector('.account.dropdown');
    if (!accountMenu) return;
    
    if (currentUser) {
        accountMenu.innerHTML = `
            <a href="#" class="dropdown-toggle account-toggle" data-toggle="dropdown">
                <span class="glyphicon glyphicon-user"></span> ${currentUser.name} <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
                <li><a href="#" onclick="showProfile()"><span class="glyphicon glyphicon-user"></span> Thông tin cá nhân</a></li>
                <li><a href="#" onclick="showOrders()"><span class="glyphicon glyphicon-list-alt"></span> Lịch sử đơn hàng</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#" onclick="logout()"><span class="glyphicon glyphicon-log-out"></span> Đăng xuất</a></li>
            </ul>
        `;
    } else {
        accountMenu.innerHTML = `
            <a href="#" class="dropdown-toggle account-toggle" data-toggle="dropdown">
                <span class="glyphicon glyphicon-user"></span> Tài Khoản <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
                <li><a href="#" onclick="showLogin(); return false;"><span class="glyphicon glyphicon-log-in"></span> Đăng nhập</a></li>
                <li><a href="#" onclick="showRegister(); return false;"><span class="glyphicon glyphicon-edit"></span> Đăng ký</a></li>
            </ul>
        `;
    }
}

// Show/Hide modals
function showLogin() {
    closeModal('register-modal');
    openModal('login-modal');
}

function showRegister() {
    closeModal('login-modal');
    openModal('register-modal');
}

function showProfile() {
    if (!currentUser) {
        alert('Vui lòng đăng nhập!');
        return;
    }
    loadUserProfile();
    openModal('profile-modal');
}

function showOrders() {
    if (!currentUser) {
        alert('Vui lòng đăng nhập!');
        return;
    }
    loadOrderHistory();
    openModal('orders-modal');
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showError(errorDiv, 'Email không tồn tại!');
        return;
    }
    
    if (user.password !== btoa(password)) {
        showError(errorDiv, 'Mật khẩu không đúng!');
        return;
    }
    
    currentUser = {
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address || '',
        city: user.city || '',
        district: user.district || ''
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeModal('login-modal');
    document.getElementById('login-form').reset();
    hideError(errorDiv);
    
    updateAccountMenu();
    showSuccessMessage('Đăng nhập thành công!');
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const errorDiv = document.getElementById('register-error');
    
    if (password.length < 6) {
        showError(errorDiv, 'Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    if (password !== confirmPassword) {
        showError(errorDiv, 'Mật khẩu xác nhận không khớp!');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showError(errorDiv, 'Email đã được sử dụng!');
        return;
    }
    
    const newUser = {
        name: name,
        phone: phone,
        email: email,
        password: btoa(password),
        address: '',
        city: '',
        district: '',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = {
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        address: '',
        city: '',
        district: ''
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeModal('register-modal');
    document.getElementById('register-form').reset();
    hideError(errorDiv);
    
    updateAccountMenu();
    showSuccessMessage('Đăng ký thành công! Chào mừng ' + newUser.name);
}

// Handle Profile Update
function handleProfileUpdate(event) {
    event.preventDefault();
    
    if (!currentUser) return;
    
    const name = document.getElementById('profile-name').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const address = document.getElementById('profile-address').value.trim();
    const city = document.getElementById('profile-city').value;
    const district = document.getElementById('profile-district').value.trim();
    const successDiv = document.getElementById('profile-success');
    
    currentUser.name = name;
    currentUser.phone = phone;
    currentUser.address = address;
    currentUser.city = city;
    currentUser.district = district;
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...currentUser };
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    updateAccountMenu();
    showSuccess(successDiv, 'Cập nhật thông tin thành công!');
    
    setTimeout(() => {
        hideSuccess(successDiv);
    }, 3000);
}

// Load User Profile
function loadUserProfile() {
    if (!currentUser) return;
    
    document.getElementById('profile-name').value = currentUser.name || '';
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-email').value = currentUser.email || '';
    document.getElementById('profile-address').value = currentUser.address || '';
    document.getElementById('profile-city').value = currentUser.city || '';
    document.getElementById('profile-district').value = currentUser.district || '';
}

// Load Order History
function loadOrderHistory() {
    if (!currentUser) return;
    
    const userOrders = orders.filter(order => order.userEmail === currentUser.email);
    const ordersList = document.getElementById('orders-list');
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p class="empty-orders">Bạn chưa có đơn hàng nào</p>';
        return;
    }
    
    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    ordersList.innerHTML = userOrders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <div>
                    <div class="order-id">#${order.id}</div>
                    <div class="order-date">${formatDate(order.date)}</div>
                </div>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-products">
                ${order.products.map(product => `
                    <div class="order-product">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="order-product-info">
                            <div class="order-product-name">${product.name}</div>
                            <div class="order-product-quantity">Số lượng: ${product.quantity} × ${formatPrice(product.price)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">Tổng cộng: ${formatPrice(order.total)}</div>
        </div>
    `).join('');
}

// Show Checkout Modal
function showCheckout() {
    if (!currentUser) {
        alert('Vui lòng đăng nhập để thanh toán!');
        openModal('login-modal');
        return;
    }
    
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }
    
    document.getElementById('checkout-name').value = currentUser.name || '';
    document.getElementById('checkout-phone').value = currentUser.phone || '';
    document.getElementById('checkout-address').value = currentUser.address || '';
    document.getElementById('checkout-city').value = currentUser.city || '';
    document.getElementById('checkout-note').value = '';
    
    updateCheckoutSummary();
    
    closeModal('cart-modal');
    openModal('checkout-modal');
}

// Update Checkout Summary
function updateCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 30000;
    const total = subtotal + shipping;
    
    document.getElementById('checkout-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('checkout-shipping').textContent = formatPrice(shipping);
    document.getElementById('checkout-total').textContent = formatPrice(total);
}

// Handle Place Order
function handlePlaceOrder(event) {
    event.preventDefault();
    
    if (!currentUser || cart.length === 0) return;
    
    const name = document.getElementById('checkout-name').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const address = document.getElementById('checkout-address').value.trim();
    const city = document.getElementById('checkout-city').value;
    const note = document.getElementById('checkout-note').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 30000;
    const total = subtotal + shipping;
    
    const order = {
        id: 'DH' + Date.now(),
        userEmail: currentUser.email,
        date: new Date().toISOString(),
        status: 'pending',
        products: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        })),
        shipping: {
            name: name,
            phone: phone,
            address: address,
            city: city,
            note: note
        },
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        shippingFee: shipping,
        total: total
    };
    
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    closeModal('checkout-modal');
    document.getElementById('checkout-form').reset();
    
    alert('Đặt hàng thành công! Mã đơn hàng: ' + order.id);
    showSuccessMessage('Đơn hàng đã được tạo thành công!');
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAccountMenu();
    showSuccessMessage('Đăng xuất thành công!');
}

// Helper Functions
function showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
}

function hideError(element) {
    if (!element) return;
    element.classList.remove('show');
}

function showSuccess(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
}

function hideSuccess(element) {
    if (!element) return;
    element.classList.remove('show');
}

function showSuccessMessage(message) {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #229954);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(39, 174, 96, 0.4);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.5s ease;
    `;
    successMsg.textContent = message;
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => successMsg.remove(), 500);
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// Update cart count (global function)
function updateCartCount() {
    const cartButton = document.querySelector('.cart');
    if (!cartButton) return;
    
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartButton.textContent = `Giỏ Hàng (${cartCount})`;
    cartButton.dataset.count = cartCount;
}

// ==================== END USER ACCOUNT SYSTEM ====================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize User Account System
    initializeAccountSystem();
    
    // Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 800);
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            
            // Animation effect
            darkModeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                darkModeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }

    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));

    // Scroll Animations
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            (window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100)
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('animated');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 80)) {
                displayScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initial check for elements in view
    handleScrollAnimation();

    // Chức năng giỏ hàng
    const cartButton = document.querySelector('.cart');
    
    if (cartButton) {
        // Cập nhật số lượng sản phẩm trong giỏ hàng
        const updateCartCount = () => {
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartButton.textContent = `Giỏ Hàng (${cartCount})`;
            cartButton.dataset.count = cartCount;
        };

        // Hiển thị giỏ hàng
        const displayCart = () => {
            const cartItemsContainer = document.getElementById('cart-items');
            const cartTotalPrice = document.getElementById('cart-total-price');
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Giỏ hàng trống. Hãy thêm sản phẩm!</p>';
                cartTotalPrice.textContent = '0 VNĐ';
            } else {
                let totalPrice = 0;
                let cartHTML = '<div class="cart-items-list">';
                
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    totalPrice += itemTotal;
                    
                    cartHTML += `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p class="cart-item-price">${item.price.toLocaleString('vi-VN')} VNĐ</p>
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" data-index="${index}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn increase" data-index="${index}">+</button>
                            </div>
                            <div class="cart-item-total">
                                <p>${itemTotal.toLocaleString('vi-VN')} VNĐ</p>
                                <button class="remove-item" data-index="${index}">
                                    <span>×</span>
                                </button>
                            </div>
                        </div>
                    `;
                });
                
                cartHTML += `
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-success btn-block" onclick="showCheckout()" style="margin-top: 15px; padding: 12px; font-size: 16px; font-weight: 600;">
                            <span class="glyphicon glyphicon-shopping-cart"></span> Tiến hành thanh toán
                        </button>
                    </div>
                `;
                
                cartItemsContainer.innerHTML = cartHTML;
                cartTotalPrice.textContent = `${totalPrice.toLocaleString('vi-VN')} VNĐ`;
                
                // Thêm event listeners cho các nút tăng/giảm/xóa
                attachCartItemListeners();
            }
        };

        // Gắn event listeners cho các nút trong giỏ hàng
        const attachCartItemListeners = () => {
            // Nút tăng số lượng
            document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    cart[index].quantity += 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    displayCart();
                });
            });

            // Nút giảm số lượng
            document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    if (cart[index].quantity > 1) {
                        cart[index].quantity -= 1;
                    } else {
                        cart.splice(index, 1);
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    displayCart();
                });
            });

            // Nút xóa sản phẩm
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.currentTarget.dataset.index);
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    displayCart();
                });
            });
        };

        // Xử lý sự kiện khi thêm sản phẩm vào giỏ hàng
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Lấy thông tin sản phẩm từ card
                const productCard = button.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPriceText = productCard.querySelector('.price-new').textContent;
                const productPrice = parseInt(productPriceText.replace(/[^\d]/g, ''));
                const productImage = productCard.querySelector('img').src;
                
                // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
                const existingItemIndex = cart.findIndex(item => item.name === productName);
                
                if (existingItemIndex > -1) {
                    // Nếu đã có, tăng số lượng
                    cart[existingItemIndex].quantity += 1;
                } else {
                    // Nếu chưa có, thêm mới
                    cart.push({
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                
                // Hiệu ứng animation khi thêm vào giỏ
                cartButton.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartButton.style.transform = 'scale(1)';
                }, 200);
                
                // Hiển thị thông báo
                showNotification('Sản phẩm đã được thêm vào giỏ hàng!');
            });
        });

        // Mở giỏ hàng khi click vào nút giỏ hàng
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            displayCart();
            openModal('cart-modal');
        });

        // Nút tiếp tục mua hàng
        const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                closeModals();
            });
        }

        // Nút thanh toán
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cartItems.length === 0) {
                    alert('Giỏ hàng trống!');
                } else {
                    alert('Chức năng thanh toán đang được phát triển!');
                }
            });
        }
    }

    // Hàm hiển thị thông báo
    const showNotification = (message) => {
        // Tạo element thông báo
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Hiển thị
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Ẩn và xóa sau 2 giây
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    };

    // Chức năng trình chiếu (carousel)
    const slides = document.querySelector('.slides');
    
    if (slides) {
        const totalSlides = document.querySelectorAll('.slide').length;
        let currentIndex = 0;
        let autoSlideInterval;

        // Hiển thị slide theo chỉ số
        const showSlide = (index) => {
            if (index >= totalSlides) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = totalSlides - 1;
            } else {
                currentIndex = index;
            }
            slides.style.transform = `translateX(${-currentIndex * 100}%)`;
        };

        // Chuyển đến slide tiếp theo
        const nextSlide = () => showSlide(currentIndex + 1);
        // Chuyển đến slide trước đó
        const prevSlide = () => showSlide(currentIndex - 1);

        // Tự động chuyển slide mỗi 5 giây
        autoSlideInterval = setInterval(nextSlide, 5000);

        // Đặt lại tính năng tự động chuyển slide
        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 5000);
        };

        // Xử lý sự kiện chuyển đến slide tiếp theo khi nhấp vào nút
        const nextButton = document.querySelector('.next');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        // Xử lý sự kiện chuyển đến slide trước đó khi nhấp vào nút
        const prevButton = document.querySelector('.prev');
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        showSlide(currentIndex);
    }

    // Chức năng nút "quay về đầu trang"
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
        });

        // Cuộn trang về đầu khi nhấp vào nút
        backToTopButton.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Chức năng modals (cửa sổ bật lên)
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    };

    const closeModals = () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    };

    // Mở modal đăng nhập khi nhấp vào nút
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (event) => {
            event.preventDefault();
            openModal('login-modal');
        });
    }

    // Mở modal đăng ký khi nhấp vào liên kết
    const registerLink = document.getElementById('register-link');
    if (registerLink) {
        registerLink.addEventListener('click', (event) => {
            event.preventDefault();
            closeModals();
            openModal('register-modal');
        });
    }

    // Đóng tất cả modals khi nhấp vào nút đóng
    document.querySelectorAll('.modal .close').forEach(closeButton => {
        closeButton.addEventListener('click', (event) => {
            event.preventDefault();
            closeModals();
        });
    });

    // Đóng modal khi nhấp ra ngoài modal
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModals();
        }
    });

    // Chức năng Chat Box
    const chatButton = document.getElementById('chat-button');
    const chatBox = document.getElementById('chat-box');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatBadge = document.getElementById('chat-badge');
    const quickReplies = document.getElementById('quick-replies');

    let isChatOpen = false;

    // Toggle chat box
    if (chatButton) {
        chatButton.addEventListener('click', () => {
            isChatOpen = !isChatOpen;
            if (isChatOpen) {
                chatBox.classList.add('active');
                chatButton.style.display = 'none';
                chatBadge.style.display = 'none';
                chatInput.focus();
            }
        });
    }

    // Close chat box
    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatBox.classList.remove('active');
            chatButton.style.display = 'flex';
            isChatOpen = false;
        });
    }

    // Gửi tin nhắn
    const sendMessage = () => {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Thêm tin nhắn người dùng
        addUserMessage(message);
        chatInput.value = '';

        // Ẩn quick replies sau khi gửi tin nhắn đầu tiên
        if (quickReplies) {
            quickReplies.style.display = 'none';
        }

        // Simulate bot response
        setTimeout(() => {
            addBotResponse(message);
        }, 1000);
    };

    // Add user message
    const addUserMessage = (text) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    };

    // Add bot message
    const addBotMessage = (text) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="image/logofb.jpg" alt="Bot">
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    };

    // Bot response logic
    const addBotResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';

        if (lowerMessage.includes('iphone 15') || lowerMessage.includes('15 pro')) {
            response = 'iPhone 15 Pro Max hiện đang có giá 29.490.000 VNĐ (giảm 16%). Bạn có muốn xem chi tiết sản phẩm không? 📱';
        } else if (lowerMessage.includes('bảo hành')) {
            response = 'Tất cả sản phẩm tại Nhật Minh Phone đều được bảo hành chính hãng 12 tháng. Bạn có thể xem chi tiết <a href="chinhsachbaohanh.html" style="color: #25D366;">tại đây</a> 🛡️';
        } else if (lowerMessage.includes('trả góp')) {
            response = 'Chúng tôi hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng. Xem thêm <a href="chinhsachtragop.html" style="color: #25D366;">chính sách trả góp</a> 💳';
        } else if (lowerMessage.includes('giao hàng')) {
            response = 'Giao hàng toàn quốc trong 1-3 ngày. Miễn phí ship cho đơn trên 5 triệu! 🚚';
        } else if (lowerMessage.includes('hotline') || lowerMessage.includes('liên hệ')) {
            response = 'Bạn có thể liên hệ hotline: 0813.000.686 hoặc chat trực tiếp với chúng tôi tại đây! ☎️';
        } else if (lowerMessage.includes('giá') || lowerMessage.includes('bao nhiêu')) {
            response = 'Bạn muốn hỏi giá sản phẩm nào? iPhone 15, 14, 13 hay iPad, AirPods? 💰';
        } else {
            response = 'Cảm ơn bạn đã nhắn tin! Nhân viên tư vấn sẽ phản hồi trong giây lát. Hoặc gọi hotline 0813.000.686 để được hỗ trợ ngay! 😊';
        }

        addBotMessage(response);
    };

    // Get current time
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Send button click
    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }

    // Enter key to send
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Quick reply buttons
    document.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const message = e.target.dataset.message;
            chatInput.value = message;
            sendMessage();
        });
    });
});
