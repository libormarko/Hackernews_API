import React from 'react';

// Functional stateless component written in ES6 syntax, aka destructuring, the arrow function and others..
// In a JavaScript ES6 arrow function you can omit the curly braces. You transform the block body to a concise body. 
// In a concise body you can omit the return statement because it will implicitly return.
const Search = ({ value, onChange, onSubmit, children }) => 
        <form onSubmit={onSubmit}>
            <input
                type="text"
                value={value}
                onChange={onChange}
            />
            <button type='submit'>
                {children}
            </button>
        </form>

export default Search;