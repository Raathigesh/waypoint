import { useState, useEffect } from "react";

export function useKeyPress(targetKey: string, onKeyDown: (e: any) => void) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  function downHandler(e: any) {
    if (e.key === targetKey) {
      console.log(e.key);
      setKeyPressed(true);
      onKeyDown(e);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }: any) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}
