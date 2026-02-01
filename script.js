const defaultProducts = [
    { id: 1, name: "Neon Pro Football", price: 500, cat: "gear", img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Velocity Runners", price: 1200, cat: "shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Hex Dumbbells", price: 800, cat: "gear", img: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Urban Basketball", price: 600, cat: "gear", img: "https://images.unsplash.com/photo-1519861531473-920026393112?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Sprint Spikes", price: 1500, cat: "shoes", img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Training Mat", price: 350, cat: "gear", img: "https://images.unsplash.com/photo-1599447421405-0753f5d10974?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" }
];

let products = [];
try {
    const stored = localStorage.getItem('laPassionProducts');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = defaultProducts;
        localStorage.setItem('laPassionProducts', JSON.stringify(products));
    }
} catch (e) {
    console.error("Storage Error:", e);
    products = defaultProducts;
}

let cart = [];
let currentUser = null;

function navigateTo(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active-view'));
    document.querySelectorAll('.nav-links button').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId + '-view').classList.add('active-view');
    
    const navBtn = document.getElementById('nav-' + viewId);
    if(navBtn) navBtn.classList.add('active');
    
    document.body.classList.remove('cart-open');
    window.scrollTo(0, 0);
    
    if(viewId === 'shop') renderProducts(products);
    if(viewId === 'home') renderHomeTeasers();
    if(viewId === 'admin') renderAdminPanel();
    if(viewId === 'checkout') renderCheckoutPage();
    
    lucide.createIcons();
}

function renderProducts(list) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = "";
    list.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <div class="card-img-container"><img src="${p.img}" alt="${p.name}"></div>
                <div class="card-info">
                    <h3>${p.name}</h3>
                    <div style="color:var(--accent); font-weight:bold; font-size:1.2rem;">${p.price} EGP</div>
                    <button class="add-cart-btn" onclick="addToCart(${p.id})">ADD TO CART</button>
                </div>
            </div>
        `;
    });
    lucide.createIcons();
}

function renderHomeTeasers() {
    const grid = document.getElementById('homeTeaserGrid');
    grid.innerHTML = "";
    products.slice(0, 3).forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <div class="card-img-container"><img src="${p.img}" alt="${p.name}"></div>
                <div class="card-info">
                    <h3>${p.name}</h3>
                    <div style="color:var(--accent); font-weight:bold;">${p.price} EGP</div>
                </div>
            </div>
        `;
    });
}

function filterProducts(cat) {
    if(cat === 'all') renderProducts(products);
    else renderProducts(products.filter(p => p.cat === cat));
}

function toggleCart() { document.body.classList.toggle('cart-open'); }

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    const existing = cart.find(item => item.p.id === id);
    if(existing) existing.qty++; else cart.push({ p: prod, qty: 1 });
    updateCartUI();
    if(!document.body.classList.contains('cart-open')) toggleCart();
}

function removeFromCart(id) { cart = cart.filter(item => item.p.id !== id); updateCartUI(); }

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const totalDisplay = document.getElementById('cartTotal');
    const badge = document.getElementById('cartCount');
    
    container.innerHTML = "";
    let total = 0; let count = 0;
    cart.forEach(item => {
        total += item.p.price * item.qty;
        count += item.qty;
        container.innerHTML += `
            <div class="cart-item-row">
                <img src="${item.p.img}" style="width:50px; height:50px; border-radius:5px; object-fit:cover; margin-right:15px;">
                <div style="flex-grow:1;">
                    <div style="font-weight:bold;">${item.p.name}</div>
                    <div style="color:var(--accent); font-size:0.9rem;">${item.p.price} EGP x ${item.qty}</div>
                </div>
                <button onclick="removeFromCart(${item.p.id})" style="color:var(--danger); background:none; border:none; cursor:pointer;"><i data-lucide="trash-2" width="18"></i></button>
            </div>`;
    });
    if(cart.length === 0) container.innerHTML = '<p style="text-align:center; color:gray; margin-top:50px;">Your cart is empty.</p>';
    totalDisplay.innerText = total + " EGP";
    badge.innerText = count;
    lucide.createIcons();
}

