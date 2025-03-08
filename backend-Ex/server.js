const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const { PDFDocument, rgb } = require("pdf-lib");
require("dotenv").config();
const FormData = require("form-data");
const cors = require("cors");


const {
    Client,
    PrivateKey,
    TokenCreateTransaction,
    TokenMintTransaction,
    TokenAssociateTransaction,
    TransferTransaction,
    TokenId,
    TokenInfoQuery,
    AccountId,
    TokenType,
    TokenSupplyType,
} = require("@hashgraph/sdk");

// --------------------------------------------------------------------------------------
// Institutions mint certificates as NFTs with metadata (e.g., course name, student details).
// Employers and institutions can verify certificate authenticity on-chain.
// Users store and share certificates through their HashPack wallet.
// --------------------------------------------------------------------------------------

// 🔹 Hedera Client Setup
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

// 🔹 Express Setup
const app = express();
app.use(cors()); 
app.use(express.json());

// 🔹 Ensure 'uploads' directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 🔹 Multer Configuration (File Uploads)
const upload = multer({ dest: uploadDir });

// 🔹 Pinata API Credentials
const PINATA_JWT = process.env.PINATA_JWT;

// 📌 Generate Certificate PDF
async function generateCertificate(studentName, courseName, date) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    const fontSize = 30;
    const text = `${studentName} has successfully completed the course "${courseName}" on ${date}.`;
    page.drawText(text, {
        x: 50,
        y: height - 100,
        size: fontSize,
        color: rgb(0, 0, 0),
    });
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

// 📌 Upload Certificate to IPFS via Pinata
async function uploadToIPFS(filePath, originalname) {
    try {
        const formData = new FormData();

        // Append the file using a read stream with proper options
        formData.append("file", fs.createReadStream(filePath), {
            filename: originalname,
            contentType: "application/octet-stream",
        });

        // Get the headers from formData and add your Pinata API keys
        const headers = {
            ...formData.getHeaders(),
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        };

        const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            { headers }
        );

        return response.data.IpfsHash;
    } catch (error) {
        console.error("IPFS Upload Error:", error.response?.data || error.message);
        throw new Error("IPFS Upload Failed");
    }
}

// 📌 Mint Certificate NFT
const certificatesFile = "certificates.json";

// Function to save certificate details
function saveCertificate(cert) {
    let certificates = [];
    if (fs.existsSync(certificatesFile)) {
        certificates = JSON.parse(fs.readFileSync(certificatesFile));
    }
    certificates.push(cert);
    fs.writeFileSync(certificatesFile, JSON.stringify(certificates, null, 2));
}

app.post("/mint", async (req, res) => {
    try {
        const { recipientId, studentName, courseName, date } = req.body;
        if (!recipientId || !studentName || !courseName || !date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        console.log("Generating certificate...");
        const pdfBytes = await generateCertificate(studentName, courseName, date);
        const filePath = `${uploadDir}/certificate_${Date.now()}.pdf`;
        fs.writeFileSync(filePath, pdfBytes);

        console.log("Uploading certificate to IPFS...");
        const ipfsHash = await uploadToIPFS(filePath, "certificate.pdf");
        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

        const nftMetadata = {
            studentName,
            courseName,
            date,
            ipfsUrl,
        };
        const nftMetadataBuffer = Buffer.from(JSON.stringify(nftMetadata));

        console.log("Creating NFT...");
        const tokenCreateTx = await new TokenCreateTransaction()
            .setTokenName("Certificate NFT")
            .setTokenSymbol("CERT")
            .setTokenType(TokenType.NonFungibleUnique)
            .setDecimals(0)
            .setSupplyType(TokenSupplyType.Finite)
            .setMaxSupply(1000)
            .setTreasuryAccountId(operatorId)
            .setSupplyKey(operatorKey)
            .freezeWith(client)
            .sign(operatorKey);

        const tokenCreateSubmit = await tokenCreateTx.execute(client);
        const tokenCreateReceipt = await tokenCreateSubmit.getReceipt(client);
        const tokenId = tokenCreateReceipt.tokenId.toString();

        console.log("Minting NFT...");
        const mintTx = await new TokenMintTransaction()
            .setTokenId(tokenId)
            .setMetadata([nftMetadataBuffer])
            .freezeWith(client)
            .sign(operatorKey);
        await mintTx.execute(client);

        console.log("Associating NFT with recipient...");
        const recipientKey = PrivateKey.fromString(process.env.RECIPIENT_PRIVATE_KEY);
        const associateTx = await new TokenAssociateTransaction()
            .setAccountId(recipientId)
            .setTokenIds([tokenId])
            .freezeWith(client)
            .sign(recipientKey);
        await associateTx.execute(client);

        console.log("Transferring NFT...");
        const transferTx = await new TransferTransaction()
            .addNftTransfer(tokenId, 1, operatorId, recipientId)
            .freezeWith(client)
            .sign(operatorKey);
        await transferTx.execute(client);

        // Save certificate details
        const newCert = {
            tokenId,
            studentName,
            courseName,
            date,
            ipfsUrl,
            recipientId,
        };
        saveCertificate(newCert);

        res.json({
            message: "NFT Minted & Transferred",
            tokenId,
            nftMetadata,
        });
    } catch (error) {
        console.error("Minting Error:", error);
        res.status(500).json({ error: error.message });
    }
});


// 📌 Verify Certificate (On-Chain Verification Endpoint)
app.get("/verify/:tokenId", async (req, res) => {
    try {
        const tokenId = TokenId.fromString(req.params.tokenId);
        const tokenInfo = await new TokenInfoQuery()
            .setTokenId(tokenId)
            .execute(client);

        if (!tokenInfo) {
            return res.status(404).json({ error: "Token not found" });
        }

        // For verification, you may decode the on-chain metadata
        // (Assuming the metadata was stored as a JSON string)
        let metadata = {};
        try {
            metadata = JSON.parse(tokenInfo.tokenMemo);
        } catch (e) {
            console.warn("Could not parse token metadata:", e);
        }

        res.json({
            verified: true,
            tokenInfo,
            metadata,
        });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: "Verification failed" });
    }
});

app.get("/certificates", (req, res) => {
    if (!fs.existsSync(certificatesFile)) {
        return res.json([]);
    }
    const certificates = JSON.parse(fs.readFileSync(certificatesFile));
    res.json(certificates);
});


// 🔹 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
