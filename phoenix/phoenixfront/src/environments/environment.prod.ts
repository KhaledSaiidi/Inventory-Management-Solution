export const environment = {
  production: true,
  keycloak: {
    url: window.__env.KEYCLOAK_URL || 'http://localhost:8181',
    realm:'phoenixstock',
    clientId:'front-client'
  },
  url: window.__env.API_URL || 'http://localhost:9000'
};

