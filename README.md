# Agronify-api
This repository is part of our Bangkit 2023 Product Capstone "Agronify". Built with REST implementation and JWT Authentication.

# Tech Used
This project is built with the following tech stack and libraries :
- NodeJS
- Prisma ORM
- HapiJs
- PostgreSQL
- TensorflowJS

# Api Documentation : 
Api documentation is available on Postman, please click the following button to view the documentation :

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/25099554-02aaef01-48f5-43cb-ad27-8bc280db4294?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D25099554-02aaef01-48f5-43cb-ad27-8bc280db4294%26entityType%3Dcollection%26workspaceId%3D4687e208-3e5b-4cd9-96d2-5816e844de18)

# Prerequisites
- Docker
- Docker Compose
- Postgresql Database

# How to run

1. Clone this repository
2. Create postgresql database with the name `agronify`
3. Insert `agronify.sql` to the database
4. Copy `.env.example` to `.env` and fill the environment variables with your own
5. Run `docker-compose up -d` to run the server
6. Server will be running on port `20080` (main branch) or `80` (production branch)
7. Default email and password is `admin@agronify.com` and `admin123`
7. You'll need to add crop, crop disease, ml model, and model class mapping before doing any prediction.
