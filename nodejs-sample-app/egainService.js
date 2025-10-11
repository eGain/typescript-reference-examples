const { Egain } = require("@egain/egain-api-typescript");

class EGainService {
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * Get chunks
   * @param {string} query - The query
   * @returns {Promise<Object>} Chunks
   */
  async retrieveChunks(query) {
    try {
      const egainClient = new Egain({
        accessToken: await this.authService.getAccessToken(),
      });

      // Call the eGain API to get chunks
      const response = await egainClient.aiservices.retrieve.retrieveChunks({
        q: query,
        portalID: process.env.EGAIN_PORTAL_ID,
        language: "en-US",
        retrieveRequest: {
          channel: {
            name: "Sample App",
          },
        },
      });

      return response;
    } catch (error) {
      console.error(`Error fetching chunks:`, error.message);
      throw error;
    }
  }
}

module.exports = EGainService;
