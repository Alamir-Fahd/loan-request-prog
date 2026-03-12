Service: auth-service API Contract

Endpoint: /login
Metho: POST
Input (JSON): { ""user"": ""string"", ""pass"": ""string"" }
Success Response (200 OK): { ""success"": true, ""role"": ""admin"" }
Error Response (401/400): { ""success"": false, ""message"": ""Invalid credentials"" }
