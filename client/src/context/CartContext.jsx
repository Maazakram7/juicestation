import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'juicestation-cart';

// Cart state shape: { items: [{ id, name, price, qty, meta? }], isOpen: bool }
const initialState = {
  items: [],
  isOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload || [] };
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
          isOpen: true,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: 1 }],
        isOpen: true,
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i))
          .filter((i) => i.qty > 0),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen };
    case 'CLOSE':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: 'HYDRATE', payload: JSON.parse(stored) });
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const total = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = state.items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        total,
        count,
        add: (item) => dispatch({ type: 'ADD', payload: item }),
        remove: (id) => dispatch({ type: 'REMOVE', payload: id }),
        updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } }),
        clear: () => dispatch({ type: 'CLEAR' }),
        toggle: () => dispatch({ type: 'TOGGLE' }),
        close: () => dispatch({ type: 'CLOSE' }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
