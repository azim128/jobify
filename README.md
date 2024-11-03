# Project Name: Joblify

## Installation:

1. Clone the repository
   `git clone git@github.com:azim128/jobify.git`
2. change branch to backend
   `git checkout backend`
3. Install dependencies
   `npm install`
4. Start the server with nodemon
   `npm run dev`

## Packages Used:

- express
- mongoose
- jsonwebtoken
- bcrypt
- dotenv
- nodemon
- cors
- morgan
- openai
- cloudinary

## Jobify API Documentation

A robust job portal API built with Node.js, Express, and MongoDB, featuring role-based access control, AI-powered job descriptions, and comprehensive activity logging.

## Table of Contents

- [Entities](#entities)
- [API Endpoints](#api-endpoints)
- [Roles & Permissions](#roles--permissions)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)

## Entities

### User

- ID
- Name
- Email
- Password (hashed)
- Role (admin/super-admin)
- Permissions
- Active Status
- Reset Token Info
- Timestamps

### Company

- ID
- Name
- Description
- Location
- Logo URL
- Industry
- Created By
- Timestamps

### Job

- ID
- Title
- Description
- Requirements
- Responsibilities
- Salary Range
- Location
- Type
- Level
- Company Reference
- Created By
- Description File URL
- Timestamps

### Activity Log

- ID
- Action
- Resource
- Resource ID
- User ID
- Details
- Timestamps

### File Upload

- ID
- File Type
- URL
- Uploaded By
- Company/Job Reference
- Timestamps

## API Endpoints

| Method                     | Endpoint                           | Description                | Access             |
| -------------------------- | ---------------------------------- | -------------------------- | ------------------ |
| **Authentication**         |
| POST                       | /api/v1/auth/login                 | User login                 | Public             |
| POST                       | /api/v1/auth/forgot-password       | Request password reset     | Public             |
| POST                       | /api/v1/auth/reset-password/:token | Reset password             | Public             |
| **Super Admin Management** |
| POST                       | /api/v1/super-admin/create-first   | Create first super admin   | Public (Once only) |
| POST                       | /api/v1/super-admin/create-admin   | Create new admin           | Super Admin        |
| GET                        | /api/v1/super-admin/admins         | Get all admins             | Super Admin        |
| GET                        | /api/v1/super-admin/admins/:id     | Get single admin           | Super Admin        |
| PATCH                      | /api/v1/super-admin/admins/:id     | Update admin               | Super Admin        |
| DELETE                     | /api/v1/super-admin/admins/:id     | Delete admin               | Super Admin        |
| **Company Management**     |
| POST                       | /api/v1/company                    | Create company             | Admin, Super Admin |
| GET                        | /api/v1/company                    | Get all companies          | Admin, Super Admin |
| GET                        | /api/v1/company/:id                | Get single company         | Admin, Super Admin |
| PATCH                      | /api/v1/company/:id                | Update company             | Admin, Super Admin |
| DELETE                     | /api/v1/company/:id                | Delete company             | Admin, Super Admin |
| **Job Management**         |
| POST                       | /api/v1/job                        | Create job                 | Admin, Super Admin |
| GET                        | /api/v1/job                        | Get all jobs               | Admin, Super Admin |
| GET                        | /api/v1/job/:id                    | Get single job             | Admin, Super Admin |
| PATCH                      | /api/v1/job/:id                    | Update job                 | Admin, Super Admin |
| DELETE                     | /api/v1/job/:id                    | Delete job                 | Admin, Super Admin |
| **AI Features**            |
| POST                       | /api/v1/ai/jobs/generate           | Generate job description   | Admin, Super Admin |
| **Activity Logs**          |
| GET                        | /api/v1/activity-logs              | Get all activity logs      | Super Admin        |
| GET                        | /api/v1/activity-logs/:resourceId  | Get resource activity logs | Super Admin        |

## Roles & Permissions

### Super Admin

- Full system access
- Manage other admins
- All permissions of regular admin
- View activity logs

### Admin

Configurable permissions for:

- Add/Edit/Delete Companies
- Add/Edit/Delete Jobs
- AI Text Generation
- File Uploads

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header.

## Author:

- [@azim](https://github.com/azim128)
