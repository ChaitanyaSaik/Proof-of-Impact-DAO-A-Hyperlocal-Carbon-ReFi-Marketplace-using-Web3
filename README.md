# 🌱 Proof of Impact DAO — A Hyperlocal Carbon ReFi Marketplace using Web3

### Presented At: Hack With Gujarat 2025 (May 26–29, 2025), hosted virtually on Devfolio.

---

## 🧩 Problem Statement

The global carbon credit ecosystem currently faces several critical challenges:

- **Greenwashing and Fraud**: Many carbon offsets are unverifiable or inflated, eroding trust.
- **Exclusion of Local Projects**: Small-scale, community-based initiatives find it difficult to access the carbon market due to complex processes and high entry barriers.
- **Lack of Transparency**: Buyers cannot trace or validate the carbon credits they purchase.
- **Centralized Bureaucracy**: Over-reliance on centralized validation discourages decentralization and inclusiveness.

---

## ✅ Proposed Solution

**Proof of Impact DAO** is a Web3-powered decentralized platform that combats these issues by enabling **hyperlocal environmental projects** to tokenize their impact as **Proof-of-Impact NFTs**, validated through **Decentralized Identities (DIDs)** and **Verifiable Credentials (VCs)**. These NFTs can be traded on a transparent, DAO-governed **ReFi marketplace**, ensuring verified ecological benefits.

---

## 🚀 Key Features & Architecture

### 🔐 Decentralized Identity (DIDs) & Verifiable Credentials (VCs)

- **DID Registration**: Unique decentralized identity for community members, project owners, and validators.
- **VC Issuance**: Trusted oracles (e.g., NGOs, universities) issue VCs verifying ecological actions (e.g., tree planting, soil health, etc.).

### 🧾 Proof-of-Impact NFTs

- **Tokenization**: Verified impact (e.g., 1 ton CO₂ sequestered) is tokenized into a unique NFT.
- **Rich Metadata**: Includes geo-location, timestamped VCs, and links to satellite/IoT data.

### 🏛️ DAO Governance

- **Community-Owned**: Governed by stakeholders via a Decentralized Autonomous Organization.
- **On-chain Proposals**: Smart contracts handle project funding, governance changes, and dispute resolution.

### 🌍 ReFi Carbon Credit Marketplace

- **NFT Transactions**: Tamper-proof carbon offset NFTs are transparently traded.
- **Diverse Buyers**: Individuals, companies, and DAOs can offset emissions by directly supporting local projects.

### 🤖 AI-Powered Impact Prediction

- **Predictive Model**: Uses OpenAI API to estimate potential ecological benefits from user-submitted data.
- **Smart Suggestions**: Recommends carbon-maximizing strategies based on land/farming data.

### 💬 Interactive Chatbot

- **Information Hub**: A friendly AI chatbot guides users through DIDs, VCs, NFTs, DAO governance, and more.

---

## 🧠 Technologies Used

### 🔧 Backend

- **Python** – Core backend language.
- **Flask** – RESTful API server for DIDs, VCs, NFTs, AI, and DAO.
- **OpenAI API** – For AI predictions and chatbot functionality.
- **python-dotenv** – Securely handles API keys.

### 🌐 Frontend

- **HTML5 + CSS3** – Responsive design with dark-themed, aqua-green UI.
- **JavaScript** – Dynamic interactions and API calls.
- **Chart.js** – Visualizes market activity and impact.
- **Animate.css** – Smooth UI animations.
- **Font Awesome + Google Fonts (Poppins)** – Icons and modern typography.

---

## 🌐 Web3 Concepts (Mocked for Demo)

To simulate Web3 for MVP purposes, in-memory databases are used:

- **DIDs** → `dids_db`
- **VCs** → `vcs_db`
- **NFTs** → `nfts_db`
- **DAO Voting** → `dao_votes_db`

---

## 🗂️ Project Structure

