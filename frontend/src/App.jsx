import { useEffect, useMemo, useState } from "react";
import {
  Search, ShoppingBag, Heart, UserRound, Menu, X, Star, Plus, Minus,
  Trash2, ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw, Zap,
  SlidersHorizontal, ChevronRight, CheckCircle2, LayoutDashboard,
  Package, Users, IndianRupee, BarChart3, Clock3, Flame, CreditCard
} from "lucide-react";
import { getProducts, submitOrder } from "./api";
import { fallbackProducts, categories } from "./data";

const money = n => `₹${Number(n).toLocaleString("en-IN")}`;

function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("ss_cart") || "[]"));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("ss_wishlist") || "[]"));
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem("ss_recent") || "[]"));
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState("shop");
  const [mobileNav, setMobileNav] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {});
  }, []);

  useEffect(() => localStorage.setItem("ss_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("ss_wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("ss_recent", JSON.stringify(recent)), [recent]);

  const filtered = useMemo(() => {
    let list = products.filter(p =>
      (category === "All" || p.category === category) &&
      `${p.name} ${p.category} ${p.badge}`.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "low") list = [...list].sort((a,b) => a.price-b.price);
    if (sort === "high") list = [...list].sort((a,b) => b.price-a.price);
    if (sort === "rating") list = [...list].sort((a,b) => b.rating-a.rating);
    return list;
  }, [products, search, category, sort]);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.10) : 0;
  const delivery = subtotal > 2999 || subtotal === 0 ? 0 : 79;
  const total = subtotal - discount + delivery;

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  function addCart(p) {
    setCart(old => {
      const found = old.find(x => x.id === p.id);
      return found ? old.map(x => x.id === p.id ? {...x, qty:x.qty+1} : x) : [...old, {...p, qty:1}];
    });
    notify(`${p.name} added to cart`);
  }

  function toggleWishlist(p) {
    setWishlist(old => old.includes(p.id) ? old.filter(id => id !== p.id) : [...old, p.id]);
    notify(wishlist.includes(p.id) ? "Removed from wishlist" : "Saved to wishlist");
  }

  function openProduct(p) {
    setModal(p);
    setRecent(old => [p.id, ...old.filter(id => id !== p.id)].slice(0,5));
  }

  function removeCart(id) { setCart(old => old.filter(x => x.id !== id)); }
  function changeQty(id, delta) {
    setCart(old => old.map(x => x.id === id ? {...x, qty:Math.max(1,x.qty+delta)} : x));
  }

  async function placeOrder(customer) {
    try {
      const result = await submitOrder({customer, amount: total});
      setOrder(result.order);
    } catch {
      setOrder({id:"SS-DEMO-"+Date.now().toString().slice(-5), customer, amount:total, status:"Processing"});
    }
    setCart([]);
    setCoupon("");
    setCouponApplied(false);
    notify("Order placed successfully");
    setPage("shop");
  }

  return (
    <div className="app-shell">
      <div className="top-strip">
        <span><Zap size={13}/> Free delivery on orders above ₹2,999</span>
        <span className="strip-hide">Internship-ready demo • No database required</span>
        <span className="strip-hide">24/7 customer support</span>
      </div>

      <header className="header">
        <button className="icon-btn mobile-menu" onClick={()=>setMobileNav(!mobileNav)}>{mobileNav?<X/>:<Menu/>}</button>
        <div className="brand" onClick={()=>setPage("shop")}>
          <div className="brand-mark"><Sparkles size={19}/></div>
          <div><b>shop<span>sphere</span></b><small>SMART SHOPPING</small></div>
        </div>

        <nav className={mobileNav ? "nav open" : "nav"}>
          <button className={page==="shop" ? "active":""} onClick={()=>{setPage("shop");setMobileNav(false)}}>Shop</button>
          <button onClick={()=>{setCategory("All");setSearch("");setPage("shop");setMobileNav(false)}}>New Arrivals</button>
          <button onClick={()=>{setCategory("Electronics");setPage("shop");setMobileNav(false)}}>Electronics</button>
          <button onClick={()=>{setCategory("Fashion");setPage("shop");setMobileNav(false)}}>Fashion</button>
          <button className={page==="dashboard" ? "active":""} onClick={()=>{setPage("dashboard");setMobileNav(false)}}>Analytics</button>
        </nav>

        <div className="header-actions">
          <div className="searchbox">
            <Search size={18}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products, brands..." />
            {search && <button onClick={()=>setSearch("")}><X size={15}/></button>}
          </div>
          <button className="circle-action" title="Wishlist" onClick={()=>{setCategory("All");setPage("shop");}}>
            <Heart size={19}/>{wishlist.length>0 && <em>{wishlist.length}</em>}
          </button>
          <button className="circle-action" title="Cart" onClick={()=>setPage("cart")}>
            <ShoppingBag size={19}/>{cartCount>0 && <em>{cartCount}</em>}
          </button>
          <button className="profile-btn"><UserRound size={19}/><span>Account</span></button>
        </div>
      </header>

      {page === "dashboard" ? (
        <Dashboard products={products} />
      ) : page === "cart" ? (
        <CartPage cart={cart} changeQty={changeQty} removeCart={removeCart} subtotal={subtotal} discount={discount}
          delivery={delivery} total={total} coupon={coupon} setCoupon={setCoupon} couponApplied={couponApplied}
          setCouponApplied={setCouponApplied} onCheckout={()=>setPage("checkout")} />
      ) : page === "checkout" ? (
        <Checkout total={total} cartCount={cartCount} onBack={()=>setPage("cart")} onPlace={placeOrder} />
      ) : (
        <>
          <Hero onExplore={()=>document.getElementById("catalog").scrollIntoView({behavior:"smooth"})} />
          <TrustBar />
          <section className="category-row">
            {categories.map((c,i)=><button key={c} onClick={()=>setCategory(c)} className={category===c?"cat active":"cat"}>
              <span>{["✦","⌁","◈","◉","◇","⌂","✿"][i]}</span>{c}
            </button>)}
          </section>

          <main className="main-content" id="catalog">
            <div className="section-heading">
              <div>
                <p className="eyebrow"><Flame size={15}/> CURATED FOR YOU</p>
                <h2>{category==="All" ? "Trending picks" : `${category} collection`}</h2>
                <p className="muted">{filtered.length} products · Fresh finds, smart prices.</p>
              </div>
              <div className="catalog-controls">
                <div className="result-note"><SlidersHorizontal size={16}/> Refine your search</div>
                <select value={sort} onChange={e=>setSort(e.target.value)}>
                  <option value="featured">Sort: Featured</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {filtered.length ? <div className="product-grid">
              {filtered.map(p=><ProductCard key={p.id} p={p} wished={wishlist.includes(p.id)} onOpen={openProduct}
                onAdd={addCart} onWish={toggleWishlist}/>)}
            </div> : <EmptySearch onClear={()=>{setSearch("");setCategory("All")}}/>}
          </main>

          <Promo />
          <RecentlyViewed ids={recent} products={products} onOpen={openProduct}/>
        </>
      )}

      <footer className="footer">
        <div className="footer-brand"><div className="brand-mark"><Sparkles size={17}/></div><b>shopsphere</b><p>Curated shopping for modern lives.</p></div>
        <div><b>Shop</b><span>New arrivals</span><span>Best sellers</span><span>Flash deals</span></div>
        <div><b>Help</b><span>Delivery</span><span>Returns</span><span>Contact us</span></div>
        <div><b>Project</b><span>React + Django</span><span>No DB demo</span><span>Academic edition</span></div>
        <div className="footer-bottom">© 2026 ShopSphere · E-Commerce Shopping Portal · Built for learning</div>
      </footer>

      {modal && <ProductModal p={modal} wished={wishlist.includes(modal.id)} onClose={()=>setModal(null)}
        onAdd={p=>{addCart(p);setModal(null)}} onWish={toggleWishlist}/>}
      {order && <OrderModal order={order} onClose={()=>setOrder(null)}/>}
      {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
    </div>
  );
}

