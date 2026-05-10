// src/useLargeFont.js
import { useState } from 'react';

function useLargeFont() {
    const [isLargeFont, setIsLargeFont] = useState(false);

    const toggleLargeFont = () => {
        setIsLargeFont(prev => {
            const next = !prev;
            if (next) {
                document.documentElement.setAttribute('data-font', 'large');
            } else {
                document.documentElement.removeAttribute('data-font');
            }
            return next;
        });
    };

    return { isLargeFont, toggleLargeFont };
}

export default useLargeFont;