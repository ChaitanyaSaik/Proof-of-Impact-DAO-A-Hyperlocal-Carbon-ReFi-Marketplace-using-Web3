// static/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const didForm = document.getElementById('did-form');
    const didStatus = document.getElementById('did-status');
    const vcForm = document.getElementById('vc-form');
    const vcStatus = document.getElementById('vc-status');
    const nftForm = document.getElementById('nft-form');
    const nftStatus = document.getElementById('nft-status');
    const aiPredictionForm = document.getElementById('ai-prediction-form'); // New
    const predictionStatus = document.getElementById('prediction-status'); // New
    const predictionResultsDiv = document.getElementById('prediction-results'); // New
    const predictedImpactType = document.getElementById('predicted-impact-type'); // New
    const predictedCarbonOffset = document.getElementById('predicted-carbon-offset'); // New
    const suggestionMethod = document.getElementById('suggestion-method'); // New
    const daoVoteForm = document.getElementById('dao-vote-form');
    const daoStatus = document.getElementById('dao-status');

    // State variables for the demo
    let currentDID = 'did:ethr:0x123...';
let currentVCId = 'vc:cert:organicFarming';
let userNFTsMinted = 5; // 5 NFT crops tokenized
let userDAOVotes = 3;   // Voted 3 times in Agri DAO proposals


    // --- Utility Function to Update Status Messages ---
    function updateStatus(element, message, type) {
        element.classList.remove('success', 'error', 'info', 'hidden'); // Remove all states first
        element.textContent = ''; // Clear text content initially for innerHTML
        element.innerHTML = message; // Use innerHTML to allow icons/links

        if (type === 'success') {
            element.classList.add('success');
            // Add a subtle animation for success messages
            element.classList.add('animate__animated', 'animate__bounceIn');
            setTimeout(() => element.classList.remove('animate__animated', 'animate__bounceIn'), 1000);
        } else if (type === 'error') {
            element.classList.add('error');
            element.classList.add('animate__animated', 'animate__headShake'); // Head shake for errors
            setTimeout(() => element.classList.remove('animate__animated', 'animate__headShake'), 1000);
        } else if (type === 'info') {
            element.classList.add('info');
        } else {
            element.classList.add('hidden'); // Default hide if no specific type
        }
        element.style.opacity = 1; // Ensure it's visible
    }

    // --- Update Dashboard Summary Stats ---
    function updateDashboardSummary() {
        document.getElementById('user-dids').textContent = currentDID ? '1' : '0';
        document.getElementById('user-vcs').textContent = currentVCId ? '1' : '0'; // Assuming one VC per demo flow
        document.getElementById('user-nfts-minted').textContent = userNFTsMinted;
        document.getElementById('user-dao-votes').textContent = userDAOVotes;

        createPersonalImpactChart(); // Re-render chart if data changes
    }

    // --- Chart.js Integration (Personal Impact Breakdown) ---
    let personalImpactChartInstance = null; // To store chart instance and destroy/recreate

    function createPersonalImpactChart() {
        const ctx = document.getElementById('personalImpactChart').getContext('2d');

        if (personalImpactChartInstance) {
            personalImpactChartInstance.destroy(); // Destroy previous instance if exists
        }

        // Mock data for impact types based on interactions
        const impactData = {
            'Carbon Sequestration': 1000, 
            'Soil Regeneration': 300,
            'Wetland Restoration': 500,
            'Waste Management': 400,
            'Other': 20
        };

        // If a VC is 'issued' in the mock, update chart data
        const vcTypeElement = document.getElementById('vc-type');
        const vcDataElement = document.getElementById('vc-data');
        if (currentVCId && vcTypeElement && vcDataElement) {
            const vcType = vcTypeElement.value;
            const vcData = parseFloat(vcDataElement.value);
            if (!isNaN(vcData) && vcType) {
                if (impactData.hasOwnProperty(vcType.replace(/_/g, ' '))) {
                    impactData[vcType.replace(/_/g, ' ')] += vcData;
                } else {
                    impactData['Other'] += vcData;
                }
            }
        }

        // For demo, each minted NFT adds a fixed amount of impact to 'Carbon Sequestration'
        // In a real app, this would be based on actual NFT metadata.
        if (userNFTsMinted > 0) {
            impactData['Carbon Sequestration'] += userNFTsMinted * 5; // e.g., 5 units per NFT
        }

        const labels = Object.keys(impactData).filter(key => impactData[key] > 0);
        const data = Object.values(impactData).filter(value => value > 0);

        personalImpactChartInstance = new Chart(ctx, {
            type: 'pie', // Pie chart for breakdown
            data: {
                labels: labels,
                datasets: [{
                    label: 'Your Verified Impact',
                    data: data,
                    backgroundColor: [
                        '#4CAF50', // Primary Green
                        '#FFC107', // Accent Amber
                        '#6A1B9A', // Secondary Purple
                        '#03A9F4', // Light Blue for Waste Management
                        '#B0BEC5'  // Grey for 'Other'
                    ],
                    hoverOffset: 8, // Effect on hover
                    borderWidth: 1,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Your Personal Impact Breakdown',
                        font: { size: 18, weight: 'bold', family: 'Poppins' },
                        color: '#333'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed.toFixed(2) + ' units'; // Adjust unit as needed
                                }
                                return label;
                            }
                        },
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 12 },
                        cornerRadius: 5
                    },
                    legend: {
                        position: 'right', // Place legend on the right
                        labels: {
                            font: { family: 'Poppins' },
                            color: '#555',
                            boxWidth: 20
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


    // --- Form Submissions ---

    // 1. DID Registration
    didForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('did-name').value;
        const address = document.getElementById('did-address').value;

        updateStatus(didStatus, 'Registering DID...', 'info');

        try {
            // Simulate API call to backend (Flask /api/register_did)
            // const response = await fetch('/api/register_did', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, address })
            // });
            // const result = await response.json();

            // Mock success response after a delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockDid = `did:poi:${Math.random().toString(36).substring(2, 10)}`;
            currentDID = mockDid;

            // Update UI elements
            document.getElementById('vc-did').value = currentDID; // Auto-fill for next step
            updateStatus(didStatus, `<i class="fas fa-check-circle"></i> DID registered successfully! Your DID: <strong>${currentDID}</strong>`, 'success');
            updateDashboardSummary();

        } catch (error) {
            console.error('DID registration error:', error);
            updateStatus(didStatus, `<i class="fas fa-times-circle"></i> DID registration failed. Please try again.`, 'error');
        }
    });

    // 2. VC Issuance (Mocked)
    vcForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const vcDid = document.getElementById('vc-did').value;
        const vcType = document.getElementById('vc-type').value;
        const vcData = document.getElementById('vc-data').value;
        const vcVerifier = document.getElementById('vc-verifier').value;

        if (!vcDid) {
            updateStatus(vcStatus, 'Please register your DID first.', 'error');
            return;
        }
        if (!vcType || !vcData) {
            updateStatus(vcStatus, 'Please fill in all VC details.', 'error');
            return;
        }

        updateStatus(vcStatus, 'Requesting Verifiable Credential...', 'info');

        try {
            // Simulate API call to backend (Flask /api/issue_vc)
            // const response = await fetch('/api/issue_vc', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ did: vcDid, type: vcType, data: vcData, verifier: vcVerifier })
            // });
            // const result = await response.json();

            // Mock success response after a delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            const mockVcId = `vc-id-${Math.random().toString(36).substring(2, 10)}`;
            currentVCId = mockVcId;

            document.getElementById('nft-vc-id').value = currentVCId; // Auto-fill for next step
            updateStatus(vcStatus, `<i class="fas fa-check-circle"></i> Verifiable Credential issued! VC ID: <strong>${currentVCId}</strong>`, 'success');
            updateDashboardSummary();

        } catch (error) {
            console.error('VC issuance error:', error);
            updateStatus(vcStatus, `<i class="fas fa-times-circle"></i> VC issuance failed. Please try again.`, 'error');
        }
    });

    // 3. NFT Minting
    nftForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nftVcId = document.getElementById('nft-vc-id').value;
        const nftName = document.getElementById('nft-name').value;
        const nftDescription = document.getElementById('nft-description').value;
        const nftLocation = document.getElementById('nft-location').value;
        const nftImage = document.getElementById('nft-image').value;

        if (!nftVcId) {
            updateStatus(nftStatus, 'Please obtain a Verifiable Credential first.', 'error');
            return;
        }
        if (!nftName || !nftDescription || !nftLocation || !nftImage) {
            updateStatus(nftStatus, 'Please fill in all NFT details.', 'error');
            return;
        }

        updateStatus(nftStatus, 'Minting Proof-of-Impact NFT...', 'info');

        try {
            // Simulate API call to backend (Flask /api/mint_nft)
            // const response = await fetch('/api/mint_nft', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ vc_id: nftVcId, name: nftName, description: nftDescription, location: nftLocation, image: nftImage })
            // });
            // const result = await response.json();

            // Mock success response after a delay
            await new Promise(resolve => setTimeout(resolve, 2500));
            userNFTsMinted++;

            updateStatus(nftStatus, `<i class="fas fa-check-circle"></i> NFT "${nftName}" minted successfully! View it on the <a href="/marketplace" style="color:white; text-decoration: underline;">Marketplace</a>.`, 'success');
            updateDashboardSummary();

        } catch (error) {
            console.error('NFT minting error:', error);
            updateStatus(nftStatus, `<i class="fas fa-times-circle"></i> NFT minting failed. Please try again.`, 'error');
        }
    });

    // --- New AI/ML Prediction Logic ---
    aiPredictionForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const landArea = parseFloat(document.getElementById('land-area').value);
        const soilType = document.getElementById('soil-type').value;
        const farmingMethod = document.getElementById('farming-method').value;
        const rainfallMm = parseFloat(document.getElementById('rainfall-mm').value);

        if (isNaN(landArea) || landArea <= 0 || !soilType || !farmingMethod || isNaN(rainfallMm) || rainfallMm < 0) {
            updateStatus(predictionStatus, 'Please fill in all valid prediction inputs.', 'error');
            predictionResultsDiv.classList.add('hidden');
            return;
        }

        updateStatus(predictionStatus, 'Analyzing data and generating prediction using AI model...', 'info');
        predictionResultsDiv.classList.add('hidden'); // Hide previous results

        try {
            // Simulate AI model prediction API call
            // In a real scenario, this would send data to your Flask backend
            // which would then interact with a trained ML model (e.g., using scikit-learn, TensorFlow)
            // or an external AI API (e.g., Google AI Platform, Azure ML).
            // Example:
            // const response = await fetch('/api/predict_impact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ landArea, soilType, farmingMethod, rainfallMm })
            // });
            // const result = await response.json(); // { predicted_offset: 15.2, optimal_type: 'Carbon Sequestration', suggestion: 'Consider...' }

            await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate AI processing time

            // --- Mock AI Prediction Logic (Rule-based for demo) ---
            let predictedOffset = landArea * 2; // Base offset per hectare
            let optimalImpact = "Carbon Sequestration";
            let suggestion = "";

            if (farmingMethod === "regenerative") {
                predictedOffset *= 1.8; // Regenerative is highly effective
                optimalImpact = "Carbon Sequestration & Soil Regeneration";
                suggestion = "Regenerative agriculture practices are highly effective for long-term carbon sequestration and soil health. Keep up the great work!";
            } else if (farmingMethod === "organic") {
                predictedOffset *= 1.3; // Organic has good impact
                optimalImpact = "Carbon Sequestration & Biodiversity";
                suggestion = "Organic farming is a solid choice. Exploring cover cropping and no-till could further boost your impact.";
            } else if (farmingMethod === "agroforestry") {
                 predictedOffset *= 2.5; // Agroforestry is very high
                 optimalImpact = "Carbon Sequestration, Biodiversity & Water Retention";
                 suggestion = "Agroforestry offers immense benefits. Consider integrating more tree species for maximum impact.";
            } else { // Conventional
                predictedOffset *= 0.5; // Conventional has less impact
                optimalImpact = "Soil Improvement";
                suggestion = "To increase your impact, consider transitioning to organic or regenerative methods to improve soil health and carbon capture.";
            }

            if (soilType === "clay" && farmingMethod !== "regenerative") {
                predictedOffset *= 1.1; // Clay can hold more carbon
                suggestion += " Clay soils have good carbon retention potential; focus on practices that build soil organic matter.";
            }
            if (rainfallMm < 500) {
                predictedOffset *= 0.8; // Lower rainfall, less growth/offset
                suggestion += " In drier conditions, drought-resistant crops and water-efficient irrigation can maintain impact potential.";
            } else if (rainfallMm > 1500) {
                predictedOffset *= 1.2; // Higher rainfall, potentially more growth
                suggestion += " Abundant rainfall supports lush growth; ensure good drainage to prevent waterlogging.";
            }

            // Ensure non-negative prediction
            predictedOffset = Math.max(0, predictedOffset);

            // Populate results
            predictedImpactType.textContent = optimalImpact;
            predictedCarbonOffset.textContent = predictedOffset.toFixed(2);
            suggestionMethod.textContent = suggestion;

            updateStatus(predictionStatus, `<i class="fas fa-check-circle"></i> Prediction complete!`, 'success');
            predictionResultsDiv.classList.remove('hidden');
            predictionResultsDiv.classList.add('animate__animated', 'animate__fadeIn'); // Animate results
            setTimeout(() => predictionResultsDiv.classList.remove('animate__animated', 'animate__fadeIn'), 1000);


        } catch (error) {
            console.error('AI prediction error:', error);
            updateStatus(predictionStatus, `<i class="fas fa-times-circle"></i> Failed to get prediction. Please check inputs and try again.`, 'error');
            predictionResultsDiv.classList.add('hidden');
        }
    });

    // 4. DAO Voting (Mocked)
    daoVoteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const proposal = document.getElementById('vote-proposal').value;
        const choice = document.getElementById('vote-choice').value;

        if (!proposal || !choice) {
            updateStatus(daoStatus, 'Please select a proposal and a vote choice.', 'error');
            return;
        }

        updateStatus(daoStatus, `Casting vote "${choice}" for proposal: "${proposal}"...`, 'info');

        // Simulate a delay for voting
        setTimeout(() => {
            userDAOVotes++;
            updateStatus(daoStatus, `<i class="fas fa-check-circle"></i> Successfully cast "${choice}" vote for proposal: "${proposal}". (Mocked Interaction)`, 'success');
            updateDashboardSummary();
        }, 1000);
    });

    // Initial dashboard summary update on load
    updateDashboardSummary();
});