function Hero({onExplore}) {
  return <section className="hero">
    <div className="hero-orb orb1"/><div className="hero-orb orb2"/>
    <div className="hero-copy">
      <div className="pill"><Sparkles size={14}/> THE NEW SHOPPING STANDARD</div>
      <h1>Find your next<br/><span>favorite thing.</span></h1>
      <p>Discover thoughtfully selected products, limited-time deals and everyday essentials — all in one beautifully simple place.</p>
      <div className="hero-buttons"><button className="primary-btn" onClick={onExplore}>Explore collection <ArrowRight size={18}/></button><button className="ghost-btn" onClick={onExplore}>View deals</button></div>
      <div className="hero-stats"><div><b>12K+</b><span>Products</span></div><div><b>48K+</b><span>Happy shoppers</span></div><div><b>4.9/5</b><span>Average rating</span></div></div>
    </div>
    <div className="hero-art">
      <div className="floating-card small-card top-card"><span>🔥</span><div><b>Flash Sale</b><small>Up to 50% off</small></div></div>
      <div className="hero-product">
        <div className="hero-product-glow"/>
        <div className="hero-emoji">🎧</div>
        <div className="hero-product-info"><span>FEATURED DROP</span><b>Pixel Pro</b><small>Studio headphones</small><strong>₹3,299</strong></div>
      </div>
      <div className="floating-card review-card"><div className="avatar-stack"><i>A</i><i>M</i><i>R</i></div><div><b>4.9 ★</b><small>2.4k+ reviews</small></div></div>
    </div>
  </section>
}

