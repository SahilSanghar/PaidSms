import fetch from "node-fetch";

// Function to convert amount to TRX
function formatAmount(amount) {
  return (amount / 1e6).toFixed(6); // Convert sun to TRX and format to 6 decimal places
}

// Function to make the fetch request
export async function fetchTransactions(address, hash) {
  const apiUrl = `https://apilist.tronscanapi.com/api/transaction?&address=${address}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    let trxAmount = 0;

    if (data && Array.isArray(data.data)) {
      data.data.forEach((transaction) => {
        if (transaction.hash === hash) {
          trxAmount = formatAmount(parseFloat(transaction.amount));
        }
      });

      if (trxAmount === 0) {
        return { message: "No matching hash found." };
      }
    } else {
      throw new Error("Unexpected data format");
    }

    return { trx: trxAmount };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return { error: error.message };
  }
}
