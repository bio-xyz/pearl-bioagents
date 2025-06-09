import {
  EAS,
  SchemaEncoder,
  NO_EXPIRATION,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import "dotenv/config";
import crypto from "crypto";

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
      "string endpoint,uint256 statusCode,uint256 timestamp,string trajectoryId,string agentMode"
    );
    const encodedData = schemaEncoder.encodeData([
      { name: "endpoint", value: "/v0.1/crows", type: "string" },
      { name: "statusCode", value: 200, type: "uint256" },
      {
        name: "timestamp",
        value: Math.floor(Date.now() / 1e3),
        type: "uint256",
      },
      {
        name: "trajectoryId",
        value: crypto.randomUUID(),
        type: "string",
      },
      {
        name: "agentMode",
        value: "PHOENIX",
        type: "string",
      },
    ]);

    const schemaUID =
      "0xd944ecf37244acba594544a9bf911abf61cff830bf83f6a19b3d2e864498b1f1";

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
