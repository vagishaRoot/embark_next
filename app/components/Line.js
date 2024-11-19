import React from 'react'

const Line = ({width, fullLine,  notHidden=undefined}) => {


    return (
        <>
            <div className={`flex items-center${fullLine ? ' w-[99%]' : ''}${!!notHidden ? '':' max-650:hidden'}`}>

                <span className="h-2 w-2 bg-black rotate-45"></span>

                <span className={`h-0.5  bg-black`} style={{width}} ></span>


                <span className="h-2 w-2 bg-black rotate-45"></span>
            </div>
        </>
    )
}

export default Line
