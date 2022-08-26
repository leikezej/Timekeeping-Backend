POST	/api/auth/signup	signup new account
POST	/api/auth/signin	login an account
GET	/api/test/all	retrieve public content
GET	/api/test/user	access User’s content
GET	/api/test/admin	access Admin’s content

POST	/api/auth/signup	signup new account
POST	/api/auth/signin	login an account
GET	/api/test/all	retrieve public content
GET	/api/test/user	access User’s content
GET	/api/test/admin	access Admin’s content

Authentication:
POST /api/auth/signup
POST /api/auth/signin

http://192.168.1.150:8080/api/auth/user/change-password/1
   {
      "password": "123123"
   }

POST	/users	         create user
POST	/password-reset	Send password reset link
POST	/password-reset/:userId/:token	Reset user password

Authorization:
GET /api/test/all
GET /api/test/user for loggedin users (user/moderator/admin)
GET /api/test/mod for moderator
GET /api/test/admin for admin

Methods	Urls	Actions
POST	/users	create user
POST	/password-reset	Send password reset link
POST	/password-reset/:userId/:token	Reset user password



POST	/users	         create user
POST	/password-reset	Send password reset link
POST	/password-reset/:userId/:token	Reset user password

Authorization:
GET /api/test/all
GET /api/test/user for loggedin users (user/moderator/admin)
GET /api/test/mod for moderator
GET /api/test/admin for admin


### FILE UPLOAD:
Methods	Urls	Actions
POST	/upload	upload a File
GET	/files	get List of Files (name & url)
GET	/files/[filename]	download a File

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


// app.post("/reset_password", controller.resetPassword)

// changen password
app.post("/change_Password", controller.changePassword)


// reset password. request reset password
axios.post(`http://localhost:8080/api/auth/reset_password/${email}`)

// update password insert new password
axios.post(`http://localhost:8080/api/auth/update_password/${userId}/${token}`)



		{
			"name": "Change User Password",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Accept",
						"value": "application/json",
						"type": "default"
					},
					{
						"key": "Authorization",
						"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjE3NDg0MWNkYjYwNDBmMWU2NzI4M2YiLCJpYXQiOjE2NDU2OTMwMTIsImV4cCI6MTY0NjEyNTAxMn0.pHa_3QxsAy0hSFEfp4RYrmGecAARUwIIhB8K73SolBU",
						"type": "text"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"password\":\"hello\",\r\n    \"password_confirmation\":\"hello\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:8000/api/user/changepassword",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8000",
					"path": [
						"api",
						"user",
						"changepassword"
					]
				}
			},
			"response": []
		},
      		{
			"name": "Logged User Detail",
			"request": {
				"method": "GET",
				"header": [
					{
						"key": "Accept",
						"value": "application/json",
						"type": "default"
					},
					{
						"key": "Authorization",
						"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjE3NDg0MWNkYjYwNDBmMWU2NzI4M2YiLCJpYXQiOjE2NDU2OTMwMTIsImV4cCI6MTY0NjEyNTAxMn0.pHa_3QxsAy0hSFEfp4RYrmGecAARUwIIhB8K73SolBU",
						"type": "text"
					}
				],
				"url": {
					"raw": "http://localhost:8000/api/user/loggeduser",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8000",
					"path": [
						"api",
						"user",
						"loggeduser"
					]
				}
			},
			"response": []
		},
		{
			"name": "Send Password Reset Email",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Accept",
						"value": "application/json",
						"type": "default"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"email\":\"sonam@example.com\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:8000/api/user/send-reset-password-email",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8000",
					"path": [
						"api",
						"user",
						"send-reset-password-email"
					]
				}
			},
			"response": []
		},
		{
			"name": "Password Reset",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Accept",
						"value": "application/json",
						"type": "default"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"password\":\"12345678\",\r\n    \"password_confirmation\":\"12345678\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:8000/api/user/reset-password/62174841cdb6040f1e67283f/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjE3NDg0MWNkYjYwNDBmMWU2NzI4M2YiLCJpYXQiOjE2NDU2OTMxNzgsImV4cCI6MTY0NTY5NDA3OH0.XcuRC6ZY-eEk0e2Is4xwcmrKSyVugRaEmLCwyolre3E",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8000",
					"path": [
						"api",
						"user",
						"reset-password",
						"62174841cdb6040f1e67283f",
						"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjE3NDg0MWNkYjYwNDBmMWU2NzI4M2YiLCJpYXQiOjE2NDU2OTMxNzgsImV4cCI6MTY0NTY5NDA3OH0.XcuRC6ZY-eEk0e2Is4xwcmrKSyVugRaEmLCwyolre3E"
					]
				}
			},
			"response": []
		}
	]
}