import React from 'react';

const Base = () =>{
    // Debugging boolean
    const inDebugMode = true;

    return (
        <div>
            {inDebugMode && <h1>This is the base component.</h1>}
        </div>
    );
};

export default Base;