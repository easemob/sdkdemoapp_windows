import React from 'react';

const wdyu = false;

if (wdyu && rocess.env.NODE_ENV !== 'production') {
    try {
        const {whyDidYouUpdate} = __non_webpack_require__('why-did-you-update'); // eslint-disable-line
        whyDidYouUpdate(React);
    } catch (error) {
        console.warn('Cannot find the debug module why-did-you-update.');
    }
}
