POST	/api/auth/signup	signup new account
POST	/api/auth/signin	login an account
GET	/api/test/all	retrieve public content
GET	/api/test/user	access User’s content
GET	/api/test/admin	access Admin’s content

Authentication:
POST /api/auth/signup
POST /api/auth/signin

Authorization:
GET /api/test/all
GET /api/test/user for loggedin users (user/moderator/admin)
GET /api/test/mod for moderator
GET /api/test/admin for admin


## OUT
localhost:8080/api/auth/signup
{
   "username": "jackson",
   "email": "stasreet@rap.scom",
   "password": "hahaha123!",
   "roles": ["user", "admin"]
}

## localhost:8080/api/auth/signin
{
   "username": "jackson",
   "password": "hahaha123!"
   
}