import { ethers } from 'ethers';

export const ethers_provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

export const ethers_signer = ethers_provider.getSigner();
