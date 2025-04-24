// Simple test file to verify if ethers.js is working properly
console.log('Ethers test file loaded');

// Check if ethers is defined
if (typeof ethers !== 'undefined') {
    console.log('Ethers.js is loaded in the test file');
    console.log('Ethers version:', ethers.version);
    
    // Try to create a simple provider
    try {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log('Web3Provider created successfully');
        } else {
            console.log('MetaMask is not installed');
        }
    } catch (error) {
        console.error('Error creating Web3Provider:', error);
    }
} else {
    console.error('Ethers.js is not loaded in the test file');
} 