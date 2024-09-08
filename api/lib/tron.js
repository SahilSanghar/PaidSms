import TronWeb from "tronweb";

// Initialize TronWeb instance
const tronWeb = new TronWeb({
  fullNode: "https://api.trongrid.io",
  solidityNode: "https://api.trongrid.io",
  eventServer: "https://api.trongrid.io",
});

// Function to generate a new TRON address and private key
export async function generateTronAddress() {
  // Generate a new wallet
  const wallet = tronWeb.utils.accounts.generateAccount();

  // Extract the private key and address
  const privateKey = wallet.privateKey;
  const address = tronWeb.address.fromPrivateKey(privateKey);

  return { privateKey, address };
}
