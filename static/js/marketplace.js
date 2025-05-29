// static/js/marketplace.js
document.addEventListener('DOMContentLoaded', async () => {
    const nftListingsDiv = document.getElementById('nft-listings');
    const loadingMessage = document.getElementById('loading-message');
    const noNFTsMessage = document.getElementById('no-nfts-message');

    // Mock Data for Hackathon Demo (Replace with actual API fetches in a live environment)
    const mockNFTs = [
        {
            id: 'nft-001',
            title: "Ravi's Organic Farm - Carbon Sequestration",
            description: "1 Ton CO2 sequestered through regenerative organic farming practices in rural Gujarat. Verified impact from 2024 growing season.",
            image: "/static/assets/carbon subsequent.jpeg", // Placeholder image
            location: "22.2587° N, 71.1924° E",
            verifier: "Gujarat Agriculture University",
            mintDate: "May 20, 2025",
            vcId: "VC-XYZ123",
            price: "10 USDC",
            impactType: "Carbon Sequestration",
            impactData: "1.0 Ton CO2"
        },
        {
            id: 'nft-002',
            title: "Ahmednagar Wetland Restoration - Biodiversity Boost",
            description: "Restoration of 5 hectares of degraded wetlands in Ahmednagar, improving local biodiversity and water quality.",
            image: "/static/assets/urban.jpeg", // Placeholder image
            location: "19.0970° N, 74.7490° E",
            verifier: "Environmental Conservation NGO",
            mintDate: "April 15, 2025",
            vcId: "VC-ABC456",
            price: "15 USDC",
            impactType: "Wetland Restoration",
            impactData: "5 Hectares"
        },
        {
            id: 'nft-003',
            title: "Urban Greening Project - Surat",
            description: "Community-driven project planting 500 native trees in urban areas of Surat to improve air quality and provide shade.",
            image: "/static/assets/wetland restoreation.jpeg", // Placeholder image
            location: "21.1702° N, 72.8311° E",
            verifier: "Surat Municipal Corporation",
            mintDate: "June 01, 2025",
            vcId: "VC-PQR789",
            price: "8 USDC",
            impactType: "Tree Plantation",
            impactData: "500 Trees"
        }
    ];

    // --- Utility Functions ---
    function showLoading() {
        loadingMessage.classList.remove('hidden');
        nftListingsDiv.innerHTML = ''; // Clear previous content
        noNFTsMessage.classList.add('hidden');
    }

    function hideLoading() {
        loadingMessage.classList.add('hidden');
    }

    function showNoNFTsMessage() {
        noNFTsMessage.classList.remove('hidden');
    }

    function updateMarketStats(nfts) {
        document.getElementById('total-nfts').textContent = nfts.length;
        const totalVolume = nfts.reduce((sum, nft) => sum + parseFloat(nft.price.replace(' USDC', '')), 0);
        document.getElementById('volume-traded').textContent = `$${totalVolume.toFixed(2)}`;
        document.getElementById('projects-supported').textContent = new Set(nfts.map(nft => nft.verifier)).size;
    }

    // --- NFT Rendering ---
    function renderNFTs(nfts) {
        nftListingsDiv.innerHTML = ''; // Clear existing listings
        if (nfts.length === 0) {
            showNoNFTsMessage();
            return;
        }

        nfts.forEach((nft, index) => {
            const nftCard = document.createElement('div');
            nftCard.classList.add('nft-card', 'animate__animated', 'animate__zoomIn'); // Animate.css
            // Add a slight delay for staggered animation
            nftCard.style.animationDelay = `${0.1 * index}s`;

            nftCard.innerHTML = `
                <img src="${nft.image}" alt="${nft.title}">
                <div class="nft-info">
                    <h4 class="nft-title">${nft.title}</h4>
                    <p class="nft-description">${nft.description}</p>
                    <div class="nft-metadata">
                        <span><i class="fas fa-globe-americas"></i> Location: ${nft.location}</span>
                        <span><i class="fas fa-certificate"></i> Verified by: ${nft.verifier}</span>
                        <span><i class="fas fa-calendar-alt"></i> Minted: ${nft.mintDate}</span>
                        <span><i class="fas fa-id-badge"></i> VCs: ${nft.vcId} (linked)</span>
                    </div>
                    <div class="nft-price">
                        <span>Price:</span>
                        <span class="price-value">${nft.price}</span>
                    </div>
                    <button class="btn-primary buy-btn" data-nft-id="${nft.id}">Buy Now</button>
                </div>
            `;
            nftListingsDiv.appendChild(nftCard);
        });

        // Add event listeners for buy buttons (mock functionality)
        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const nftId = event.target.dataset.nftId;
                alert(`Attempting to buy NFT: ${nftId}. (This would trigger a blockchain transaction via Web3 wallet)`);
                // In a real dApp, you would integrate Ethers.js or Web3.js here:
                // e.g., connect to MetaMask, get signer, call smart contract buy function
                // Example (conceptual):
                // if (window.ethereum) {
                //     const provider = new ethers.providers.Web3Provider(window.ethereum);
                //     const signer = provider.getSigner();
                //     const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
                //     try {
                //         const tx = await contract.buyNFT(nftId, { value: ethers.utils.parseUnits("10", "ether") }); // Example price
                //         await tx.wait();
                //         alert('NFT purchased successfully!');
                //         fetchNFTs(); // Refresh listings
                //     } catch (error) {
                //         console.error('Error buying NFT:', error);
                //         alert('Failed to purchase NFT. See console for details.');
                //     }
                // } else {
                //     alert('Please install MetaMask to proceed with the purchase.');
                // }
            });
        });
    }

    // --- Chart.js Integration (Market Overview) ---
    function createMarketImpactChart() {
        const ctx = document.getElementById('marketImpactChart').getContext('2d');
        const marketImpactChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025'], // Example labels
                datasets: [{
                    label: 'Carbon Credits Traded (Tons CO2)',
                    data: [50, 75, 120, 150, 180], // Mock data for tons of CO2
                    borderColor: '#4CAF50', // Primary color
                    backgroundColor: 'rgba(76, 175, 80, 0.2)', // Primary color with transparency
                    fill: true,
                    tension: 0.3, // Smoothens the line
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#4CAF50',
                    pointHoverBorderColor: '#fff'
                }, {
                    label: 'New Projects Onboarded',
                    data: [2, 3, 5, 7, 9], // Mock data for number of projects
                    borderColor: '#6A1B9A', // Secondary color
                    backgroundColor: 'rgba(106, 27, 154, 0.2)', // Secondary color with transparency
                    fill: false,
                    tension: 0.3,
                    pointBackgroundColor: '#6A1B9A',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#6A1B9A',
                    pointHoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow custom height/width via CSS
                plugins: {
                    title: {
                        display: true,
                        text: 'Market Activity & Growth Over Time',
                        font: {
                            size: 18,
                            weight: 'bold',
                            family: 'Poppins'
                        },
                        color: '#333'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 12 },
                        cornerRadius: 5
                    },
                    legend: {
                        labels: {
                            font: {
                                family: 'Poppins'
                            },
                            color: '#555'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Value',
                            font: { size: 14, weight: 'bold' },
                            color: '#555'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            font: { family: 'Poppins' },
                            color: '#555'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time',
                            font: { size: 14, weight: 'bold' },
                            color: '#555'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            font: { family: 'Poppins' },
                            color: '#555'
                        }
                    }
                },
                animation: {
                    duration: 1500, // General animation time
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // --- Initialize Page ---
    async function initializeMarketplace() {
        showLoading();
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        renderNFTs(mockNFTs); // Use mock data
        updateMarketStats(mockNFTs);
        createMarketImpactChart();
        hideLoading();
    }

    initializeMarketplace();
});