// Basic interactivity: theme toggle, mobile menu, cart
(function(){
  // theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const saved = localStorage.getItem('site-theme');
  if(saved === 'dark') body.classList.add('dark');

  themeBtn && themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('site-theme', body.classList.contains('dark') ? 'dark' : 'light');
  });

  // mobile menu
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  menuToggle && menuToggle.addEventListener('click', () => {
    if(nav.style.display === 'block') nav.style.display = '';
    else nav.style.display = 'block';
  });

  // cart
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const cartClose = document.getElementById('cart-close');
  const cartCount = document.getElementById('cart-count');
  const cartList = document.getElementById('cart-list');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  function getCart(){ return JSON.parse(localStorage.getItem('sium-cart')||'[]'); }
  function saveCart(c){ localStorage.setItem('sium-cart', JSON.stringify(c)); }

  function renderCart(){
    const items = getCart();
    cartCount && (cartCount.textContent = items.length);
    if(!cartList) return;
    cartList.innerHTML = '';
    let total = 0;
    if(items.length === 0){
      cartList.innerHTML = '<li>Your cart is empty.</li>';
    } else {
      items.forEach((i, idx) => {
        const li = document.createElement('li');
        li.textContent = `${i.title} — BDT ${i.price}`;
        const rem = document.createElement('button');
        rem.textContent = 'Remove';
        rem.className = 'btn small';
        rem.style.marginLeft = '8px';
        rem.addEventListener('click', () => {
          items.splice(idx,1); saveCart(items); renderCart();
        });
        li.appendChild(rem);
        cartList.appendChild(li);
        total += Number(i.price||0);
      });
    }
    cartTotal && (cartTotal.textContent = 'BDT ' + total);
  }

  // attach add-to-cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const price = btn.dataset.price;
      const c = getCart();
      c.push({id,title,price});
      saveCart(c);
      renderCart();
      alert(`${title} added to cart.`);
    });
  });

  cartBtn && cartBtn.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
  });
  cartClose && cartClose.addEventListener('click', () => {
    cartModal.classList.add('hidden');
  });

  checkoutBtn && checkoutBtn.addEventListener('click', () => {
    const items = getCart();
    if(items.length === 0){ alert('Cart is empty'); return; }
    // Placeholder demo: show summary and clear cart
    let total = items.reduce((s,i)=>s+Number(i.price||0),0);
    alert(`Demo checkout — total BDT ${total}. In production, integrate Stripe or SSLCommerz checkout flow.`);
    localStorage.removeItem('sium-cart');
    renderCart();
    cartModal.classList.add('hidden');
  });

  // initialize
  renderCart();

  // footer year
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
})();
