/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Clock, 
  Leaf, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Gift,
  ChevronRight,
  ArrowLeft,
  Timer
} from 'lucide-react';
import { MENU_ITEMS, DELIVERY_TIME_LIMIT, PENALTY_ITEM } from './constants';
import { MenuItem, CartItem, Order, OrderStatus } from './types';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(DELIVERY_TIME_LIMIT);
  const [showPenalty, setShowPenalty] = useState(false);

  // Cart logic
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  [cart]);

  // Order logic
  const placeOrder = () => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cart],
      total: cartTotal,
      startTime: Date.now(),
      status: 'preparing',
      penaltyAwarded: false
    };
    setActiveOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
    setTimeLeft(DELIVERY_TIME_LIMIT);
  };

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (activeOrder && activeOrder.status !== 'delivered') {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeOrder.startTime) / 1000);
        const remaining = Math.max(0, DELIVERY_TIME_LIMIT - elapsed);
        setTimeLeft(remaining);

        if (remaining === 0 && !activeOrder.penaltyAwarded) {
          setActiveOrder(prev => prev ? { ...prev, status: 'late', penaltyAwarded: true } : null);
          setShowPenalty(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeOrder]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (activeOrder) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setActiveOrder(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="bg-brand-600 p-8 text-white text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Timer className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Tracking Order</h2>
              <p className="opacity-90">Order ID: #{activeOrder.id}</p>
            </div>

            <div className="p-8">
              <div className="flex flex-col items-center mb-12">
                <div className={`text-6xl font-mono font-bold mb-4 ${timeLeft === 0 ? 'text-red-500' : 'text-slate-800'}`}>
                  {formatTime(timeLeft)}
                </div>
                <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">
                  {timeLeft > 0 ? 'Estimated Delivery Time' : 'Delivery Delayed'}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Order Received</h3>
                    <p className="text-slate-500 text-sm">We've received your order and it's being processed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${timeLeft > 1200 ? 'bg-slate-100 text-slate-400' : 'bg-brand-100 text-brand-600'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${timeLeft > 1200 ? 'text-slate-400' : 'text-slate-800'}`}>Preparing your meal</h3>
                    <p className="text-slate-500 text-sm">Our chefs are crafting your vegetarian delights.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${timeLeft > 300 ? 'bg-slate-100 text-slate-400' : 'bg-brand-100 text-brand-600'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${timeLeft > 300 ? 'text-slate-400' : 'text-slate-800'}`}>Out for delivery</h3>
                    <p className="text-slate-500 text-sm">Your rider is on the way to your location.</p>
                  </div>
                </div>
              </div>

              {activeOrder.penaltyAwarded && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-12 p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900">Penalty Reward Activated!</h4>
                    <p className="text-amber-700 text-sm">We're late, so we've added a <strong>{PENALTY_ITEM.name}</strong> to your order for free!</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showPenalty && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
              >
                <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">We're Sorry!</h3>
                <p className="text-slate-600 mb-8">
                  Your delivery is taking longer than 30 minutes. As promised, you've earned a <strong>{PENALTY_ITEM.name}</strong> on us!
                </p>
                <button 
                  onClick={() => setShowPenalty(false)}
                  className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                >
                  Great, Thanks!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
              <Leaf className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">VeggieSwift</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-slate-500 bg-slate-100 px-4 py-2 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4 text-brand-600" />
              30 Min Delivery Guarantee
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-white border border-slate-200 rounded-xl hover:border-brand-500 transition-colors shadow-sm group"
            >
              <ShoppingBag className="w-6 h-6 text-slate-700 group-hover:text-brand-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-block px-4 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-bold mb-6">
                100% Vegetarian
              </span>
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Fresh, Green & <span className="text-brand-600">Swiftly</span> Delivered.
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-lg">
                Experience the finest vegetarian cuisine delivered to your doorstep in under 30 minutes. If we're late, the dessert is on us!
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-200 hover:scale-105 active:scale-95">
                  Order Now
                </button>
                <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-slate-200">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Late Penalty</p>
                    <p className="text-sm font-bold text-slate-900">Free Bonus Item</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
                <img 
                  src="https://picsum.photos/seed/veggie-food/800/800" 
                  alt="Delicious Veggie Food" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-[200px] -rotate-3">
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-3 bg-brand-500 rounded-full" />)}
                </div>
                <p className="text-sm font-bold text-slate-800">"Best vegetarian delivery in town!"</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Our Menu</h3>
              <p className="text-slate-500">Handpicked vegetarian delicacies for every mood.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'].map(cat => (
                <button 
                  key={cat}
                  className="px-6 py-2 rounded-full border border-slate-200 text-sm font-bold hover:border-brand-500 hover:text-brand-600 transition-colors whitespace-nowrap"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MENU_ITEMS.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-slate-50 rounded-[2rem] overflow-hidden border border-transparent hover:border-brand-200 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-700">
                    {item.category}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[2.5rem]">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">${item.price}</span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-100 active:scale-90"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Your Cart</h3>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Plus className="w-6 h-6 rotate-45 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">Your cart is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-brand-600 font-bold hover:underline"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-bold text-slate-900">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-500 mb-3">${item.price}</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Delivery Fee</span>
                      <span className="text-brand-600 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={placeOrder}
                    className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-200 flex items-center justify-center gap-2 group"
                  >
                    Place Order
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
                    30 Min Guarantee Applied
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white">
                <Leaf className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">VeggieSwift</h2>
            </div>
            <p className="text-slate-400 max-w-md mb-8">
              The world's fastest vegetarian food delivery service. We believe in fresh ingredients, sustainable practices, and keeping our promises.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-brand-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Our Menu</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Delivery Areas</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-800 text-center text-slate-500 text-sm">
          © 2026 VeggieSwift Delivery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
