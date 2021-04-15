import React, { useState } from "react";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import Products from "./Products";
import { Routes, Route } from "react-router-dom";
import Cart from "./Cart";
import Detail from "./Detail";

export default function App() {
  const [ cart, setCart ] = useState([]);

  function addToCart(id, sku) {
    // bolje je sa funckijom napraviti hook jer ako stavimo cart mozda nece biti current state
    setCart( (items) => {
      const itemInCart = items.find((i) =>  i.sku === sku);
      if(itemInCart) {
        return items.map((i) => i.sku === sku ? {...i, quantity: i.quantity + 1} : i)
      } else {
        // Return new  array with the new item appended
        return [...items, { id, sku, quantity: 1}];
      }
    })
  }

  return (
    <>
      <div className="content">
        <Header />
        <main>
          <Routes>
            <Route path="/:category" element={<Products />}/>
            <Route path="/:category/:id" element={<Detail addToCart={addToCart} />}/>
            <Route path="/cart" element={<Cart />}/>
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}