function TrustBar() {
  return <div className="trustbar"><div><Truck/><span><b>Free delivery</b><small>On orders ₹2,999+</small></span></div><div><ShieldCheck/><span><b>Secure checkout</b><small>Protected payments</small></span></div><div><RotateCcw/><span><b>Easy returns</b><small>7-day return policy</small></span></div><div><CreditCard/><span><b>Flexible payments</b><small>Multiple options</small></span></div></div>
}

function ProductCard({p,wished,onOpen,onAdd,onWish}) {
  const off = Math.round((1-p.price/p.oldPrice)*100);
  return <article className="product-card">
    <div className={`product-visual ${p.accent}`} onClick={()=>onOpen(p)}>
      <span className="badge">{p.badge}</span>
      <button className={wished?"wish-btn wished":"wish-btn"} onClick={e=>{e.stopPropagation();onWish(p)}}><Heart size={17} fill={wished?"currentColor":"none"}/></button>
      <div className="product-emoji">{p.emoji}</div>
      <span className="quick-view">Quick view <ArrowRight size={13}/></span>
    </div>
    <div className="product-info">
      <span className="product-category">{p.category}</span>
      <h3 onClick={()=>onOpen(p)}>{p.name}</h3>
      <div className="rating"><Star size={14} fill="currentColor"/><b>{p.rating}</b><span>({p.reviews})</span></div>
      <div className="price-row"><b>{money(p.price)}</b><del>{money(p.oldPrice)}</del><em>{off}% OFF</em></div>
      <div className="stock"><span><i style={{width:`${Math.min(100,p.stock*3)}%`}}/></span>{p.stock < 10 ? `Only ${p.stock} left` : "In stock"}</div>
      <button className="add-btn" onClick={()=>onAdd(p)}><Plus size={17}/> Add to cart</button>
    </div>
  </article>
}

function ProductModal({p,wished,onClose,onAdd,onWish}) {
  return <div className="modal-backdrop" onClick={onClose}><div className="product-modal" onClick={e=>e.stopPropagation()}>
    <button className="modal-close" onClick={onClose}><X/></button>
    <div className={`modal-art ${p.accent}`}><span>{p.badge}</span><div>{p.emoji}</div></div>
    <div className="modal-copy"><span className="product-category">{p.category}</span><h2>{p.name}</h2><div className="rating big"><Star size={17} fill="currentColor"/><b>{p.rating}</b><span>{p.reviews} verified reviews</span></div><p>{p.description}</p>
      <div className="modal-price"><b>{money(p.price)}</b><del>{money(p.oldPrice)}</del></div>
      <div className="modal-benefits"><span>✓ Free delivery above ₹2,999</span><span>✓ 7-day easy returns</span><span>✓ Secure checkout</span></div>
      <div className="modal-actions"><button className="primary-btn" onClick={()=>onAdd(p)}><ShoppingBag size={18}/> Add to cart</button><button className={wished?"wish-large active":"wish-large"} onClick={()=>onWish(p)}><Heart size={18} fill={wished?"currentColor":"none"}/>{wished?"Saved":"Wishlist"}</button></div>
    </div>
  </div></div>
}

