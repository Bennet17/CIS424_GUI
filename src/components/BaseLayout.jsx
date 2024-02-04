import React from 'react';

const BaseLayout = ({children}) =>{
    // Debugging boolean
    const inDebugMode = false;

    return (
        <div className="bg-blue-350 min-h-screen">
            {inDebugMode && <h1>This is the base component.</h1>}


            {children}
        </div>
    );
};

export default BaseLayout;