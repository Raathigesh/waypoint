import { useState, useEffect } from 'react';

export function useKeyPress(targetKey: string, onKeyDown: (e: any) => void) {
    // If pressed key is our target key then set to true
    function downHandler(e: any) {
        if (e.key === targetKey) {
            onKeyDown(e);
        }
    }

    // If released key is our target key then set to false
    const upHandler = ({ key }: any) => {
        if (key === targetKey) {
        }
    };

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount
}
