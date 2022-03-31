# backend-github-oauth

- Use OAuth to create & log in users
- Use Express middleware to ensure requests are authenticated
- Use cookies to store user data
- Use JWTs for storing user data in cookies
- Sign & verify JWTs to ensure validitity
- Utilize GitHub OAuth for authentication

# To do:

- [x] GET (/api/v1/github/login)
- [x] GET (/api/v1/github/login/callback)
- [x] DELETE (/api/v1/github)
- [] GET (/api/v1/posts)
- [x] POST (api/v1/posts)
- [x] GithubUser model
- [] Post model
- [] Auth middleware protects /api/v1/posts
- [] Tests for all routes
