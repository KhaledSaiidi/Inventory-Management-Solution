(function(window) {
  window.__env = window.__env || {};
  window.__env.KEYCLOAK_URL = '${KEYCLOAK_URL}';
  window.__env.KEYCLOAK_REALM = '${KEYCLOAK_REALM}';
  window.__env.KEYCLOAK_CLIENT_ID = '${KEYCLOAK_CLIENT_ID}';
  window.__env.API_URL = '${API_URL}';
})(this);
