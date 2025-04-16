// src/components/CartDrawer.jsx
import React from "react";
import { useCart } from "../context/CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`fixed top-0 right-0 h-full bg-white shadow-lg w-80 z-50 transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">Votre panier</h2>
        <button onClick={onClose} className="text-red-500 text-2xl">✖</button>
      </div>

      <div className="p-4 overflow-y-auto">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Votre panier est vide.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.price}€ x {item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500">Supprimer</button>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <p className="font-bold mb-2">Total: {total.toFixed(2)}€</p>
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
            Procéder au paiement
          </button>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
