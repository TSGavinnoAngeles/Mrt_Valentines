import React from "react";

interface ModalProps { 
    isOpen: Boolean; 
    onClose: ()=> void;
    children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, children}) => { 

    const overlayClasses = isOpen? 'fixed inset-0 bg-gray-500 bg-opacity-75 z-40': 'hidden '; 
    const modalClasses = isOpen ?  'fixed inset-0 flex items-center justify-center' : 'hidden';

    return (

        <div className={overlayClasses} onClick={onClose}>
        <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
          <div className="bg-white p-8 max-w-md mx-auto rounded shadow-lg ">
            {children}
            <div className ="flex justify-center mt-4">
            <button className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-slate-500 text-white " onClick={onClose}>
              Close
            </button>
            </div>
          </div>
        </div>
      </div>
    );
}
export default Modal;