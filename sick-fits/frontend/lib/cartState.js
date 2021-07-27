import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // this is our own custom provider! we will store data (State
  // functionalityu (updates) in here and anyone can access it from the
  // concumer

  // closed by default
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider
      value={{ cartOpen, setCartOpen, toggleCart, openCart, closeCart }}
    >
      {children}
    </LocalStateProvider>
  );
}

// create a custom hook to access the cart lcoal state
function useCart() {
  // we use a consumer here to access the local state
  const all = useContext(LocalStateContext);
  return all;
}
export { CartStateProvider, useCart };
