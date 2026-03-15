//ДЛЯ КОРЗИНЫ НА ВСК СТРАНИЦЫ

function getCart() {
    return JSON.parse(localStorage.getItem('reliquary_cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('reliquary_cart', JSON.stringify(cart));
}

function addToCart(name, price, img) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, img, qty: 1 });
    }
    saveCart(cart);
}

function removeFromCart(name) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== name);
    saveCart(cart);
}

function updateQty(name, delta) {
    const cart = getCart();
    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(name);
            return;
        }
    }
    saveCart(cart);
}

function getTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function formatPrice(p) {
    return p.toLocaleString('ru-RU') + ' ₽';
}

//корзина
document.addEventListener('DOMContentLoaded', function () {

    const cartList    = document.getElementById('cart-list');
    const cartEmpty   = document.getElementById('cart-empty');
    const cartCheckout = document.getElementById('cart-checkout');
    const bottomHr    = document.getElementById('bottom-hr');
    const totalPriceEl = document.getElementById('total-price-top');
    const totalCountEl = document.getElementById('total-count');

    if (!cartList) return; //не страница корзины

    function renderCart() {
        const cart = getCart();
        cartList.innerHTML = '';

        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartCheckout.style.display = 'none';
            bottomHr.style.display = 'none';
            totalPriceEl.textContent = '0 ₽';
            totalCountEl.textContent = '0 товаров';
            return;
        }

        cartEmpty.style.display = 'none';
        cartCheckout.style.display = 'block';
        bottomHr.style.display = 'block';

        //считаем итого
        const total = getTotal(cart);
        const count = cart.reduce((s, i) => s + i.qty, 0);
        totalPriceEl.textContent = formatPrice(total);
        totalCountEl.textContent = count + ' ' + declension(count, ['товар', 'товара', 'товаров']);

        //рендерим каждый товар
        cart.forEach(function (item) {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img class="cart-item-img" src="${item.img}" alt="${item.name}">
                <span class="cart-item-name">${item.name}</span>
                <div class="cart-item-qty">
                    <button class="qty-btn" data-name="${item.name}" data-delta="-1">−</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn" data-name="${item.name}" data-delta="1">+</button>
                </div>
                <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
                <button class="cart-item-remove" data-name="${item.name}" title="Удалить">✕</button>
            `;
            cartList.appendChild(div);
        });

        //обработчики кнопок
        cartList.querySelectorAll('.qty-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const name  = btn.dataset.name;
                const delta = parseInt(btn.dataset.delta);
                updateQty(name, delta);
                renderCart();
            });
        });

        cartList.querySelectorAll('.cart-item-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                removeFromCart(btn.dataset.name);
                renderCart();
            });
        });
    }

    //склонение
    function declension(n, forms) {
        const mod10 = n % 10;
        const mod100 = n % 100;
        if (mod10 === 1 && mod100 !== 11) return forms[0];
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
        return forms[2];
    }

    renderCart();
});