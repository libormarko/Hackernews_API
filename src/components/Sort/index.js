import React from 'react';
import Button from 'components/Button/index';
import classNames from 'classnames';  // A library to define sortClass more efficiently.
import './index.css';

const Sort = ({
    sortKey,
    activeSortKey,
    onSort,
    children
}) => {
    // Define className with conditional classes.
    // In case it is sorted, gives extra classname attribute--visual feedback to a user.
    const sortClass = classNames(
        'button-inline',
        { 'button-active': sortKey === activeSortKey }
    );

    return (
        <Button
            onClick={() => onSort(sortKey)}
            className={sortClass}
        >
            {children}
        </Button>
    );
}

export default Sort;