import { readFileSync, existsSync } from "fs";
import { decodeFirebaseConfig } from "./firebaseConfigCrypto.ts";
import { initializeApp, applicationDefault, cert, App, ServiceAccount } from "firebase-admin/app";

// Get Firebase App instance with config from env, encoded file, or fallback to JSON
export function getFirebaseApp(): App {
  const encodedConfig = process.env.FIREBASE_ENCODED_CONFIG || "";
  const secretKey = process.env.FIREBASE_SECRET_KEY || "";

  let credential;

  if (encodedConfig && secretKey) {
    // Decode from env
    const configData = decodeFirebaseConfig(encodedConfig, secretKey);
    credential = cert(JSON.parse(configData.toString("utf-8")) as ServiceAccount);
  } else {
    // Use env for encoded config file name
    const encodedFile = process.env.FIREBASE_ENCODED_CONFIG_FILE || "firebase_config_encoded.txt";
    if (existsSync(encodedFile)) {
      const encodedData = readFileSync(encodedFile, "utf-8");
      if (!secretKey) throw new Error("FIREBASE_SECRET_KEY environment variable is required");
      const configData = decodeFirebaseConfig(encodedData, secretKey);
      credential = cert(JSON.parse(configData.toString("utf-8")) as ServiceAccount);
    } else {
      // Use env for plain config file name
      const plainFile = process.env.FIREBASE_CONFIG_FILE || "firebaseConfig.json";
      if (existsSync(plainFile)) {
        credential = cert(JSON.parse(readFileSync(plainFile, "utf-8")) as ServiceAccount);
      } else {
        // Fallback to application default
        credential = applicationDefault();
      }
    }
  }

  return initializeApp({ credential });
}
