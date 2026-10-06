# EventHorizon Backend API

## Project Description

EventHorizon is a backend service for a local tech meetup platform. It provides user registration, authentication, email verification, and protected user profile access.

## Features

- User registration
- Joi validation for incoming data
- Secure password hashing with bcrypt
- User login with JWT authentication
- Protected user profile route
- Email verification using a time-sensitive verification token
- Email delivery using Nodemailer
- Prevention of login for unverified users
- MongoDB database with Mongoose
- Environment variable configuration
- Error handling with appropriate HTTP status codes


## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Joi
- bcrypt
- JSON Web Token (JWT)
- Nodemailer
- dotenv
- crypto
- morgan
- ejs

## Requirements

Before running this project, make sure you have the following installed:

- Node.js
- npm
- MongoDB
- Git


## Installation & Setup

### 1. Clone the repository

`bash
git clone https://github.com/FrancisBE-web/FrancisOparanadi-cohort-9-Assignment.git

### 2. Navigate into the project folder

cd FrancisOparanadi-cohort-9-Assignment

### 3. Install dependencies
npm install 

### 4. Create a .env file
Create a .env file in the root directory of the project and add the required environment variables.

PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_password
BASE_URL=http://localhost:5002

### 5. Start the server

For development:
npm run dev

The server should run on:
http://localhost:5002


## API Endpoints

### Authentication

#### Register a User

POST /api/auth/register

Registers a new user and sends an email verification link.

Request body:

`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}


 ### Verify Email

GET /api/auth/verify-email?token=YOUR_VERIFICATION_TOKEN
Verifies a user's email address using the unique verification token sent to their email.
A valid and unexpired token marks the user's account as verified.

 ### Login
POST /api/auth/login
Logs in a verified user and returns a JWT access token.
Request body:
{
  "email": "john@example.com",
  "password": "Password123"
}

### User Profile

Gets User Profile
GET /api/auth/user/profile
This is a protected route and requires a valid JWT access token.

Authorization:
Bearer YOUR_JWT_TOKEN
The token should be sent in the request's Authorization header


## Authentication Flow

### Registration

1. The user submits their name, email, and password.
2. Joi validates the registration data.
3. The password is hashed securely using bcrypt.
4. The user is saved to MongoDB.
5. A unique, time-sensitive email verification token is generated.
6. A verification link is sent to the user's email using Nodemailer.

### Email Verification

1. The user clicks the verification link received by email.
2. The server validates the verification token.
3. The server checks that the token has not expired.
4. If the token is valid, the user's account is marked as verified.
5. The user can now log in.

### Login

1. The user submits their email and password.
2. Joi validates the login data.
3. The server checks whether the user exists.
4. The server checks whether the user's email has been verified.
5. The password is compared with the hashed password using bcrypt.
6. A JWT access token is generated and returned to the user.

### Protected Routes

Protected routes require a valid JWT access token.

The token is sent using the Authorization header:

`text
Authorization: Bearer YOUR_JWT_TOKEN

If the token is missing, invalid, or expired, access to the protected route is denied.

## Security

This project implements the following security measures:

- Passwords are hashed using bcrypt before being stored.
- JWT is used for authenticated requests.
- Email verification is required before login.
- Email verification tokens are separate from login JWTs.
- Verification tokens are time-sensitive and expire.
- Sensitive configuration values are stored in environment variables.
- `.env` is excluded from Git using `.gitignore`.
- Joi is used to validate incoming user data.


## Error Handling

The API returns appropriate HTTP status codes and error messages for different situations, including:

- 200 OK - Request completed successfully.
- 201 Created - Resource created successfully.
- 400 Bad Request - Invalid or missing input data.
- 401 Unauthorized - Authentication is required or the provided token is invalid.
- 404 Not Found - Requested resource was not found.
- 409 Conflict - A resource already exists, such as an already registered email.
- 500 Internal Server Error - Unexpected server error.

## Testing

The API can be tested using Postman or Thunder Client.

The main endpoints to test are:

- User registration
- Email verification
- User login
- Protected user profile

For protected routes, include the JWT returned from the login request as a Bearer Token in the Authorization header.

Example:

`text
Authorization: Bearer YOUR_JWT_TOKEN

## Author

Francis Opara-Nadi

GitHub: https://github.com/FrancisBE-web/FrancisOparanadi-cohort-9-Assignment