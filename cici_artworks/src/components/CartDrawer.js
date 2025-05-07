"use client";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from 'react-i18next';
import { useCart } from "./CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart } = useCart();
  const { t } = useTranslation();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Gestion du body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }

    return () => {
      document.body.classList.remove('drawer-open');
    };
  }, [isOpen]);

  if (typeof window === "undefined") return null;

  const drawerRoot = document.getElementById("drawer-root");
  if (!drawerRoot) return null;

  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <>
          <div
            className="cart-overlay"
            onClick={onClose}
          />

          <div
            className={`cart-drawer ${isOpen ? "open" : ""}`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart-header">
              <h3>{t('cart.title')}</h3>
              <button onClick={onClose} className="cart-close">✖</button>
            </div>

            <div className="cart-content">
              {cartItems.length === 0 ? (
                <p className="empty">{t('cart.empty')}</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div>
                      <p className="name">{item.name}</p>
                      <p className="details">{item.price}€ x {item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="remove">{t('cart.delete')}</button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <p className="total">{t('cart.total')} {total.toFixed(2)}€</p>
                <button className="checkout">{t('cart.checkout')}</button>
              </div>
            )}
          </div>
        </>
      )}
    </>,
    drawerRoot
  );
};

export default CartDrawer;