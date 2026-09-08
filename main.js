const filterButtons = Array.from(document.querySelectorAll('.filter-chip'));
const menuItems = Array.from(document.querySelectorAll('.menu-item'));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));

    menuItems.forEach((item) => {
      const showItem = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !showItem);
    });
  });
});

const cart = [];
const cartList = document.getElementById('cartList');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');

const cartItems = new Map();

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function makeCartItem(product, price = 29.9) {
  const li = document.createElement('div');
  li.className = 'cart-item';

  const productBlock = document.createElement('div');
  productBlock.innerHTML = `<span class="item-name">${product}</span>`;

  const amountBlock = document.createElement('div');
  amountBlock.innerHTML = `<span class="item-price">${formatCurrency(price)}</span>`;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'cart-remove';
  removeButton.innerHTML = '×';
  removeButton.setAttribute('aria-label', `Remover ${product}`);

  removeButton.addEventListener('click', () => {
    const current = cartItems.get(product) ?? 0;
    if (current > 1) {
      cartItems.set(product, current - 1);
    } else {
      cartItems.delete(product);
    }
    renderCart();
  });

  li.append(productBlock, amountBlock, removeButton);
  return li;
}

document.querySelectorAll('[data-product]').forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.dataset.product;
    const current = cartItems.get(product) ?? 0;
    cartItems.set(product, current + 1);
    renderCart();
  });
});

function renderCart() {
  const totalCount = Array.from(cartItems.values()).reduce((sum, value) => sum + value, 0);
  const productNames = Array.from(cartItems.keys());

  cartList.innerHTML = '';

  if (productNames.length === 0) {
    cartList.innerHTML = `<div class="empty-cart"><span class="empty-icon">🥔</span><p>Nenhum produto selecionado.</p></div>`;
  } else {
    productNames.forEach((product) => {
      const quantity = cartItems.get(product) ?? 0;
      const price = 29.9 * quantity;

      const item = makeCartItem(product, price);
      const productName = item.querySelector('.item-name');
      productName.textContent = `${product} × ${quantity}`;

      cartList.appendChild(item);
    });
  }

  cartCount.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'itens'}`;

  const totalValue = productNames.reduce((sum, product) => {
    const quantity = cartItems.get(product) ?? 0;
    return sum + (29.9 * quantity);
  }, 0);

  cartTotal.textContent = formatCurrency(totalValue);

  const orderText = productNames.length
    ? `Quero fazer um pedido da Los Potatos: ${productNames.map((product) => `${product} x${cartItems.get(product) ?? 1}`).join(', ')}.`
    : 'Quero fazer um pedido da Los Potatos';

  checkoutButton.href = `https://wa.me/5512996466926?text=${encodeURIComponent(orderText)}`;
}
