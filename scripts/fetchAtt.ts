import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import "dotenv/config";

async function fetchAttestation() {
  // Use constants for configurations
  const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021";

  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  const provider = new ethers.JsonRpcProvider(
    process.env.BASE_SEPOLIA_HTTPS_RPC
  );
  eas.connect(provider);

  const UID =
    "0x756507cfcaf8110327849b032926fea8749f5edb1babac405e045052c852bd81";

  try {
    const attestation = await eas.getAttestation(UID);
    console.log(attestation);
  } catch (error) {
    console.error("Error fetching attestation:", error);
  }
}

fetchAttestation();
