import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import "dotenv/config";

// Configuration constants
const schemaRegistryContractAddress =
  "0x4200000000000000000000000000000000000020";
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

async function registerSchema(schema: string, revocable: boolean) {
  try {
    const provider = new ethers.JsonRpcProvider(
      process.env.BASE_SEPOLIA_HTTPS_RPC
    );
    const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!, provider);
    schemaRegistry.connect(signer);

    const transaction = await schemaRegistry.register({
      schema,
      revocable,
    });

    await transaction.wait();

    return `Schema: ${schema} registered`;
  } catch (err) {
    console.error(err);
    return `Schema registered errored :(`;
  }
}

const schema =
  "string endpoint,uint256 statusCode,uint256 timestamp,bytes32 responseHash";
const revocable = true;

const result = await registerSchema(schema, revocable);
console.log(result);
