const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// 1. Configure the JWKS client to fetch public keys from Keycloak dynamically
const client = jwksClient({
  jwksUri: ${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs
});

// Helper function for jwt.verify to fetch the correct key
function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey  key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// 2. The actual middleware function
function requireAuth(req, res, next) {
  // Extract the Bearer token from the header
  const authHeader = req.headers.authorization;
  if (!authHeader  !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  // 3. Verify the token using Keycloak's public key
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    // 4. Attach the decoded payload (including sub / user ID) to the request
    req.user = decoded;
    next();
  });
}

module.exports = { requireAuth };
