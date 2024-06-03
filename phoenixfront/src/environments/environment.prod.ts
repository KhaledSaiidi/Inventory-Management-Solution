export const environment = {
  production: true,
  keycloak: {
    url: 'http://__KEYCLOAK_HOSTNAME__:8181',
    realm: 'phoenixstock',
    clientId: 'front-client'
  },
  url: 'http://__API_HOSTNAME__:9000'
};

