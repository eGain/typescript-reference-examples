const axios = require("axios");
require("dotenv").config();

class EGainAuth {
  constructor() {
    this.clientId = process.env.EGAIN_CLIENT_ID;
    this.clientSecret = process.env.EGAIN_CLIENT_SECRET;
    this.tokenUrl = process.env.EGAIN_TOKEN_URL;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get access token using client credentials grant
   * @returns {Promise<string>} Access token
   */
  async getAccessToken() {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        this.tokenUrl,
        {
          grant_type: "client_credentials",
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: "app.core.aiservices.read",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry time (subtract 5 minutes for safety)
      this.tokenExpiry =
        Date.now() + response.data.expires_in * 1000 - 5 * 60 * 1000;

      console.log("Successfully obtained access token");
      return this.accessToken;
    } catch (error) {
      console.error(
        "Error obtaining access token:",
        error.response?.data || error.message
      );
      throw new Error("Failed to obtain access token");
    }
  }
}

module.exports = EGainAuth;
