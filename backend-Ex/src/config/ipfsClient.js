const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const uploadToIPFS = async (fileBuffer) => {
    try {
        const formData = new FormData();
        formData.append("file", fileBuffer, { filename: "metadata.json" });

        const metadata = JSON.stringify({
            name: "Certificate NFT",
            keyvalues: { description: "Blockchain Certification" }
        });
        formData.append("pinataMetadata", metadata);

        const options = JSON.stringify({ cidVersion: 1 });
        formData.append("pinataOptions", options);

        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                ...formData.getHeaders(),
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
            }
        });

        console.log("IPFS Upload Success:", response.data);
        return response.data.IpfsHash;
    } catch (error) {
        console.error("IPFS Upload Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Ensure correct export
module.exports = { uploadToIPFS };
