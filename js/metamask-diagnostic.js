// MetaMask Diagnostic Script
console.log('MetaMask Diagnostic Script loaded');

// Function to check MetaMask availability
function checkMetaMask() {
    console.log('Checking MetaMask availability...');
    
    if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask is not installed or not detected');
        return false;
    }
    
    console.log('MetaMask is available');
    console.log('MetaMask version:', window.ethereum.version);
    console.log('MetaMask isMetaMask:', window.ethereum.isMetaMask);
    
    return true;
}

// Function to check if we can access MetaMask methods
function checkMetaMaskMethods() {
    console.log('Checking MetaMask methods...');
    
    if (!checkMetaMask()) {
        return;
    }
    
    // Check if we can access common MetaMask methods
    const methods = [
        'request',
        'on',
        'removeListener',
        'isConnected',
        'selectedAddress',
        'networkVersion'
    ];
    
    methods.forEach(method => {
        if (typeof window.ethereum[method] === 'function') {
            console.log(`Method '${method}' is available as a function`);
        } else if (typeof window.ethereum[method] !== 'undefined') {
            console.log(`Property '${method}' is available:`, window.ethereum[method]);
        } else {
            console.error(`Method/property '${method}' is not available`);
        }
    });
}

// Function to check if we can connect to MetaMask
function testMetaMaskConnection() {
    console.log('Testing MetaMask connection...');
    
    if (!checkMetaMask()) {
        return;
    }
    
    // Try to connect to MetaMask
    try {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(accounts => {
                console.log('Successfully connected to MetaMask');
                console.log('Accounts:', accounts);
                
                if (accounts.length > 0) {
                    console.log('Selected account:', accounts[0]);
                }
            })
            .catch(error => {
                console.error('Error connecting to MetaMask:', error);
            });
    } catch (error) {
        console.error('Exception when trying to connect to MetaMask:', error);
    }
}

// Run diagnostics when the script is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Running MetaMask diagnostics...');
    
    // Check MetaMask availability
    checkMetaMask();
    
    // Check MetaMask methods
    checkMetaMaskMethods();
    
    // Test MetaMask connection
    testMetaMaskConnection();
    
    // Add a button to run diagnostics manually
    const diagnosticButton = document.createElement('button');
    diagnosticButton.textContent = 'Run MetaMask Diagnostics';
    diagnosticButton.style.position = 'fixed';
    diagnosticButton.style.bottom = '10px';
    diagnosticButton.style.right = '10px';
    diagnosticButton.style.zIndex = '9999';
    diagnosticButton.style.padding = '10px';
    diagnosticButton.style.backgroundColor = '#4CAF50';
    diagnosticButton.style.color = 'white';
    diagnosticButton.style.border = 'none';
    diagnosticButton.style.borderRadius = '4px';
    diagnosticButton.style.cursor = 'pointer';
    
    diagnosticButton.addEventListener('click', function() {
        console.log('Running MetaMask diagnostics manually...');
        checkMetaMask();
        checkMetaMaskMethods();
        testMetaMaskConnection();
    });
    
    document.body.appendChild(diagnosticButton);
}); 