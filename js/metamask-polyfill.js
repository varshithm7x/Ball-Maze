// MetaMask Polyfill
console.log('MetaMask Polyfill loaded');

// Create a simplified interface to the MetaMask provider
const MetaMaskPolyfill = {
    // Check if MetaMask is available
    isAvailable: function() {
        return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask === true;
    },
    
    // Get the current account
    getCurrentAccount: function() {
        if (!this.isAvailable()) {
            return null;
        }
        
        return window.ethereum.selectedAddress;
    },
    
    // Get the network version
    getNetworkVersion: function() {
        if (!this.isAvailable()) {
            return null;
        }
        
        return window.ethereum.networkVersion;
    },
    
    // Connect to MetaMask
    connect: function() {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable()) {
                reject(new Error('MetaMask is not available'));
                return;
            }
            
            // Use a direct approach to request accounts
            try {
                // Create a simple event listener for account changes
                const accountChangeHandler = (accounts) => {
                    if (accounts.length > 0) {
                        window.ethereum.removeListener('accountsChanged', accountChangeHandler);
                        resolve(accounts[0]);
                    }
                };
                
                // Add the event listener
                window.ethereum.on('accountsChanged', accountChangeHandler);
                
                // Request accounts
                window.ethereum.request({ method: 'eth_requestAccounts' })
                    .then(accounts => {
                        if (accounts.length > 0) {
                            window.ethereum.removeListener('accountsChanged', accountChangeHandler);
                            resolve(accounts[0]);
                        } else {
                            window.ethereum.removeListener('accountsChanged', accountChangeHandler);
                            reject(new Error('No accounts found'));
                        }
                    })
                    .catch(error => {
                        window.ethereum.removeListener('accountsChanged', accountChangeHandler);
                        reject(error);
                    });
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Send a transaction
    sendTransaction: function(transactionParameters) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable()) {
                reject(new Error('MetaMask is not available'));
                return;
            }
            
            try {
                window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                })
                .then(txHash => {
                    resolve(txHash);
                })
                .catch(error => {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
};

// Make the polyfill available globally
window.MetaMaskPolyfill = MetaMaskPolyfill;

console.log('MetaMask Polyfill initialized'); 