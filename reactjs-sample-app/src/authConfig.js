const tenantId = "<tenant_id>";
const hostname = "<hostname>";

const eGainDomain = "aidev.egain.cloud";

/**
 * Simple OIDC Configuration
 */
export const authConfig = {
  // Identity provider URL
  authority: `https://${eGainDomain}/system/auth/${tenantId}-U`,

  // Client application ID
  client_id: "<client_id>",

  // Where to redirect after login
  redirect_uri: `http://${hostname}/`,

  // Where to redirect after logout
  post_logout_redirect_uri: `http://${hostname}/`,

  // OAuth scopes
  scope: "knowledge.portalmgr.read core.aiservices.read openid",

  // Use authorization code flow
  response_type: "code",

  // Load user profile
  loadUserInfo: false,

  // Filter protocol claims
  filterProtocolClaims: true,

  // Provider metadata
  metadata: {
    issuer: `https://${eGainDomain}/system/auth/${tenantId}-U`,
    authorization_endpoint: `https://${eGainDomain}/system/auth/${tenantId}-U/oauth2/authorize`,
    token_endpoint: `https://${eGainDomain}/system/auth/${tenantId}-U/oauth2/token`,
    end_session_endpoint: `https://${eGainDomain}/system/auth/${tenantId}-U/connect/logout`,
  },
};
