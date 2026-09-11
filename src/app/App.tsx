import { useState, useEffect } from "react";
import {
  ShoppingCart, Menu, X, Search, Instagram, Youtube, Twitter,
  Phone, Mail, MapPin, Minus, Plus, Trash2,
  Star, Heart, Package, Truck, Shield, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ── Helpers ───────────────────────────────────────────────────────────────
const toPerNum = (n: string | number) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

const formatPrice = (n: number) =>
  toPerNum(n.toLocaleString("en-US")) + " تومان";

// ── Types ─────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  rating: number;
  reviews: number;
}
interface CartItem extends Product { quantity: number; }

// ── Data ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "همه محصولات" },
  { id: "decks", label: "دک" },
  { id: "shoes", label: "کفش" },
  { id: "wheels", label: "چرخ" },
  { id: "protection", label: "ایمنی" },
  { id: "apparel", label: "پوشاک" },
  { id: "accessories", label: "لوازم" },
];

const PRODUCTS: Product[] = [
  {
    id: 1, name: "دک اسکیت پرو", nameEn: "Pro Series Deck",
    description: "دک حرفه‌ای با چوب افرا ۷ لایه کانادایی. طراحی اختصاصی برند اسکیت شاپ با سطح شنی کیفیت بالا. مناسب برای تریک‌های سطح بالا و اسکیتبازان حرفه‌ای.",
    price: 1850000, originalPrice: 2200000,
    image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=600&h=750&fit=crop&auto=format",
    category: "decks", badge: "پرفروش", rating: 4.8, reviews: 124,
  },
  {
    id: 2, name: "ست کامل استریت", nameEn: "Street Complete Setup",
    description: "پکیج کامل شامل دک ۸ اینچ، ترک تیتانیوم، چرخ ۵۲mm و بیرینگ ABEC-9. آماده برای سواری از همان روز اول. بهترین انتخاب برای تازه‌کاران.",
    price: 3200000,
    image: "https://images.unsplash.com/photo-1536318431364-5cc762cfc8ec?w=600&h=750&fit=crop&auto=format",
    category: "decks", badge: "جدید", rating: 4.9, reviews: 87,
  },
  {
    id: 3, name: "کفش اسکیت استریت", nameEn: "Street Skate Shoes",
    description: "کفش اسکیت حرفه‌ای با رویه چرم مصنوعی و تخت ولکانیزه مقاوم. طراحی ارگونومیک برای حداکثر کنترل روی دک. موجود از سایز ۳۶ تا ۴۷.",
    price: 2100000, originalPrice: 2500000,
    image: "https://images.unsplash.com/photo-1573554943001-ac2d0211bd90?w=600&h=750&fit=crop&auto=format",
    category: "shoes", rating: 4.7, reviews: 203,
  },
  {
    id: 4, name: "چرخ کریستال پرو", nameEn: "Crystal Pro Wheels",
    description: "ست ۴ عدد چرخ پلی‌اورتان با سختی ۱۰۱A. قطر ۵۲mm، عرض ۳۲mm. مناسب برای سطوح استخر و استریت. لغزندگی پایین و سرعت بالا.",
    price: 650000,
    image: "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=600&h=750&fit=crop&auto=format",
    category: "wheels", badge: "۲۵٪ تخفیف", rating: 4.6, reviews: 156,
  },
  {
    id: 5, name: "هلمت پرو شهری", nameEn: "Urban Pro Helmet",
    description: "هلمت سبک با پوشش EPS و رویه ABS مقاوم. دارای گواهینامه ایمنی CE اروپا. سیستم تهویه هوشمند برای راحتی در فصل گرما.",
    price: 980000,
    image: "https://images.unsplash.com/photo-1601247309037-a3e434b07906?w=600&h=750&fit=crop&auto=format",
    category: "protection", rating: 4.5, reviews: 92,
  },
  {
    id: 6, name: "تی‌شرت گرافیکی", nameEn: "Graphic Tee",
    description: "تی‌شرت با پارچه ۱۰۰٪ نخ پنبه ارگانیک. طرح گرافیکی اختصاصی اسکیت شاپ با چاپ سیلک‌اسکرین. موجود در رنگ‌های مشکی، سفید و زرد.",
    price: 450000,
    image: "https://images.unsplash.com/photo-1487051224065-0a68403c2450?w=600&h=750&fit=crop&auto=format",
    category: "apparel", badge: "نسخه محدود", rating: 4.9, reviews: 67,
  },
  {
    id: 7, name: "دک گالری آرت", nameEn: "Gallery Art Deck",
    description: "دک هنری با چاپ گرافیکی دیجیتال UV روی چوب افرا. نسخه محدود ۵۰ عدد. مناسب برای کلکسیون و دکوراسیون فضاهای خلاقانه.",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1575321539738-12cdc5ee584e?w=600&h=750&fit=crop&auto=format",
    category: "decks", rating: 4.4, reviews: 45,
  },
  {
    id: 8, name: "کوله اسکیتر پرو", nameEn: "Skater Pro Backpack",
    description: "کوله‌پشتی ضدآب ۳۰ لیتر با جای اختصاصی دک اسکیت. جیب لپ‌تاپ پدینگ‌دار ۱۵ اینچ. یراق‌آلات مقاوم و قابل تنظیم.",
    price: 870000, originalPrice: 1100000,
    image: "https://images.unsplash.com/photo-1723132798533-8a18e89b5e90?w=600&h=750&fit=crop&auto=format",
    category: "accessories", rating: 4.7, reviews: 89,
  },
];

