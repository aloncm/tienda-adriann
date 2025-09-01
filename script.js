// Global state
let products = [
    {
        id: '1',
        name: 'Chocolates Gourmet',
        description: 'Deliciosos chocolates artesanales con relleno de trufa',
        price: 25.99,
        image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'chocolates',
        stock: 50,
        featured: true
    },
    {
        id: '2',
        name: 'Gomitas Frutales',
        description: 'Gomitas suaves con sabores naturales de frutas',
        price: 12.50,
        image: 'https://images.pexels.com/photos/1302242/pexels-photo-1302242.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'gomitas',
        stock: 75,
        featured: true
    },
    {
        id: '3',
        name: 'Paletas Artesanales',
        description: 'Paletas hechas a mano con ingredientes naturales',
        price: 8.99,
        image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'paletas',
        stock: 30,
        featured: false
    },
    {
        id: '4',
        name: 'Caramelos Duros',
        description: 'Caramelos tradicionales con sabores clásicos',
        price: 6.75,
        image: 'https://images.pexels.com/photos/1263617/pexels-photo-1263617.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'caramelos',
        stock: 100,
        featured: false
    },
    {
        id: '5',
        name: 'Bombones Premium',
        description: 'Bombones de chocolate belga con rellenos exquisitos',
        price: 45.00,
        image: 'https://images.pexels.com/photos/1090387/pexels-photo-1090387.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'chocolates',
        stock: 25,
        featured: true
    },
    {
        id: '6',
        name: 'Dulces Mexicanos',
        description: 'Variedad de dulces tradicionales mexicanos',
        price: 18.50,
        image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'tradicionales',
        stock: 40,
        featured: false
    }
];

let cart = [];
let orders = [];
let currentView = 'catalog';
let currentCategory = 'all';
let searchTerm = '';
let isAdminAuthenticated = false;
let editingProductId = null;

// Local Storage functions
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

// Initialize app
function initApp() {
    // Load data from localStorage
    products = loadFromLocalStorage('candy-store-products', products);
    cart = loadFromLocalStorage('candy-store-cart', []);
    orders = loadFromLocalStorage('candy-store-orders', []);

    // Setup event listeners
    setupEventListeners();
    
    // Initial render
    renderProducts();
    updateCartBadge();
    updateCartView();
}

// Event listeners setup
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            switchView(view);
        });
    });

    // Category filter
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategory = e.target.dataset.category;
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProducts();
        });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderProducts();
    });

    // Admin login
    document.getElementById('loginForm').addEventListener('submit', handleAdminLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleAdminLogout);

    // Admin tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchAdminTab(tab);
        });
    });

    // Product form
    document.getElementById('addProductBtn').addEventListener('click', () => openProductForm());
    document.getElementById('closeModal').addEventListener('click', closeProductForm);
    document.getElementById('cancelForm').addEventListener('click', closeProductForm);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);

    // Suggested images
    document.querySelectorAll('.suggested-img').forEach(img => {
        img.addEventListener('click', (e) => {
            document.getElementById('productImage').value = e.target.src;
        });
    });

    // Checkout
    document.getElementById('closeCheckout').addEventListener('click', closeCheckoutModal);
    document.getElementById('closeSuccess').addEventListener('click', closeSuccessModal);

    // Modal close on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// View switching
function switchView(view) {
    currentView = view;
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    // Update views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`${view}View`).classList.add('active');
    
    // Show/hide search based on view
    const searchContainer = document.getElementById('searchContainer');
    if (view === 'catalog') {
        searchContainer.style.display = 'block';
    } else {
        searchContainer.style.display = 'none';
    }

    // Render content based on view
    if (view === 'cart') {
        updateCartView();
    } else if (view === 'admin') {
        renderAdminView();
    }
}

// Product rendering
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        return matchesSearch && matchesCategory;
    });

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-cart" style="grid-column: 1 / -1;">
                <div class="empty-cart-icon">🍭</div>
                <h3>No encontramos dulces</h3>
                <p>${searchTerm ? `No hay productos que coincidan con "${searchTerm}"` : 'No hay productos en esta categoría'}</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.featured ? '<span class="product-badge">Destacado</span>' : ''}
                ${product.stock < 10 ? '<span class="stock-badge">¡Últimos!</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-details">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <span class="product-stock">Stock: ${product.stock}</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')" ${product.stock === 0 ? 'disabled' : ''}>
                    🛒 ${product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </button>
            </div>
        </div>
    `).join('');
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
    }

    saveToLocalStorage('candy-store-cart', cart);
    updateCartBadge();
    
    // Show feedback
    showNotification(`${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveToLocalStorage('candy-store-cart', cart);
    updateCartBadge();
    updateCartView();
}

function updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = quantity;
        saveToLocalStorage('candy-store-cart', cart);
        updateCartBadge();
        updateCartView();
    }
}

