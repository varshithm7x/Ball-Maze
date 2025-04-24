// NFT Minting functionality using Web3.js and MetaMask

// Contract configuration - will be loaded dynamically
let CONTRACT_CONFIG = {
    address: null,
    abi: [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "score",
                    "type": "uint256"
                }
            ],
            "name": "mint",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
};

// Load contract address from configuration
function loadContractConfig() {
    // For development, you can set a default address
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDev) {
        // Only use this for local development
        CONTRACT_CONFIG.address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        console.log('Development mode: Using local contract address');
    } else {
        // In production, load from environment or deployed config
        // You should create a config.js file that is gitignored
        try {
            if (window.contractConfig && window.contractConfig.address) {
                CONTRACT_CONFIG.address = window.contractConfig.address;
                console.log('Loaded contract address from config');
            } else {
                console.warn('No contract address found in config, NFT minting will be disabled');
            }
        } catch (error) {
            console.error('Failed to load contract configuration', error);
        }
    }
}

let web3;
let contract;
let userAccount;

// Update wallet status UI
function updateWalletStatus(connected, account = null, message = '') {
    const statusElement = document.getElementById('wallet-status');
    const connectButton = document.getElementById('connect-wallet');
    
    if (!statusElement || !connectButton) {
        console.error('Wallet UI elements not found');
        return;
    }
    
    if (connected && account) {
        statusElement.textContent = `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`;
        statusElement.style.color = 'green';
        connectButton.textContent = 'Connected';
        connectButton.disabled = true;
    } else {
        statusElement.textContent = message || 'Not connected';
        statusElement.style.color = 'red';
        connectButton.textContent = 'Connect MetaMask';
        connectButton.disabled = false;
    }
}

// Initialize Web3 and contract
async function initializeWeb3() {
    if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask is not installed');
        updateWalletStatus(false, null, 'Please install MetaMask');
        return false;
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        
        // Create Web3 instance
        web3 = new Web3(window.ethereum);
        
        // Check if contract address is available
        if (!CONTRACT_CONFIG.address) {
            console.error('Contract address not configured');
            updateWalletStatus(false, null, 'NFT minting not available');
            return false;
        }
        
        // Create contract instance
        contract = new web3.eth.Contract(CONTRACT_CONFIG.abi, CONTRACT_CONFIG.address);
        
        // Update UI with connected status
        updateWalletStatus(true, userAccount);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', function (accounts) {
            if (accounts.length === 0) {
                // User disconnected
                userAccount = null;
                updateWalletStatus(false, null, 'Wallet disconnected');
            } else {
                // User switched accounts
                userAccount = accounts[0];
                updateWalletStatus(true, userAccount);
            }
        });
        
        // Listen for chain changes
        window.ethereum.on('chainChanged', function () {
            window.location.reload();
        });
        
        console.log('Web3 initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Web3:', error);
        updateWalletStatus(false, null, 'Failed to connect wallet');
        return false;
    }
}

// Function to connect wallet
async function connectWallet() {
    const connectButton = document.getElementById('connect-wallet');
    if (!connectButton) {
        console.error('Connect button not found');
        return;
    }

    connectButton.disabled = true;
    connectButton.textContent = 'Connecting...';
    
    try {
        const success = await initializeWeb3();
        if (!success) {
            connectButton.disabled = false;
            connectButton.textContent = 'Connect MetaMask';
            updateWalletStatus(false, null, 'Connection failed');
        }
    } catch (error) {
        console.error('Error connecting wallet:', error);
        updateWalletStatus(false, null, 'Failed to connect wallet');
        connectButton.disabled = false;
        connectButton.textContent = 'Connect MetaMask';
    }
}

// Function to mint NFT
async function mintLevelNFT(score) {
    try {
        // Initialize Web3 if not already initialized
        if (!web3 || !userAccount) {
            const initialized = await initializeWeb3();
            if (!initialized) {
                throw new Error('Failed to initialize Web3');
            }
        }
        
        // Ensure contract address is configured
        if (!CONTRACT_CONFIG.address) {
            throw new Error('Contract address not configured. Cannot mint NFT.');
        }
        
        // Ensure score is a valid number
        if (typeof score !== 'number' || isNaN(score)) {
            throw new Error('Invalid score value');
        }
        
        console.log('Minting NFT for account:', userAccount);
        console.log('Score:', score);
        
        try {
            // Simple method to encode the function call
            // Function signature: mint(uint256)
            // Keccak256 hash of the function signature: 0xa0712d68
            const functionSignature = '0xa0712d68';
            
            // Convert score to hex and pad to 32 bytes
            let scoreHex = score.toString(16);
            scoreHex = scoreHex.padStart(64, '0');
            
            // Combine function signature and parameter
            const data = functionSignature + scoreHex;
            
            // Send transaction directly through MetaMask
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: userAccount,
                    to: CONTRACT_CONFIG.address,
                    data: data,
                    gas: '0x7A120', // ~500,000 gas
                }],
            });
            
            console.log('NFT minting transaction sent:', txHash);
            return txHash;
        } catch (error) {
            console.error('Contract call failed:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
    }
}

// Check initial connection status
async function checkInitialConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                // Already connected
                await initializeWeb3();
            } else {
                updateWalletStatus(false, null, 'Please connect your wallet');
            }
        } catch (error) {
            console.error('Error checking initial connection:', error);
            updateWalletStatus(false, null, 'Please connect your wallet');
        }
    } else {
        updateWalletStatus(false, null, 'Please install MetaMask');
    }
}

// Wait for the page to be fully loaded
window.addEventListener('load', function() {
    // Load contract configuration
    loadContractConfig();
    
    // Check if Web3 is loaded
    if (typeof Web3 === 'undefined') {
        console.error('Web3 is not loaded. Please check your script includes.');
        updateWalletStatus(false, null, 'Web3 not available');
        return;
    }

    const connectButton = document.getElementById('connect-wallet');
    if (connectButton) {
        connectButton.addEventListener('click', connectWallet);
    }
    
    // Check initial connection status
    checkInitialConnection();
});

// Make functions available globally
window.mintLevelNFT = mintLevelNFT;
window.connectWallet = connectWallet; 