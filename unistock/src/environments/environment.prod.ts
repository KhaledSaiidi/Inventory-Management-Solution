export const environment = {
  production: true,
  auth: {
    issuer: "http://localhost:8181/realms/phoenixstock",
    redirectUri: "http://localhost:8100",
    clientId: 'front-client',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    showDebugInformation: true,
    requireHttps: false
  }

};
