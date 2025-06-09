import {
  EAS,
  SchemaEncoder,
  NO_EXPIRATION,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import "dotenv/config";

// Configuration constants
const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021";

async function attest() {
  try {
    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(
      process.env.BASE_SEPOLIA_HTTPS_RPC
    );
    const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!, provider);
    const eas = new EAS(EAS_CONTRACT_ADDRESS);
    eas.connect(signer);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "string endpoint,uint256 statusCode,uint256 timestamp,bytes32 responseHash"
    );
    const encodedData = schemaEncoder.encodeData([
      { name: "endpoint", value: "/v0.1/crows", type: "string" },
      { name: "statusCode", value: 200, type: "uint256" },
      { name: "timestamp", value: 1749471048885, type: "uint256" },
      {
        name: "responseHash",
        value: "620df451e4c04f80c6cba0ae6093",
        type: "bytes32",
      },
    ]);

    const schemaUID =
      "0x3c4e5a80067fbc845ac6aee811e0dc9798a76d32df383f6c5279f8e57c248c9e";

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: signer.address,
        expirationTime: NO_EXPIRATION,
        revocable: true,
        refUID: ethers.ZeroHash,
        data: encodedData,
        value: 0n,
      },
    });

    const uid = await tx.wait();
    console.log("Attestation UID:", uid);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

attest();
