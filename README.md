# Decentralized Certificate Issuance Platform

## 📌 Overview
The **Decentralized Certificate Issuance Platform** is a blockchain-based solution for issuing, storing, and verifying certificates as **NFTs on the Hedera network**. Institutions can mint certificates as verifiable NFTs, while users can store and share them through their **HashPack wallet**. Employers and institutions can verify certificate authenticity directly on-chain.

## 🚀 Features
- **Certificate Minting**: Institutions issue certificates as NFTs on Hedera.
- **Verifiable Credentials (VCs)**: Ensure authenticity and integrity of issued certificates.
- **On-Chain Verification**: Verify certificates using transaction or token ID.
- **IPFS Integration**: Store structured certificate images securely.

## 🏗️ Tech Stack
- **Frontend**: React.js, TailwindCSS, Lucide-React
- **Backend**: Node.js, Express.js
- **Blockchain**: Hedera Hashgraph (Hedera Consensus Service, Token Service)
- **Storage**: IPFS for decentralized document storage

## 📜 Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Node.js (v16+)
- npm
- A Hedera account & HashPack wallet

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Triparna-146/hedera-hackathon.git
cd decentralized-certificate-platform
```

### 2️⃣ Install Dependencies
```bash
npm install  # or yarn install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add:
```env
HEDERA_ACCOUNT_ID=your-account-id
HEDERA_PRIVATE_KEY=your-private-key
HEDERA_NETWORK=testnet
IPFS_GATEWAY=https://ipfs.io/ipfs/
```

### 4️⃣ Start the Application
#### Frontend
```bash
cd client
npm start
```
#### Backend
```bash
cd server
npm run dev
```

## 📜 Usage Guide
1. **Institution Logs In**: Registers and mints a certificate as an NFT.
2. **User Receives Certificate**: The issued certificate is stored in their HashPack wallet.
3. **Verification**: Employers can verify the certificate using the token ID on HashScan.
4. **Document Access**: Users can access and share certificates via IPFS links.

## 🔗 API Endpoints
| Method | Endpoint | Description |
|--------|-------------|----------------|
| `POST` | `/mint` | Mint a certificate NFT |
| `GET` | `/certificates` | Fetch user certificates |
| `POST` | `/verify` | Verify certificate authenticity |

## 👥 Contributors
- **Shail** (Lead Developer)
- **Triparna Kar** (Backend & Selective Disclosure)
- **Dhruvin Parmar** (Frontend & Documentation)
- **Amit Kumar** (Frontend)


## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Added feature"`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request.

---
🚀 **Empowering Education with Decentralization!** 🌍

