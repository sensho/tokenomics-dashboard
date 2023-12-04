import React from 'react';

const Modal = ({ children }) => {
	return (
		<div className="fixed z-0 bg-black bg-opacity-70 top-0 left-0 w-screen h-screen flex justify-center items-center">
			<div className="rounded z-10 p-3 opacity-100 bg-white text-black max-h-96 overflow-y-auto">{children}</div>
		</div>
	);
};

export default Modal;
