import React from 'react';
import { Oval } from 'react-loader-spinner';

function LoadingComponent() {
	return (
		<div className="h-full w-full flex items-center justify-center">
			<Oval height="40" width="40" color="white" ariaLabel="loading" secondaryColor="" />
		</div>
	);
}

export default LoadingComponent;
