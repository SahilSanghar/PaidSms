import TronWeb from "tronweb";

// Function to transfer entire TRX balance
export async function transferEntireBalance(
  senderPrivateKey,
  recipientAddress
) {
  try {
    // Initialize a new TronWeb instance with the sender's private key
    const tronWeb = new TronWeb({
      fullNode: "https://api.trongrid.io",
      solidityNode: "https://api.trongrid.io",
      eventServer: "https://api.trongrid.io",
      privateKey: senderPrivateKey,
    });

    // Get the sender's address
    const senderAddress = tronWeb.address.fromPrivateKey(senderPrivateKey);

    // Get the balance of the sender address (amount in Sun)
    const senderBalance = await tronWeb.trx.getBalance(senderAddress);

    if (senderBalance <= 0) {
      console.log("No balance to transfer.");
      return null;
    }

    // Estimate the transaction fee (assuming a typical fee, adjust if necessary)
    const estimatedFee = 1000000; // 1 TRX in Sun

    // Calculate the amount to transfer
    const amountToTransfer = senderBalance - estimatedFee;

    // Ensure there's enough balance to cover the transaction fee
    if (amountToTransfer <= 0) {
      console.log("Insufficient balance to cover transaction fee.");
      return null;
    }

    // Create the transaction
    const transaction = await tronWeb.transactionBuilder.sendTrx(
      recipientAddress,
      amountToTransfer,
      senderAddress
    );

    // Sign the transaction
    const signedTransaction = await tronWeb.trx.sign(transaction);

    // Broadcast the transaction
    const receipt = await tronWeb.trx.sendRawTransaction(signedTransaction);

    console.log("Transaction receipt:", receipt);
    return receipt;
  } catch (error) {
    console.error("Error during transfer:", error);
    return null;
  }
}
