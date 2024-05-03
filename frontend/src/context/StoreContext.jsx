import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItem, setCartItem] = useState(() => {
        // Initialize state from localStorage if available
        const localData = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : {};
    });

    useEffect(() => {
        // Save to localStorage whenever cartItem changes
        localStorage.setItem('cart', JSON.stringify(cartItem));
    }, [cartItem]);

    const addToCart = (itemId) => {
        if (!cartItem[itemId]) {
            setCartItem(prev => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItem(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
    }

    const removeFromCart = (itemId) => {
        setCartItem(prev => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }

    const getTotalCartAmount = () => {
        return food_list.reduce((total, item) => {
            const quantity = cartItem[item._id];
            return quantity > 0 ? total + item.price * quantity : total;
        }, 0);
    };

    const contextValue = {
        food_list,
        cartItem,
        setCartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider;
