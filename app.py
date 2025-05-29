from flask import Flask, render_template, request, jsonify
import uuid
import time
from openai import OpenAI
import os
from dotenv import load_dotenv

# --- Load Environment Variables ---
# Ensure key.env.txt is in the same directory as app.py
load_dotenv(dotenv_path="key.env.txt")

app = Flask(__name__)

# --- OpenAI Configuration ---
OpenAI.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OpenAI.api_key)

# --- Mock Database (for hackathon demo) ---
# These will simulate your on-chain data for the demo
dids_db = {
    "did:ethr:0xGujaratFarm123456789ABCDEF0123456789ABCDEF": {
        "name": "Ravi Sharma (Organic Farmer)",
        "timestamp": time.time(),
        "walletAddress": "0x1234567890abcdef1234567890abcdef12345678"
    }
}
vcs_db = {
    "vc:cert:organicFarming_ravifarm_2025": {
        "type": "OrganicFarmingCertification",
        "issuer": "Gujarat Agriculture University",
        "issueDate": "2025-05-20",
        "status": "Verified",
        "details": "Certified 2 hectares under organic farming, estimated 5 tons CO2 sequestration/year.",
        "targetDid": "did:ethr:0xGujaratFarm123456789ABCDEF0123456789ABCDEF"
    }
}
nfts_db = {
    "nft-impact-001": {
        "title": "Ravi's Organic Carbon - Year 1",
        "description": "10 Carbon Offset Credits (10 Tons CO2eq) from organic farming in Mehsana, Gujarat (Year 1).",
        "image": "/static/assets/carbon_sequestered_farm.jpeg", # Ensure this path is correct
        "status": "Listed on Marketplace",
        "price": "100 USDC",
        "mintDate": "2025-05-25",
        "txHash": "0xMockTxHash123abc...",
        "linkedVCs": ['vc:cert:organicFarming_ravifarm_2025']
    }
}
dao_votes_db = {
    "prop-001": {
        "title": "Approve Funding for 'Clean Sabarmati' Project",
        "votes": {"Yes": 150, "No": 20, "Abstain": 5},
        "voters": ["mock_user_did_1"] # Example mock voters
    },
    "prop-002": {
        "title": "Update Verifier Onboarding Standards",
        "votes": {"Yes": 100, "No": 40, "Abstain": 10},
        "voters": ["mock_user_did_2"]
    },
    "prop-003": {
        "title": "NFT Royalty Distribution Adjustment",
        "votes": {"Yes": 300, "No": 50, "Abstain": 20},
        "voters": ["mock_user_did_3"]
    }
}


