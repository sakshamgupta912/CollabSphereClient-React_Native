// SharedStateContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the context
const SharedStateContext = createContext();

// Define a custom hook to access the context
export const useSharedState = () => useContext(SharedStateContext);

// Create the provider component
export const SharedStateProvider = ({ children }) => {
  // Define your shared state variables
  const [state, setState] = useState(0);

  // Define methods to update the state
  const updateState = (newState) => {
    setState(newState);
  };

  // Return the context provider with state and methods
  return (
    <SharedStateContext.Provider value={{ state, updateState }}>
      {children}
    </SharedStateContext.Provider>
  );
};
