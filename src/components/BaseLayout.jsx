import React from 'react';

const BaseLayout = ({children}) =>{

    return (
        <div className="bg-blue-350 min-h-screen">


            {children}
        </div>
    );
};

export default BaseLayout;