# --- Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/marketplace')
def marketplace():
    return render_template('marketplace.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

# --- API Endpoints ---

@app.route('/api/register_did', methods=['POST'])
def register_did():
    data = request.json
    name = data.get('name')
    if not name:
        return jsonify({"status": "error", "message": "Name is required."}), 400

    # Generate a mock DID ID
    did_id = f"did:ethr:0x{uuid.uuid4().hex[:40]}"
    dids_db[did_id] = {'name': name, 'timestamp': time.time(), 'walletAddress': f"0x{uuid.uuid4().hex[:40]}"}
    return jsonify({"status": "success", "message": "DID registered successfully!", "didId": did_id}), 200

@app.route('/api/issue_vc', methods=['POST'])
def issue_vc():
    data = request.json
    vc_type = data.get('type')
    details = data.get('details')
    issuer = data.get('issuer')
    target_did = data.get('targetDid') # Assuming frontend sends this

    if not all([vc_type, details, issuer, target_did]):
        return jsonify({"status": "error", "message": "All VC fields are required."}), 400

    # Generate a mock VC ID
    vc_id = f"vc:cert:{vc_type.replace(' ', '')}_{uuid.uuid4().hex[:8]}"
    vcs_db[vc_id] = {'type': vc_type, 'details': details, 'issuer': issuer, 'targetDid': target_did, 'issueDate': time.strftime("%Y-%m-%d"), 'status': 'Verified'}
    return jsonify({"status": "success", "message": "VC issued successfully!", "vcId": vc_id}), 200

@app.route('/api/mint_nft', methods=['POST'])
def mint_nft():
    data = request.json
    name = data.get('name')
    description = data.get('description')
    image = data.get('image')

    if not all([name, description, image]):
        return jsonify({"status": "error", "message": "NFT name, description, and image are required."}), 400

    # Generate mock NFT ID and transaction hash
    nft_id = f"nft-{uuid.uuid4().hex[:8]}"
    tx_hash = f"0x{uuid.uuid4().hex}"
    
    nfts_db[nft_id] = {
        'title': name,
        'description': description,
        'image': image,
        'status': "Minted - Not Listed",
        'price': "N/A",
        'mintDate': time.strftime("%Y-%m-%d"),
        'txHash': tx_hash,
        'linkedVCs': [] # You can add logic to link real VCs here if needed
    }
    return jsonify({"status": "success", "message": "NFT minted successfully!", "nftId": nft_id, "txHash": tx_hash}), 200

@app.route('/api/ai_predict_impact', methods=['POST'])
def ai_predict_impact():
    data = request.json
    project_type = data.get('projectType')
    location = data.get('location')
    size = data.get('size')
    duration = data.get('duration')

    # Basic input validation
    if not all([project_type, location, size, duration]):
        return jsonify({"status": "error", "message": "All project details are required for prediction."}), 400

    # Use OpenAI API for prediction
    try:
        messages = [
            {"role": "system", "content": "You are an AI assistant specialized in predicting environmental impact based on project details. Provide a 'predictedImpactType', 'predictedCarbonOffset' (e.g., '100-120 Tons CO2 over 5 years'), and a 'suggestionMethod' for maximizing impact. Keep answers concise."},
            {"role": "user", "content": f"Predict impact for a '{project_type}' project in '{location}', size '{size}', duration '{duration}' years."}
        ]

        completion = client.chat.completions.create(
            model="gpt-4o-mini", # Or any other suitable model
            messages=messages,
            response_format={"type": "json_object"} # Request JSON output
        )
        
        # Parse the JSON response
        ai_response_json = completion.choices[0].message.content
        ai_data = json.loads(ai_response_json)

        predicted_impact_type = ai_data.get('predictedImpactType', "Environmental Impact")
        predicted_carbon_offset = ai_data.get('predictedCarbonOffset', "N/A")
        suggestion_method = ai_data.get('suggestionMethod', "No specific suggestions.")
        
        return jsonify({
            "status": "success",
            "predictedImpactType": predicted_impact_type,
            "predictedCarbonOffset": predicted_carbon_offset,
            "suggestionMethod": suggestion_method
        }), 200

    except Exception as e:
        print(f"OpenAI API error: {e}")
        return jsonify({"status": "error", "message": f"AI prediction failed due to an internal error: {e}"}), 500


@app.route('/api/vote_dao', methods=['POST'])
def vote_dao():
    data = request.json
    proposal_id = data.get('proposalId')
    vote_choice = data.get('voteChoice')
    
    if not all([proposal_id, vote_choice]):
        return jsonify({"status": "error", "message": "Proposal ID and vote choice are required."}), 400

    # Simulate recording the vote in our mock DB
    if proposal_id not in dao_votes_db:
        # If proposal doesn't exist in mock DB, create a placeholder
        dao_votes_db[proposal_id] = {"title": "Unknown Proposal", "votes": {"Yes": 0, "No": 0, "Abstain": 0}, "voters": []}
    
    if vote_choice in dao_votes_db[proposal_id]["votes"]:
        dao_votes_db[proposal_id]["votes"][vote_choice] += 1
        # In a real app, you'd add the user's DID/wallet to voters list
        dao_votes_db[proposal_id]["voters"].append("mock_user_did_example") 
    else:
        return jsonify({"status": "error", "message": "Invalid vote choice."}), 400
    
    tx_hash = f"0x{uuid.uuid4().hex}" # Mock transaction hash
    return jsonify({"status": "success", "message": "Vote cast successfully!", "txHash": tx_hash}), 200

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"response": "No message provided."}), 400

    try:
        messages = [
            {"role": "system", "content": "You are a friendly and informative chatbot for 'Proof of Impact DAO'. Provide information about DIDs, VCs, NFTs, DAO governance, and our mission to fight greenwashing and empower local environmental stewards. Keep your answers brief and to the point, focusing on our project's aspects. Do not generate code or external links."},
            {"role": "user", "content": user_message}
        ]

        # Add some mock context based on current mock data (optional but good for realism)
        if "did" in user_message.lower() and dids_db:
            latest_did = list(dids_db.keys())[-1]
            messages.insert(1, {"role": "system", "content": f"A user recently registered DID: {latest_did}."})
        if "nft" in user_message.lower() and nfts_db:
            latest_nft_name = list(nfts_db.values())[-1].get('title', 'a recent NFT')
            messages.insert(1, {"role": "system", "content": f"A user recently minted {latest_nft_name}."})

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        bot_response = completion.choices[0].message.content
        return jsonify({"response": bot_response}), 200

    except Exception as e:
        print(f"OpenAI API error: {e}")
        return jsonify({"response": "Sorry, I'm having trouble connecting right now. Please try again later."}), 500

if __name__ == '__main__':
    app.run(debug=True)