function clearCart() {
    if (confirm('¿Estás seguro de que quieres limpiar el carrito?')) {
        cart = [];
        saveToLocalStorage('candy-store-cart', cart);
        updateCartBadge();
        updateCartView();
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

function getCartTotal() {
    return cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

function updateCartView() {
    const cartContent = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>¡Agrega algunos dulces deliciosos para empezar!</p>
            </div>
        `;
        return;
    }

    const cartItems = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';

        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-description">${product.description}</div>
                    <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity('${product.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity('${product.id}', ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">
                    $${(product.price * item.quantity).toFixed(2)}
                    <button class="remove-btn" onclick="removeFromCart('${product.id}')">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    cartContent.innerHTML = `
        ${cartItems}
        <div class="cart-total">
            <div class="total-row">
                <span class="total-label">Total:</span>
                <span class="total-amount">$${getCartTotal().toFixed(2)}</span>
            </div>
            <div class="cart-actions">
                <button class="clear-cart-btn" onclick="clearCart()">Limpiar Carrito</button>
                <button class="checkout-btn" onclick="openCheckoutModal()">💳 Proceder al Pago</button>
            </div>
        </div>
    `;
}

// Admin functions
function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (username === 'admin' && password === 'dulces123') {
        isAdminAuthenticated = true;
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        renderAdminProducts();
        renderOrders();
    } else {
        alert('Credenciales incorrectas');
    }
}

function handleAdminLogout() {
    isAdminAuthenticated = false;
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
}

function renderAdminView() {
    if (isAdminAuthenticated) {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        renderAdminProducts();
        renderOrders();
    } else {
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
    }
}

function switchAdminTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tab}Tab`).classList.add('active');
}

function renderAdminProducts() {
    const list = document.getElementById('adminProductsList');
    
    list.innerHTML = products.map(product => `
        <div class="admin-product">
            <img src="${product.image}" alt="${product.name}" class="admin-product-image">
            <div class="admin-product-info">
                <div class="admin-product-name">
                    ${product.name}
                    ${product.featured ? '<span style="color: #eab308;">⭐</span>' : ''}
                </div>
                <div class="admin-product-details">
                    <span>$${product.price.toFixed(2)}</span>
                    <span>Stock: ${product.stock}</span>
                    <span>${product.category}</span>
                </div>
            </div>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="editProduct('${product.id}')">✏️</button>
                <button class="delete-btn" onclick="deleteProduct('${product.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function renderOrders() {
    const list = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        list.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">📊</div>
                <h3>No hay pedidos aún</h3>
                <p>Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
            </div>
        `;
        return;
    }

    list.innerHTML = orders.slice().reverse().map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Pedido #${order.id.slice(-8)}</div>
                    <div class="order-date">${new Date(order.createdAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</div>
                </div>
                <div style="text-align: right;">
                    <div class="order-total">$${order.total.toFixed(2)}</div>
                    <span class="order-status status-completed">Completado</span>
                </div>
            </div>
            
            <div class="order-details">
                <div class="order-customer">
                    <h5>Cliente:</h5>
                    <p>${order.customerInfo.name}</p>
                    <p>${order.customerInfo.email}</p>
                    <p>${order.customerInfo.phone}</p>
                </div>
                <div class="order-address">
                    <h5>Dirección:</h5>
                    <p>${order.customerInfo.address}</p>
                </div>
            </div>
            
            <div class="order-items">
                <h5>Productos:</h5>
                <div class="order-item-list">
                    ${order.items.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        return `
                            <div class="order-item-row">
                                <span>${product ? product.name : 'Producto eliminado'} x${item.quantity}</span>
                                <span>$${(product ? product.price * item.quantity : 0).toFixed(2)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Product management
function openProductForm(productId = null) {
    editingProductId = productId;
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');

    if (productId) {
        const product = products.find(p => p.id === productId);
        title.textContent = 'Editar Producto';
        
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productFeatured').checked = product.featured;
    } else {
        title.textContent = 'Nuevo Producto';
        form.reset();
    }

    modal.classList.add('active');
}

function closeProductForm() {
    document.getElementById('productModal').classList.remove('active');
    editingProductId = null;
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image: document.getElementById('productImage').value,
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        featured: document.getElementById('productFeatured').checked
    };

    if (editingProductId) {
        // Update existing product
        const index = products.findIndex(p => p.id === editingProductId);
        products[index] = { ...products[index], ...productData };
    } else {
        // Create new product
        const newProduct = {
            id: `product-${Date.now()}`,
            ...productData
        };
        products.push(newProduct);
    }

    saveToLocalStorage('candy-store-products', products);
    closeProductForm();
    renderAdminProducts();
    renderProducts();
    
    showNotification(editingProductId ? 'Producto actualizado' : 'Producto creado');
}

function editProduct(productId) {
    openProductForm(productId);
}

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        products = products.filter(p => p.id !== productId);
        
        // Remove from cart if exists
        cart = cart.filter(item => item.productId !== productId);
        
        saveToLocalStorage('candy-store-products', products);
        saveToLocalStorage('candy-store-cart', cart);
        
        renderAdminProducts();
        renderProducts();
        updateCartBadge();
        updateCartView();
        
        showNotification('Producto eliminado');
    }
}

// Checkout functions
function openCheckoutModal() {
    if (cart.length === 0) return;

    const modal = document.getElementById('checkoutModal');
    const content = document.getElementById('checkoutContent');

    const orderSummary = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return `
            <div class="order-item">
                <span>${product.name} x${item.quantity}</span>
                <span>$${(product.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    }).join('');

    content.innerHTML = `
        <form id="checkoutForm" class="checkout-form">
            <div class="order-summary">
                <h4>Resumen del Pedido</h4>
                ${orderSummary}
                <div class="order-item">
                    <span><strong>Total:</strong></span>
                    <span><strong>$${getCartTotal().toFixed(2)}</strong></span>
                </div>
            </div>

            <div class="customer-info">
                <h4>👤 Información de Contacto</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" id="customerName" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="customerEmail" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="tel" id="customerPhone" required>
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="customerAddress" required>
                    </div>
                </div>
            </div>

            <div class="payment-methods">
                <h4>💳 Método de Pago</h4>
                <div class="payment-options">
                    <label class="payment-option selected">
                        <input type="radio" name="payment" value="card" checked>
                        <span>💳 Tarjeta de Crédito/Débito</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="payment" value="cash">
                        <span>💵 Pago en Efectivo</span>
                    </label>
                </div>
            </div>

            <div class="checkout-actions">
                <button type="button" class="cancel-btn" onclick="closeCheckoutModal()">Cancelar</button>
                <button type="submit" class="submit-btn" id="processPaymentBtn">
                    Confirmar Pedido ($${getCartTotal().toFixed(2)})
                </button>
            </div>
        </form>
    `;

    // Setup payment option selection
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            option.querySelector('input').checked = true;
        });
    });

    // Setup form submission
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);

    modal.classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function handleCheckout(e) {
    e.preventDefault();
    
    const btn = document.getElementById('processPaymentBtn');
    btn.innerHTML = '<span class="spinner"></span> Procesando...';
    btn.classList.add('processing-btn');
    btn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        const order = {
            id: `order-${Date.now()}`,
            items: [...cart],
            total: getCartTotal(),
            customerInfo: {
                name: document.getElementById('customerName').value,
                email: document.getElementById('customerEmail').value,
                phone: document.getElementById('customerPhone').value,
                address: document.getElementById('customerAddress').value
            },
            status: 'completed',
            createdAt: new Date().toISOString()
        };

        orders.push(order);
        saveToLocalStorage('candy-store-orders', orders);
        
        // Clear cart
        cart = [];
        saveToLocalStorage('candy-store-cart', cart);
        updateCartBadge();
        
        closeCheckoutModal();
        showSuccessModal();
        
        // Reset button
        btn.innerHTML = 'Confirmar Pedido';
        btn.classList.remove('processing-btn');
        btn.disabled = false;
    }, 2000);
}

function showSuccessModal() {
    document.getElementById('successModal').classList.add('active');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    switchView('catalog');
}

// Utility functions
function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);