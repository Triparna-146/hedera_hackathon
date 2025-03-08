const { Client } = require("@hashgraph/sdk");
require("dotenv").config();

const client = Client.forTestnet(); // Use for Mainnet if needed
client.setOperator(process.env.HEDERA_OPERATOR_ID, process.env.HEDERA_OPERATOR_KEY);

module.exports = client;
