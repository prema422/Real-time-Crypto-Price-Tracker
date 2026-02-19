const cryptoList = document.getElementById('crypto-list');
const refreshBtn = document.getElementById('refresh-btn');
const lastUpdateEl = document.getElementById('last-update');

const cryptos = ['bitcoin', 'ethereum', 'cardano', 'solana', 'ripple'];
let previousPrices = {};

async function fetchCryptoPrices() {
    refreshBtn.disabled = true;
    refreshBtn.classList.add('loading');
    
    if (cryptoList.children.length === 0) {
        cryptoList.innerHTML = '<div class="loading">Loading prices...</div>';
    }
    
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptos.join(',')}&vs_currencies=usd&include_24hr_change=true`);
        const data = await response.json();
        displayCryptoPrices(data);
        updateTimestamp();
    } catch (error) {
        cryptoList.innerHTML = '<div class="loading">Error loading prices. Please try again.</div>';
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.classList.remove('loading');
    }
}

function updateTimestamp() {
    const now = new Date();
    lastUpdateEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function displayCryptoPrices(data) {
    cryptoList.innerHTML = '';
    
    cryptos.forEach((crypto, index) => {
        if (data[crypto]) {
            const price = data[crypto].usd;
            const change = data[crypto].usd_24h_change;
            const priceChanged = previousPrices[crypto] && previousPrices[crypto] !== price;
            
            const card = document.createElement('div');
            card.className = 'crypto-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.onclick = () => window.open(`https://www.coingecko.com/en/coins/${crypto}`, '_blank');
            card.innerHTML = `
                <div class="crypto-info">
                    <h2>${crypto.charAt(0).toUpperCase() + crypto.slice(1)}</h2>
                    <p>${crypto.toUpperCase()}</p>
                </div>
                <div class="crypto-price">
                    <div class="price ${priceChanged ? 'price-update' : ''}">$${price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="change ${change >= 0 ? 'positive' : 'negative'}">
                        ${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%
                    </div>
                </div>
            `;
            cryptoList.appendChild(card);
            previousPrices[crypto] = price;
        }
    });
}

refreshBtn.addEventListener('click', fetchCryptoPrices);

fetchCryptoPrices();
setInterval(fetchCryptoPrices, 60000);
