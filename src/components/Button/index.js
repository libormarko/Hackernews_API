import React from 'react';
import './index.css';

const Button = ({ onClick, className, children }) => {
    return (
        <button
            onClick={onClick}
            className={className}
            type="button"
        >
            {children}
        </button>
    );
}

export default Button;