function goToCheckout() { 
    if(cart.length === 0) return alert("Your cart is empty!"); 
    toggleCart(); 
    navigateTo('checkout'); 
}

function renderCheckoutPage() {
    const list = document.getElementById('checkoutItemsList');
    const totalEl = document.getElementById('checkoutPageTotal');
    list.innerHTML = "";
    let total = 0;

    if(cart.length === 0) {
        list.innerHTML = "<p style='color:gray'>No items in checkout.</p>";
    }

    cart.forEach(item => {
        total += item.p.price * item.qty;
        list.innerHTML += `
            <div class="checkout-item-mini">
                <img src="${item.p.img}" class="checkout-mini-img">
                <div style="flex-grow:1">
                    <h4 style="font-size:1.1rem">${item.p.name}</h4>
                    <p style="color:gray; font-size:0.9rem">Qty: ${item.qty}</p>
                    <p style="color:var(--accent); font-weight:bold;">${item.p.price * item.qty} EGP</p>
                </div>
                <button onclick="removeCheckoutItem(${item.p.id})" style="background:none; border:none; color:var(--danger); cursor:pointer;">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
    });
    totalEl.innerText = total + " EGP";
    lucide.createIcons();
}

function removeCheckoutItem(id) {
    cart = cart.filter(item => item.p.id !== id);
    updateCartUI();
    renderCheckoutPage();
}

function processOrder() { 
    if(cart.length === 0) return alert("Your cart is empty!");
    alert("Order Placed Successfully!"); 
    cart = []; 
    updateCartUI(); 
    navigateTo('home'); 
}

function performLogin() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    if(email === 'admin@store.com' && pass === '123') {
        currentUser = 'admin';
        document.getElementById('nav-admin').style.display = 'block'; 
        document.getElementById('authBtn').innerText = "LOGOUT";
        document.getElementById('authBtn').onclick = () => window.location.reload();
        alert("Welcome Admin!");
        navigateTo('admin');
    } else {
        currentUser = 'customer';
        alert("Logged in as Customer");
        navigateTo('home');
    }
}

function renderAdminPanel() {
    const list = document.getElementById('adminProductList');
    list.innerHTML = "";
    products.forEach(p => {
        list.innerHTML += `
            <div class="product-card">
                <div class="card-img-container" style="height:150px"><img src="${p.img}" alt="${p.name}"></div>
                <div class="card-info" style="padding:10px;">
                    <h4 style="font-size:1rem">${p.name}</h4>
                    <div style="color:var(--accent); font-weight:bold; font-size:0.9rem;">${p.price} EGP</div>
                    <div class="admin-controls">
                        <button class="delete-btn" onclick="deleteProduct(${p.id})">DELETE</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function addNewProduct() {
    const name = document.getElementById('adminProdName').value;
    const price = Number(document.getElementById('adminProdPrice').value);
    const cat = document.getElementById('adminProdCat').value;
    const img = document.getElementById('adminProdImg').value;

    if(name && price && img) {
        const newProd = { id: Date.now(), name, price, cat, img };
        products.push(newProd);
        saveProducts(); 
        renderAdminPanel();
        alert("Product Added!");
        document.getElementById('adminProdName').value = "";
        document.getElementById('adminProdPrice').value = "";
        document.getElementById('adminProdImg').value = "";
    }
}

function deleteProduct(id) {
    if(confirm("Are you sure you want to remove this item?")) {
        const idNum = Number(id);
        const initialLen = products.length;
        products = products.filter(p => p.id !== idNum);
        
        if (products.length === initialLen) {
            alert("Error: Item not found (ID mismatch).");
        } else {
            saveProducts(); 
            renderAdminPanel();
            alert("Item Deleted Successfully.");
        }
    }
}

function saveProducts() {
    try { localStorage.setItem('laPassionProducts', JSON.stringify(products)); } 
    catch (e) { alert("Failed to save changes: Storage full or disabled."); console.error(e); }
}

window.onload = () => {
    renderHomeTeasers(); 
    lucide.createIcons();
};