function CartPage({cart,changeQty,removeCart,subtotal,discount,delivery,total,coupon,setCoupon,couponApplied,setCouponApplied,onCheckout}) {
  return <main className="page-wrap">
    <div className="page-title"><div><p className="eyebrow">YOUR BAG</p><h1>Shopping cart</h1><p className="muted">{cart.length} unique items ready for checkout.</p></div><button className="ghost-btn" onClick={()=>history.back()}>← Continue shopping</button></div>
    {cart.length===0 ? <div className="empty-cart"><ShoppingBag size={45}/><h2>Your cart is waiting</h2><p>Add a few things you love and they'll appear here.</p></div> :
    <div className="cart-layout"><div className="cart-items">{cart.map(x=><div className="cart-item" key={x.id}><div className={`mini-art ${x.accent}`}>{x.emoji}</div><div className="cart-item-info"><span>{x.category}</span><h3>{x.name}</h3><b>{money(x.price)}</b><button className="remove-btn" onClick={()=>removeCart(x.id)}><Trash2 size={14}/> Remove</button></div><div className="qty"><button onClick={()=>changeQty(x.id,-1)}><Minus size={15}/></button><b>{x.qty}</b><button onClick={()=>changeQty(x.id,1)}><Plus size={15}/></button></div><strong className="line-total">{money(x.price*x.qty)}</strong></div>)}</div>
    <aside className="summary"><h3>Order summary</h3><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Delivery</span><b>{delivery?money(delivery):"FREE"}</b></div>{discount>0&&<div className="discount-line"><span>Coupon (10%)</span><b>-{money(discount)}</b></div>}<div className="coupon"><input placeholder="Coupon code" value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())}/><button onClick={()=>coupon==="SHOP10" ? setCouponApplied(true) : alert("Try coupon SHOP10")}>Apply</button></div><div className="summary-total"><span>Total</span><b>{money(total)}</b></div><button className="checkout-btn" onClick={onCheckout}>Proceed to checkout <ArrowRight size={18}/></button><small className="secure-note"><ShieldCheck size={14}/> Secure & encrypted checkout</small></aside></div>}
  </main>
}

function Checkout({total,cartCount,onBack,onPlace}) {
  const [form,setForm]=useState({name:"",email:"",phone:"",address:"",city:"",pincode:"",payment:"UPI"});
  const update=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=e=>{e.preventDefault(); if(!form.name||!form.email||!form.address||!form.pincode){alert("Please fill the required fields.");return} onPlace(form.name)};
  return <main className="page-wrap"><div className="page-title"><div><p className="eyebrow">SECURE CHECKOUT</p><h1>Complete your order</h1><p className="muted">{cartCount} items · Review your details before placing the order.</p></div><button className="ghost-btn" onClick={onBack}>← Back to cart</button></div>
    <form className="checkout-layout" onSubmit={submit}><div className="checkout-card"><h3>Delivery details</h3><div className="form-grid"><label>Full name*<input name="name" value={form.name} onChange={update} placeholder="Enter your name"/></label><label>Email*<input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com"/></label><label>Phone<input name="phone" value={form.phone} onChange={update} placeholder="+91 98765 43210"/></label><label>City<input name="city" value={form.city} onChange={update} placeholder="Coimbatore"/></label><label className="full">Address*<textarea name="address" value={form.address} onChange={update} placeholder="House no, street, landmark"/></label><label>Pincode*<input name="pincode" value={form.pincode} onChange={update} placeholder="641001"/></label></div><h3>Payment method</h3><div className="payment-options">{["UPI","Card","Cash on Delivery"].map(x=><label key={x} className={form.payment===x?"pay-option selected":"pay-option"}><input type="radio" name="payment" value={x} checked={form.payment===x} onChange={update}/><CreditCard size={18}/><span>{x}</span></label>)}</div></div><aside className="summary checkout-summary"><h3>Final amount</h3><div><span>Items</span><b>{cartCount}</b></div><div><span>Delivery</span><b>Free</b></div><div className="summary-total"><span>Payable</span><b>{money(total)}</b></div><button className="checkout-btn" type="submit">Place order <CheckCircle2 size={18}/></button><small className="secure-note"><ShieldCheck size={14}/> Demo payment — no real transaction</small></aside></form>
  </main>
}

