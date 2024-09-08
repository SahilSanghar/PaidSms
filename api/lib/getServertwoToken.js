import fetch from "node-fetch";
import { ServerModel } from "../models/servers.js";

export default async function getServerTwoToken() {
  const updateServerToken = async () => {
    console.log("Server two token process started");
    try {
      const server9response = await ServerModel.findOne({ server: 9 });

      if (!server9response) {
        console.error("Server 9 token not found.");
        return;
      }

      // Step 1: Fetch the token
      const response = await fetch(
        `http://www.phantomunion.com:10023/pickCode-api/push/ticket?key=${server9response.token}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.data || !data.data.token) {
        console.error("Token not found in the response.");
        return;
      }

      const token = data.data.token;
      console.log("Token fetched:", token);

      // Step 2: Make the POST request with the token
      const postResponse = await fetch(
        `${process.env.BASE_URL}/api/add-server`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            server: 9,
            api_key: token,
          }),
        }
      );

      if (!postResponse.ok) {
        throw new Error(`Failed to add server: ${postResponse.statusText}`);
      }

      console.log("Server token updated successfully.");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Run once when the server starts
  await updateServerToken();

  // Then start the interval
  setInterval(updateServerToken, 7200000); // 2 hours interval
}
