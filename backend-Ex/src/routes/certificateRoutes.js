const express = require("express");
const { mintCertificate, verifyCertificate } = require("../controllers/certificateController");
const router = express.Router();

router.post("/mint", mintCertificate);
router.get("/verify/:tokenId", verifyCertificate);

module.exports = router;
