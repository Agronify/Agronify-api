# Agronify-api
This repository is part of our Bangkit 2023 Product Capstone "Agronify". Built with REST implementation and JWT Authentication.

# Tech Used
This project is built with the following tech stack and libraries :
- NodeJS
- Prisma ORM
- HapiJs
- PostgreSQL
- TensorflowJS
- RTK Query
- React
- Tailwind CSS
- Material UI 

# Api Documentation : 
Api documentation is available on Postman, please click the following button to view the documentation :

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/25099554-02aaef01-48f5-43cb-ad27-8bc280db4294?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D25099554-02aaef01-48f5-43cb-ad27-8bc280db4294%26entityType%3Dcollection%26workspaceId%3D4687e208-3e5b-4cd9-96d2-5816e844de18)

# Installation
This repository is ready to be installed using docker compose, please ensure you have google-cloud-key.json in root project directory and add .env based on .env.example

To build image:
```
docker compose build
```
To run image in container:
```
docker compose up 
```
This will create container that exposing port 20080 (master branch) or 80 (production branch)