import React from 'react';
import Loading from 'components/Loading/index';
import Button from 'components/Button/index';

// Simple HOC that takes a component as input and returns a component.
// Convention is to prefix a HOC with with.
// Conditional rendering is a great use case for an HOC. Or improved reusability of components, manipulations of props, state and view.
// The output componenet shows the Loading component when the loading state is true,
// otherwise it shows the input component.
const withLoading = (Component) => ({ isLoading, ...rest }) =>
    isLoading
        ? <Loading />
        : <Component {...rest} />;  // Using the object spread operator to pass all object properties, and rest ES6 destructuring.

const ButtonWithLoading = withLoading(Button);

export default ButtonWithLoading;