// ── Sub-components ────────────────────────────────────────────────────────
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-[#FFD100] text-[#FFD100]" : "text-white/20"}`} />
      ))}
    </div>
  );
}

function ProductCard({
  product, onOpen, onAddToCart, isWishlisted, onToggleWishlist,
}: {
  product: Product;
  onOpen: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
}) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="group relative bg-[#111] overflow-hidden border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
      <div className="relative overflow-hidden bg-[#1A1A1A] aspect-[3/4] cursor-pointer" onClick={() => onOpen(product)}>
        <img
          src={product.image} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-300" />

        {product.badge && (
          <div className="absolute top-3 right-3 bg-[#FFD100] text-black text-[10px] font-bold px-2 py-1 leading-none">
            {product.badge}
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className={`absolute top-3 left-3 p-1.5 rounded-full transition-all duration-200 ${isWishlisted ? "bg-[#FFD100] text-black" : "bg-black/50 text-white/70 hover:bg-black/70"}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-black" : ""}`} />
        </button>

        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full bg-[#FFD100] text-black font-bold py-3 text-xs hover:bg-yellow-300 transition-colors"
          >
            افزودن به سبد خرید
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm leading-tight mb-0.5 truncate">{product.name}</h3>
            <p className="text-white/30 text-xs">{product.nameEn}</p>
          </div>
          <StarRow rating={product.rating} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-white text-sm">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-white/25 text-xs line-through">{formatPrice(product.originalPrice)}</span>
          )}
          {discount > 0 && (
            <span className="text-[#FFD100] text-xs font-bold">{toPerNum(discount)}٪</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
  name: "",
  phone: "",
  address: "",
});
  const [orderComplete, setOrderComplete] = useState(false);
const [lastOrderNumber, setLastOrderNumber] = useState("");
  const [myOrderOpen, setMyOrderOpen] = useState(false);
const [myOrder, setMyOrder] = useState<any | null>(null);
  const handleCheckout = () => {
  if (!checkoutForm.name.trim()) {
    alert("لطفاً نام و نام خانوادگی را وارد کنید.");
    return;
  }

  if (!checkoutForm.phone.trim()) {
    alert("لطفاً شماره تماس را وارد کنید.");
    return;
  }

  if (!checkoutForm.address.trim()) {
    alert("لطفاً آدرس را وارد کنید.");
    return;
  }

  if (cartItems.length === 0) {
    alert("سبد خرید شما خالی است.");
    return;
  }

  const orderItems = cartItems
    .map(
      (item) =>
        `• ${item.name} × ${item.quantity} — ${formatPrice(
          item.price * item.quantity
        )}`
    )
    .join("\n");

  const orderMessage = `سلام، می‌خواهم این سفارش را ثبت کنم:

نام: ${checkoutForm.name}
شماره تماس: ${checkoutForm.phone}
آدرس: ${checkoutForm.address}

محصولات:
${orderItems}

مبلغ کل: ${formatPrice(totalPrice)}`;

  const whatsappUrl = `https://wa.me/989332667801?text=${encodeURIComponent(
  orderMessage
)}`;

const orderNumber = `SK-${Date.now().toString().slice(-8)}`;

setLastOrderNumber(orderNumber);
setOrderComplete(true);
setCheckoutOpen(false);

localStorage.setItem(
  "skateShopLastOrder",
  JSON.stringify({
    orderNumber,
    customer: checkoutForm,
    items: cartItems,
    total: totalPrice,
    createdAt: new Date().toISOString(),
  })
);

setTimeout(() => {
  window.open(whatsappUrl, "_blank");
}, 150);
  };
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
 useEffect(() => {
  const savedOrder = localStorage.getItem("skateShopLastOrder");

  if (savedOrder) {
    try {
      setMyOrder(JSON.parse(savedOrder));
    } catch {
      setMyOrder(null);
    }
  }
}, []); 
  const openMyOrder = () => {
  const savedOrder = localStorage.getItem("skateShopLastOrder");

  if (savedOrder) {
    try {
      const parsedOrder = JSON.parse(savedOrder);
      setMyOrder(parsedOrder);
      setMyOrderOpen(true);
    } catch {
      setMyOrder(null);
      setMyOrderOpen(true);
    }
  } else {
    setMyOrder(null);
    setMyOrderOpen(true);
  }

  setMenuOpen(false);
};

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const updateQty = (id: number, delta: number) =>
    setCartItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  const removeFromCart = (id: number) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  const toggleWishlist = (id: number) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const filtered = activeCategory === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const ANTON = { fontFamily: "'Anton', sans-serif" };
  const VAZIR = { fontFamily: "'Vazirmatn', sans-serif" };
      return (
    <div dir="rtl" className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden" style={VAZIR}>

      {/* ── Header ───────────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 bg-[#FFD100] flex items-center justify-center">
                <span className="text-black text-xs font-bold" style={ANTON}>SK</span>
              </div>
              <span className="text-white text-xl tracking-widest" style={ANTON}>SKATE SHOP</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {[["hero","خانه"],["products","محصولات"],["gallery","گالری"],["about","درباره ما"],["contact","تماس با ما"]].map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="text-sm text-white/55 hover:text-[#FFD100] transition-colors duration-200 font-medium">
                  {label}
                </button>
              ))}
              <button
  onClick={openMyOrder}
  className="text-sm text-white/55 hover:text-[#FFD100] transition-colors duration-200 font-medium"
>
  سفارش من
</button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button className="hidden sm:flex p-2.5 text-white/55 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button onClick={() => setCartOpen(true)} className="relative p-2.5 text-white/55 hover:text-white transition-colors">
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] bg-[#FFD100] text-black text-[9px] font-bold flex items-center justify-center rounded-full px-1" style={ANTON}>
                    {toPerNum(totalItems)}
                  </span>
                )}
              </button>
              <button onClick={() => setMenuOpen(true)} className="lg:hidden p-2.5 text-white/55 hover:text-white transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu ──────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#0A0A0A] flex flex-col p-6 lg:hidden"
          >
            <div className="flex items-center justify-between mb-16">
              <button onClick={() => setMenuOpen(false)} className="p-2 text-white/55 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <span className="text-xl tracking-widest" style={ANTON}>SKATE SHOP</span>
            </div>
            <nav className="flex flex-col gap-8 flex-1">
              {[["hero","خانه"],["products","محصولات"],["gallery","گالری"],["about","درباره ما"],["contact","تماس"]].map(([id, label], i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => scrollTo(id)}
                  className="text-right text-4xl font-black text-white/70 hover:text-[#FFD100] transition-colors leading-none"
                >
                  {label}
                </motion.button>
              ))}
              <button
  onClick={openMyOrder}
  className="text-right text-4xl font-black text-white/70 hover:text-[#FFD100] transition-colors leading-none"
>
  سفارش من
</button>
            </nav>
            <div className="flex gap-5 text-white/25">
              <Instagram className="w-5 h-5" />
              <Youtube className="w-5 h-5" />
              <Twitter className="w-5 h-5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cart Sidebar ─────────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-[380px] bg-[#111] flex flex-col border-l border-white/[0.06]"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <span className="font-bold text-sm">
                  سبد خرید
                  {totalItems > 0 && <span className="mr-2 text-[#FFD100] font-normal text-xs">({toPerNum(totalItems)} محصول)</span>}
                </span>
                <button onClick={() => setCartOpen(false)} className="p-2 text-white/55 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-white/25">
                    <ShoppingCart className="w-10 h-10" />
                    <p className="text-sm">سبد خرید شما خالی است</p>
                    <button onClick={() => { setCartOpen(false); scrollTo("products"); }}
                      className="text-[#FFD100] text-xs hover:underline">
                      مشاهده محصولات
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-[#1A1A1A]">
                      <img src={item.image} alt={item.name} className="w-16 h-20 object-cover flex-shrink-0 bg-[#222]" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm leading-tight mb-1 truncate">{item.name}</p>
                        <p className="text-white/40 text-xs mb-3">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-white/10">
                            <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1.5 text-white/55 hover:text-white">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-sm min-w-[2rem] text-center">{toPerNum(item.quantity)}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1.5 text-white/55 hover:text-white">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-white/25 hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-5 border-t border-white/[0.06] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/55 text-sm">جمع کل:</span>
                    <span className="font-bold text-[#FFD100]">{formatPrice(totalPrice)}</span>
                  </div>
                  <button
  onClick={() => setCheckoutOpen(true)}
  className="w-full bg-[#FFD100] text-black font-bold py-4 text-sm hover:bg-yellow-300 transition-colors"
>
  تکمیل خرید
</button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Product Detail Modal ──────────────────────────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-3 lg:inset-10 z-[70] bg-[#111] overflow-hidden flex flex-col lg:flex-row"
              style={{ maxHeight: "94vh" }}
            >
              {/* Image panel */}
              <div className="relative lg:w-1/2 h-56 lg:h-auto bg-[#1A1A1A] flex-shrink-0">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                {selectedProduct.badge && (
                  <div className="absolute top-4 right-4 bg-[#FFD100] text-black text-xs font-bold px-3 py-1.5">
                    {selectedProduct.badge}
                  </div>
                )}
              </div>

              {/* Details panel */}
              <div className="flex-1 p-6 lg:p-10 overflow-y-auto flex flex-col relative">
                <button onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 left-4 p-2 text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>

                <div className="flex-1">
                  <p className="text-white/25 text-xs mb-2 tracking-widest uppercase" style={{ fontFamily: "monospace" }}>
                    {selectedProduct.nameEn}
                  </p>
                  <h2 className="text-white leading-tight mb-4" style={{ ...ANTON, fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
                    {selectedProduct.name}
                  </h2>

                  <div className="flex items-center gap-3 mb-6">
                    <StarRow rating={selectedProduct.rating} />
                    <span className="text-white/35 text-sm">({toPerNum(selectedProduct.reviews)} نظر)</span>
                  </div>

                  <p className="text-white/55 leading-8 mb-8 text-sm lg:text-base">{selectedProduct.description}</p>

                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[{ icon: Truck, label: "ارسال رایگان" }, { icon: Shield, label: "ضمانت اصالت" }, { icon: Package, label: "بسته‌بندی مطمئن" }].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-2 p-3 bg-white/[0.04] text-center">
                        <Icon className="w-4 h-4 text-[#FFD100]" />
                        <span className="text-white/45 text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-white/[0.06]">
                  <div>
                    <div className="text-2xl lg:text-3xl font-black">{formatPrice(selectedProduct.price)}</div>
                    {selectedProduct.originalPrice && (
                      <div className="text-white/25 text-sm line-through">{formatPrice(selectedProduct.originalPrice)}</div>
                    )}
                  </div>
                  <button
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); setCartOpen(true); }}
                    className="flex-1 bg-[#FFD100] text-black font-bold py-4 text-sm hover:bg-yellow-300 transition-colors"
                  >
                    افزودن به سبد خرید
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
            {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO                                                    */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-end pb-20 lg:pb-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#111]">
          <img
            src="https://images.unsplash.com/photo-1547198152-dde291a08c45?w=1600&h=900&fit=crop&auto=format"
            alt="اسکیتباز در حال پرش"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0A0A0A]/60" />
        </div>

        {/* Yellow vertical accent */}
        <div className="absolute top-0 bottom-0 right-0 w-1 bg-[#FFD100]" />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-10 w-full">
          <div className="max-w-2xl">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#FFD100]" />
              <span className="text-[#FFD100] text-xs font-bold tracking-[0.3em] uppercase">New Collection ۲۰۲۵</span>
            </div>

            {/* Display headline */}
            <h1 className="text-white leading-[0.9] tracking-tight mb-6"
              style={{ ...ANTON, fontSize: "clamp(3.5rem, 10vw, 7.5rem)" }}>
              SKATE<br />
              <span className="text-[#FFD100]">YOUR</span><br />
              WAY
            </h1>

            <p className="text-white/55 text-sm lg:text-base leading-8 mb-10 max-w-md">
              بهترین تجهیزات اسکیت از برندهای جهانی. از دک و ترک تا کفش و پوشاک استریت — هر آنچه برای یک سواری حرفه‌ای نیاز داری.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollTo("products")}
                className="bg-[#FFD100] text-black font-bold px-8 py-4 text-sm hover:bg-yellow-300 transition-all duration-200 hover:scale-105">
                مشاهده محصولات
              </button>
              <button onClick={() => scrollTo("gallery")}
                className="border border-white/20 text-white font-medium px-8 py-4 text-sm hover:border-[#FFD100]/50 hover:text-[#FFD100] transition-all duration-200">
                گالری تصاویر
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 mt-14 pt-8 border-t border-white/[0.08]">
              {[["۱۴+","سال تجربه"],["۵۰۰+","محصول"],["۱۵,۰۰۰+","مشتری"]].map(([num, label]) => (
                <div key={label}>
                  <div className="text-[#FFD100] text-3xl leading-none mb-1" style={ANTON}>{num}</div>
                  <div className="text-white/35 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25">
          <span className="text-[10px] tracking-[0.25em]">اسکرول کنید</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* ── Promo Bar ──────────────────────────────────────────── */}
      <div className="bg-[#FFD100]">
        <div className="max-w-7xl mx-auto px-5 py-3 text-center">
          <p className="text-black text-xs font-bold tracking-wide">
            🛹 ارسال رایگان برای خریدهای بالای ۵۰۰,۰۰۰ تومان &nbsp;|&nbsp; کد تخفیف:{" "}
            <span style={ANTON} className="tracking-widest">SKATE25</span>
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PRODUCTS                                                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section id="products" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">

          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-px bg-[#FFD100]" />
                <span className="text-[#FFD100] text-xs font-bold tracking-[0.25em] uppercase">Products</span>
              </div>
              <h2 className="text-white tracking-tight leading-none"
                style={{ ...ANTON, fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                محصولات ما
              </h2>
            </div>
            <p className="text-white/35 text-xs max-w-[200px] text-left hidden lg:block leading-relaxed">
              انتخاب‌شده‌ترین تجهیزات از بهترین برندهای جهان
            </p>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 mb-10 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-5 py-2.5 text-xs font-bold transition-all duration-200 ${activeCategory === cat.id
                  ? "bg-[#FFD100] text-black"
                  : "border border-white/[0.1] text-white/45 hover:border-white/30 hover:text-white"}`}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id} product={product}
                onOpen={setSelectedProduct} onAddToCart={addToCart}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Bar ──────────────────────────────────────────── */}
      <div className="border-y border-white/[0.06] bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "ارسال سریع", sub: "به سراسر ایران" },
              { icon: Shield, title: "ضمانت اصالت", sub: "۱۰۰٪ اورجینال" },
              { icon: Package, title: "بسته‌بندی ایمن", sub: "محافظت کامل" },
              { icon: Phone, title: "پشتیبانی ۷/۲۴", sub: "همیشه در دسترس" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 border border-[#FFD100]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#FFD100]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="text-xs text-white/30">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* GALLERY                                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section id="gallery" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-[#FFD100]" />
              <span className="text-[#FFD100] text-xs font-bold tracking-[0.25em] uppercase">Gallery</span>
            </div>
            <h2 className="text-white tracking-tight leading-none"
              style={{ ...ANTON, fontSize: "clamp(2rem, 5vw, 4rem)" }}>
              گالری تصاویر
            </h2>
          </div>

          {/* Asymmetric grid row 1 */}
          <div className="grid grid-cols-3 grid-rows-2 gap-2 lg:gap-3 h-[280px] sm:h-[380px] lg:h-[540px]">
            <div className="col-span-2 row-span-2 relative overflow-hidden group bg-[#1A1A1A]">
              <img src="https://images.unsplash.com/photo-1547198152-dde291a08c45?w=900&h=700&fit=crop&auto=format"
                alt="اسکیتباز در حال پرش"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="relative overflow-hidden group bg-[#1A1A1A]">
              <img src="https://images.unsplash.com/photo-1763044936741-49b01fa8885b?w=500&h=350&fit=crop&auto=format"
                alt="اسکیتباز شبانه"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="relative overflow-hidden group bg-[#1A1A1A]">
              <img src="https://images.unsplash.com/photo-1571677594976-153c59b7ee67?w=500&h=350&fit=crop&auto=format"
                alt="تریک حرفه‌ای"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-2 lg:gap-3 mt-2 lg:mt-3">
            <div className="relative overflow-hidden group bg-[#1A1A1A] h-36 lg:h-52">
              <img src="https://images.unsplash.com/photo-1761069234652-9dd7fc92b845?w=500&h=400&fit=crop&auto=format"
                alt="تریک روی پله"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="col-span-2 relative overflow-hidden group bg-[#1A1A1A] h-36 lg:h-52">
              <img src="https://images.unsplash.com/photo-1763044938637-4d04f3f762d0?w=900&h=400&fit=crop&auto=format"
                alt="دو اسکیتباز شبانه"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/60 to-transparent">
                <div>
                  <p className="text-white/45 text-xs mb-0.5">اسکیت شاپ</p>
                  <p className="text-white font-bold text-base leading-tight">جامعه اسکیت‌بوردینگ ایران</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ABOUT                                                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section id="about" className="py-20 lg:py-28 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[3/4] max-w-sm mx-auto lg:ml-0 bg-[#1A1A1A] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1765979275415-c02bbea40456?w=600&h=800&fit=crop&auto=format"
                  alt="اسکیتباز"
                  className="w-full h-full object-cover" />
                {/* Yellow corner badge */}
                <div className="absolute bottom-0 left-0 w-[88px] h-[88px] bg-[#FFD100] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-black text-[1.75rem] leading-none" style={ANTON}>۱۴</div>
                    <div className="text-black text-[9px] font-bold leading-tight">سال<br />تجربه</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-[#FFD100]" />
                <span className="text-[#FFD100] text-xs font-bold tracking-[0.25em] uppercase">About Us</span>
              </div>

              <h2 className="text-white leading-none tracking-tight mb-6"
                style={{ ...ANTON, fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                داستان ما
              </h2>

              <p className="text-white/50 leading-8 mb-5 text-sm lg:text-base">
                اسکیت شاپ از سال ۱۳۹۰ با هدف ارائه بهترین تجهیزات اسکیت‌بورد در ایران فعالیت می‌کند. ما با اشتیاق به این ورزش، تیمی از اسکیتبازان حرفه‌ای تشکیل دادیم تا بهترین انتخاب‌ها را برای شما فراهم کنیم.
              </p>
              <p className="text-white/50 leading-8 mb-10 text-sm lg:text-base">
                از دک‌های آرت تا تجهیزات حرفه‌ای، هر محصول با دقت انتخاب شده تا تجربه سواری شما را به سطح بالاتری ببرد. ما فقط محصول نمی‌فروشیم — ما بخشی از جامعه اسکیت‌بوردینگ ایران هستیم.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-10">
                {[["۱۴+","سال تجربه"],["۵۰۰+","محصول"],["۱۵K+","مشتری"]].map(([num, label]) => (
                  <div key={label} className="border border-white/[0.08] p-4 text-center hover:border-[#FFD100]/30 transition-colors">
                    <div className="text-[#FFD100] text-2xl lg:text-3xl mb-1 leading-none" style={ANTON}>{num}</div>
                    <div className="text-white/35 text-xs">{label}</div>
                  </div>
                ))}
              </div>

              <button onClick={() => scrollTo("contact")}
                className="bg-[#FFD100] text-black font-bold px-8 py-4 text-sm hover:bg-yellow-300 transition-colors">
                تماس با ما
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CONTACT                                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section id="contact" className="py-20 lg:py-28 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-[#FFD100]" />
              <span className="text-[#FFD100] text-xs font-bold tracking-[0.25em] uppercase">Contact</span>
            </div>
            <h2 className="text-white tracking-tight leading-none"
              style={{ ...ANTON, fontSize: "clamp(2rem, 5vw, 4rem)" }}>
              تماس با ما
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Info */}
            <div>
              <p className="text-white/50 leading-8 mb-10 text-sm lg:text-base">
                برای سفارش، مشاوره در انتخاب تجهیزات یا هرگونه سوال با ما در تماس باشید. تیم پشتیبانی ما آماده پاسخگویی است.
              </p>
              <div className="space-y-6">
                {[
                  { icon: MapPin, label: "آدرس", value: "تهران، خیابان ولیعصر، پاساژ اسکیت شاپ، واحد ۱۲" },
                  { icon: Phone, label: "تلفن", value: "۰۲۱-۸۸۸۸۸۸۸۸" },
                  { icon: Mail, label: "ایمیل", value: "info@skateshop.ir" },
                  { icon: Instagram, label: "اینستاگرام", value: "@skateshop.ir" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-[#FFD100]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#FFD100]" />
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-1">{label}</p>
                      <p className="text-white text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/35 text-xs mb-2">نام و نام خانوادگی</label>
                  <input type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="نام شما"
                    className="w-full bg-[#111] border border-white/[0.08] text-white px-4 py-3 text-sm focus:border-[#FFD100] focus:outline-none transition-colors placeholder:text-white/20" />
                </div>
                <div>
                  <label className="block text-white/35 text-xs mb-2">شماره تماس</label>
                  <input type="tel" value={form.phone} dir="ltr"
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="09..."
                    className="w-full bg-[#111] border border-white/[0.08] text-white px-4 py-3 text-sm focus:border-[#FFD100] focus:outline-none transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="block text-white/35 text-xs mb-2">ایمیل</label>
                <input type="email" value={form.email} dir="ltr"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full bg-[#111] border border-white/[0.08] text-white px-4 py-3 text-sm focus:border-[#FFD100] focus:outline-none transition-colors placeholder:text-white/20" />
              </div>
              <div>
                <label className="block text-white/35 text-xs mb-2">پیام شما</label>
                <textarea value={form.message} rows={5}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="پیام خود را بنویسید..."
                  className="w-full bg-[#111] border border-white/[0.08] text-white px-4 py-3 text-sm focus:border-[#FFD100] focus:outline-none transition-colors placeholder:text-white/20 resize-none" />
              </div>
              <button type="submit"
                className="w-full bg-[#FFD100] text-black font-bold py-4 text-sm hover:bg-yellow-300 transition-colors">
                ارسال پیام
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FOOTER                                                  */}
      {/* ═══════════════════════════════════════════════════════ */}
      <footer className="bg-[#080808] border-t border-white/[0.05] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-7 h-7 bg-[#FFD100] flex items-center justify-center">
                  <span className="text-black text-[10px] font-bold" style={ANTON}>SK</span>
                </div>
                <span className="text-lg tracking-widest" style={ANTON}>SKATE SHOP</span>
              </div>
              <p className="text-white/30 text-xs leading-7 mb-6">
                بهترین فروشگاه تجهیزات اسکیت‌بورد در ایران. کیفیت، اصالت، تجربه.
              </p>
              <div className="flex gap-4">
                {[Instagram, Youtube, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="text-white/25 hover:text-[#FFD100] transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-5">محصولات</h4>
              <ul className="space-y-3">
                {["دک اسکیت","کفش اسکیت","چرخ و ترک","لوازم ایمنی","پوشاک"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/30 hover:text-white transition-colors text-xs">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-5">اطلاعات</h4>
              <ul className="space-y-3">
                {["درباره ما","تماس با ما","سوالات متداول","نحوه ارسال","شرایط بازگشت"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/30 hover:text-white transition-colors text-xs">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-5">خبرنامه</h4>
              <p className="text-white/25 text-xs leading-6 mb-4">
                برای دریافت آخرین اخبار و تخفیف‌ها ثبت‌نام کنید.
              </p>
              <div className="flex">
                <input type="email" placeholder="ایمیل شما" dir="ltr"
                  className="flex-1 min-w-0 bg-[#111] border border-white/[0.08] text-white px-3 py-2.5 text-xs focus:border-[#FFD100] focus:outline-none placeholder:text-white/20" />
                <button className="bg-[#FFD100] text-black px-3 py-2.5 text-xs font-bold hover:bg-yellow-300 transition-colors flex-shrink-0">
                  ثبت
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs">
              © {toPerNum(2025)} اسکیت شاپ. تمامی حقوق محفوظ است.
            </p>
            <div className="flex gap-6">
              {["حریم خصوصی","شرایط استفاده"].map((item) => (
                <a key={item} href="#" className="text-white/20 hover:text-white/50 transition-colors text-xs">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
           {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111] border border-white/[0.08] max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div>
                <h2 className="text-white text-xl font-bold">تکمیل خرید</h2>
                <p className="text-white/40 text-xs mt-1">
                  اطلاعات ارسال سفارش را وارد کنید
                </p>
              </div>

              <button
                onClick={() => setCheckoutOpen(false)}
                className="text-white/50 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-5">

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  نام و نام خانوادگی
                </label>
                <input
  type="text"
  placeholder="نام خود را وارد کنید"
  value={checkoutForm.name}
  onChange={(e) =>
    setCheckoutForm((prev) => ({ ...prev, name: e.target.value }))
  }
  className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-3 outline-none focus:border-[#FFD100]"
/>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  شماره تماس
                </label>
              <input
  type="tel"
  placeholder="09xxxxxxxxx"
  value={checkoutForm.phone}
  onChange={(e) =>
    setCheckoutForm((prev) => ({ ...prev, phone: e.target.value }))
  }
  className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-3 outline-none focus:border-[#FFD100]"
/>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  آدرس
                </label>
                <textarea
  rows={4}
  placeholder="آدرس کامل برای ارسال سفارش"
  value={checkoutForm.address}
  onChange={(e) =>
    setCheckoutForm((prev) => ({ ...prev, address: e.target.value }))
  }
  className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-3 outline-none resize-none focus:border-[#FFD100]"
/>
              </div>

              <div className="border-t border-white/[0.06] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm">مبلغ سفارش</span>
                  <span className="text-[#FFD100] font-bold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#FFD100] text-black font-bold py-4 hover:bg-yellow-300 transition-colors"
              >
                ادامه و ثبت سفارش
              </button>

            </div>
          </div>
        </div>
      )} 
      {/* Order Confirmation */}
{orderComplete && (
  <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="w-full max-w-lg bg-[#111] border border-white/[0.08]">

      <div className="p-6 text-center border-b border-white/[0.06]">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FFD100] flex items-center justify-center">
          <span className="text-black text-3xl font-bold">✓</span>
        </div>

        <h2 className="text-white text-2xl font-bold">
          سفارش آماده شد
        </h2>

        <p className="text-white/50 text-sm mt-2 leading-6">
          سفارش شما آماده ارسال در WhatsApp است.
          <br />
          پیام سفارش را در WhatsApp ارسال کنید.
        </p>
      </div>

      <div className="p-6 space-y-5">

        <div className="bg-white/[0.04] border border-white/[0.06] p-4 text-center">
          <p className="text-white/40 text-xs mb-2">
            شماره سفارش
          </p>

          <p className="text-[#FFD100] text-xl font-bold tracking-wider">
            {lastOrderNumber}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/50 text-sm">
              تعداد کالا
            </span>

            <span className="text-white font-bold">
              {totalItems}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm">
              مبلغ کل
            </span>

            <span className="text-[#FFD100] font-bold">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
  setOrderComplete(false);
  setCheckoutOpen(false);
  setCartOpen(false);
  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth",
  });
}}
          className="w-full bg-[#FFD100] text-black font-bold py-4 hover:bg-yellow-300 transition-colors"
        >
          ادامه خرید
        </button>

        <button
          onClick={() => {
            const savedOrder = localStorage.getItem("skateShopLastOrder");

            if (savedOrder) {
              alert(
                `شماره سفارش شما:\n${lastOrderNumber}\n\nسفارش در مرورگر شما ذخیره شده است.`
              );
            }
          }}
          className="w-full border border-white/[0.12] text-white py-4 hover:bg-white/[0.05] transition-colors"
        >
          پیگیری سفارش
        </button>

      </div>
    </div>
  </div>
)}
      {/* My Order */}
<AnimatePresence>
  {myOrderOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setMyOrderOpen(false)}
        className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-3 sm:inset-6 lg:inset-10 z-[130] flex items-center justify-center pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#111] border border-white/[0.08]">

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
            <div>
              <h2 className="text-white text-xl font-bold">
                سفارش من
              </h2>

              <p className="text-white/40 text-xs mt-1">
                اطلاعات آخرین سفارش شما
              </p>
            </div>

            <button
              onClick={() => setMyOrderOpen(false)}
              className="p-2 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!myOrder ? (
            /* Empty State */
            <div className="p-10 text-center">
              <Package className="w-12 h-12 mx-auto mb-5 text-white/20" />

              <h3 className="text-white text-lg font-bold mb-2">
                هنوز سفارشی ثبت نشده است
              </h3>

              <p className="text-white/40 text-sm leading-7 mb-7">
                بعد از ثبت سفارش، اطلاعات سفارش شما در این قسمت نمایش داده می‌شود.
              </p>

              <button
                onClick={() => {
                  setMyOrderOpen(false);
                  document.getElementById("products")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="bg-[#FFD100] text-black font-bold px-7 py-3 text-sm hover:bg-yellow-300 transition-colors"
              >
                مشاهده محصولات
              </button>
            </div>
          ) : (
            /* Order Data */
            <div className="p-5 space-y-5">

              {/* Order Number + Status */}
              <div className="grid sm:grid-cols-2 gap-3">

                <div className="bg-white/[0.04] border border-white/[0.06] p-4">
                  <p className="text-white/35 text-xs mb-2">
                    شماره سفارش
                  </p>

                  <p className="text-[#FFD100] font-bold tracking-wider">
                    {toPerNum(myOrder.orderNumber)}
                  </p>
                </div>

                <div className="bg-white/[0.04] border border-white/[0.06] p-4">
                  <p className="text-white/35 text-xs mb-2">
                    وضعیت سفارش
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFD100]" />

                    <p className="text-white text-sm font-bold">
                      در انتظار تأیید فروشنده
                    </p>
                  </div>
                </div>

              </div>

              {/* Products */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold text-sm">
                    محصولات سفارش
                  </h3>

                  <span className="text-white/35 text-xs">
                    {toPerNum(
                      myOrder.items?.reduce(
                        (sum: number, item: CartItem) =>
                          sum + item.quantity,
                        0
                      ) || 0
                    )}{" "}
                    کالا
                  </span>
                </div>

                <div className="space-y-2">
                  {myOrder.items?.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-16 object-cover bg-[#222] flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate">
                          {item.name}
                        </p>

                        <p className="text-white/35 text-xs mt-1">
                          تعداد: {toPerNum(item.quantity)}
                        </p>
                      </div>

                      <div className="text-[#FFD100] text-xs font-bold text-left">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-white font-bold text-sm mb-3">
                  اطلاعات سفارش
                </h3>

                <div className="bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-white/35 text-xs">
                      نام
                    </span>

                    <span className="text-white text-sm text-left">
                      {myOrder.customer?.name || "-"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-white/35 text-xs">
                      شماره تماس
                    </span>

                    <span className="text-white text-sm text-left" dir="ltr">
                      {myOrder.customer?.phone || "-"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-white/35 text-xs">
                      آدرس
                    </span>

                    <span className="text-white/70 text-sm text-left leading-6 max-w-[70%]">
                      {myOrder.customer?.address || "-"}
                    </span>
                  </div>

                </div>
              </div>

              {/* Total */}
              <div className="border-t border-white/[0.06] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm">
                    مبلغ کل سفارش
                  </span>

                  <span className="text-[#FFD100] text-xl font-bold">
                    {formatPrice(myOrder.total || 0)}
                  </span>
                </div>
              </div>

              {/* Status Notice */}
              <div className="bg-[#FFD100]/[0.06] border border-[#FFD100]/20 p-4">
                <p className="text-[#FFD100] text-sm font-bold mb-1">
                  وضعیت فعلی سفارش
                </p>

                <p className="text-white/45 text-xs leading-6">
                  سفارش شما در مرورگر ذخیره شده و پیام سفارش برای فروشنده آماده شده است.
                  تأیید نهایی سفارش توسط فروشنده انجام می‌شود.
                </p>
              </div>

              {/* Continue Shopping */}
              <button
                onClick={() => {
                  setMyOrderOpen(false);
                  document.getElementById("products")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="w-full bg-[#FFD100] text-black font-bold py-4 hover:bg-yellow-300 transition-colors"
              >
                ادامه خرید
              </button>

            </div>
          )}

        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </div>
  );
}
              