function Promo() {
  return <section className="promo"><div><p className="eyebrow">MEMBER PERK</p><h2>Good things come<br/>with a little sparkle.</h2><p>Join the ShopSphere community for early access, curated drops and surprise offers.</p><button className="primary-btn">Join the club <ArrowRight size={17}/></button></div><div className="promo-art"><div>✨</div><span>EARLY ACCESS</span><b>2×</b><small>more member drops</small></div></section>
}

function RecentlyViewed({ids,products,onOpen}) {
  const list = ids.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  if(!list.length) return null;
  return <section className="recent-section"><div className="section-heading"><div><p className="eyebrow">YOUR ACTIVITY</p><h2>Recently viewed</h2></div></div><div className="recent-row">{list.map(p=><button className="recent-card" key={p.id} onClick={()=>onOpen(p)}><div className={`recent-art ${p.accent}`}>{p.emoji}</div><div><span>{p.category}</span><b>{p.name}</b><strong>{money(p.price)}</strong></div></button>)}</div></section>
}

function EmptySearch({onClear}) {
  return <div className="empty-search"><Search size={38}/><h3>No products found</h3><p>Try another keyword or reset your filters.</p><button className="primary-btn" onClick={onClear}>Clear filters</button></div>
}

function Dashboard({products}) {
  const totalStock = products.reduce((s,p)=>s+p.stock,0);
  return <main className="dashboard page-wrap"><div className="page-title"><div><p className="eyebrow">CONTROL CENTER</p><h1>Store analytics</h1><p className="muted">A presentation-ready dashboard using mock data — no database required.</p></div><span className="live-pill"><i/> Live demo</span></div>
    <div className="stat-grid"><Stat icon={<IndianRupee/>} label="Revenue" value="₹8.42L" change="+18.4%"/><Stat icon={<ShoppingBag/>} label="Orders" value="1,284" change="+12.8%"/><Stat icon={<Users/>} label="Customers" value="8,492" change="+9.3%"/><Stat icon={<Package/>} label="Inventory" value={totalStock} change="12 low stock"/></div>
    <div className="dashboard-grid"><div className="dash-card chart-card"><div className="dash-head"><div><b>Revenue overview</b><small>Last 7 days</small></div><BarChart3 size={19}/></div><div className="fake-chart">{[44,62,51,74,59,86,78].map((h,i)=><div key={i} className="bar-wrap"><div className="bar" style={{height:`${h}%`}}/><span>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span></div>)}</div></div>
    <div className="dash-card"><div className="dash-head"><div><b>Top categories</b><small>By order volume</small></div><LayoutDashboard size={19}/></div><div className="category-metrics">{[["Electronics",38],["Fashion",27],["Footwear",19],["Home",10],["Beauty",6]].map(([n,v])=><div key={n}><div><span>{n}</span><b>{v}%</b></div><span className="meter"><i style={{width:v*2.1+"%"}}/></span></div>)}</div></div></div>
    <div className="dash-card orders-table"><div className="dash-head"><div><b>Recent orders</b><small>Latest customer activity</small></div><Clock3 size={19}/></div><table><thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{[["SS-10482","Aarav Kumar","₹6,898","Delivered","30 Sep 2026"],["SS-10481","Meera S","₹4,299","Processing","30 Sep 2026"],["SS-10480","Rohan P","₹2,499","Shipped","29 Sep 2026"],["SS-10479","Diya R","₹3,299","Delivered","29 Sep 2026"]].map(r=><tr key={r[0]}>{r.map((x,i)=><td key={i}>{i===3?<span className={"status "+x.toLowerCase()}>{x}</span>:x}</td>)}</tr>)}</tbody></table></div>
  </main>
}

function Stat({icon,label,value,change}) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><span>{label}</span><b>{value}</b><small>{change}</small></div>
}

function OrderModal({order,onClose}) {
  return <div className="modal-backdrop"><div className="order-modal"><div className="success-icon"><CheckCircle2 size={42}/></div><p className="eyebrow">ORDER CONFIRMED</p><h2>You're all set!</h2><p>Thanks, {order.customer}. Your ShopSphere order is being processed.</p><div className="order-number">{order.id}</div><div className="order-info"><span>Total paid <b>{money(order.amount)}</b></span><span>Status <b>{order.status}</b></span></div><button className="primary-btn" onClick={onClose}>Continue shopping <ArrowRight size={17}/></button></div></div>
}

export default App;
