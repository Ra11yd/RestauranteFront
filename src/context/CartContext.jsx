import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // Tenta extrair o slug da URL para salvar carrinhos por loja
  const slug = location.pathname.split('/')[2];

  useEffect(() => {
    if (slug) {
      const savedCart = localStorage.getItem(`cart-${slug}`);
      if (savedCart) setCart(JSON.parse(savedCart));
      else setCart([]);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) localStorage.setItem(`cart-${slug}`, JSON.stringify(cart));
  }, [cart, slug]);

  const addToCart = (productToAdd) => {
    setCart(prevCart => {
        const existingProduct = prevCart.find(item => item.cartItemId === productToAdd.cartItemId);
        if (existingProduct) {
          return prevCart.map(item => item.cartItemId === productToAdd.cartItemId ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prevCart, { ...productToAdd, quantity: 1 }];
    });
  };
  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart => prevCart.map(item => item.cartItemId === cartItemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };
  const deleteItem = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  const value = { cart, setCart, isCartOpen, addToCart, updateQuantity, deleteItem, openCart, closeCart, totalItemsInCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);