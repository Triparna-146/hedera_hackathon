const { TokenCreateTransaction, TokenMintTransaction, TokenAssociateTransaction, PrivateKey } = require("@hashgraph/sdk");
const client = require("../config/hederaClient");
const uploadToIPFS = require("../config/ipfsClient");

const NFT_SUPPLY_KEY = PrivateKey.fromString(process.env.NFT_SUPPLY_KEY);

exports.mintCertificate = async (req, res) => {
    try {
        const { studentWallet, courseName, studentName, issuedBy } = req.body;

        // Step 1: Upload metadata to IPFS
        const metadata = JSON.stringify({ courseName, studentName, issuedBy });
        const metadataBuffer = Buffer.from(metadata);
        const metadataCID = await uploadToIPFS(metadataBuffer);


        // Step 2: Create NFT
        const transaction = await new TokenCreateTransaction()
            .setTokenName("CertificateNFT")
            .setTokenSymbol("CERT")
            .setTokenType(1) // NFT
            .setSupplyType(2) // Infinite supply
            .setTreasuryAccountId(process.env.HEDERA_OPERATOR_ID)
            .setSupplyKey(NFT_SUPPLY_KEY)
            .freezeWith(client)
            .sign(NFT_SUPPLY_KEY);

        const txResponse = await transaction.execute(client);
        const tokenId = (await txResponse.getReceipt(client)).tokenId.toString();

        // Step 3: Mint NFT
        const mintTx = await new TokenMintTransaction()
            .setTokenId(tokenId)
            .setMetadata([Buffer.from(metadataCID)])
            .freezeWith(client)
            .sign(NFT_SUPPLY_KEY);

        await mintTx.execute(client);

        // Step 4: Associate Token with Student Wallet
        const associateTx = await new TokenAssociateTransaction()
            .setAccountId(studentWallet)
            .setTokenIds([tokenId])
            .freezeWith(client)
            .sign(NFT_SUPPLY_KEY);

        await associateTx.execute(client);

        res.json({ success: true, tokenId, metadataCID });
    } catch (error) {
        console.error("Minting Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.verifyCertificate = async (req, res) => {
    try {
        const { tokenId } = req.params;
        // Fetch token metadata (Can be fetched via IPFS or Hedera Mirror Node)
        res.json({ success: true, tokenId });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: error.message });
    }
};
