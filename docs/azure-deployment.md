# Azure Deployment Guide

This guide explains how to deploy the Artify backend to Azure App Service using Docker containers.

## Prerequisites

1. An active Azure account
2. Docker Hub repository with your container image
3. GitHub repository configured with GitHub Actions

## Azure Portal Deployment Steps

### 1. Create an App Service

1. Log in to the [Azure Portal](https://portal.azure.com/)
2. Click "Create a resource"
3. Search for "Web App" and select it
4. Fill in the following details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or select existing
   - **Name**: Choose a unique name (e.g., artify-backend)
   - **Publish**: Docker Container
   - **Operating System**: Linux
   - **Region**: Choose a region close to your users
   - **App Service Plan**: Create new or select existing (B1 or higher recommended)

5. Click "Next: Docker"

6. Configure Docker settings:
   - **Options**: Single Container
   - **Image Source**: Docker Hub
   - **Access Type**: Public
   - **Image and tag**: yourusername/artify-backend:latest (use your Docker Hub username)
   - **Startup Command**: Leave empty (uses CMD from Dockerfile)

7. Click "Review + create" and then "Create"

### 2. Configure Environment Variables

1. After deployment, go to your App Service resource
2. In the left menu, select "Configuration" under "Settings"
3. Add all required environment variables from your `.env` file:
   - FIREBASE_PROJECT_ID
   - FIREBASE_CLIENT_EMAIL
   - FIREBASE_PRIVATE_KEY
   - MONGO_URI (if using MongoDB)
   - NODE_ENV=production
   - Other app-specific variables

4. Click "Save" and confirm

### 3. Enable Continuous Deployment

1. In the left menu, select "Deployment Center" under "Deployment"
2. Choose "Docker Hub" as the source
3. Configure the Docker Hub settings:
   - **Repository Access**: Public
   - **Repository**: yourusername/artify-backend
   - **Tag**: latest

4. Click "Save"

5. Azure will now automatically deploy whenever a new image is pushed to Docker Hub with the "latest" tag

## Verifying Deployment

1. Go to your App Service URL (https://your-app-name.azurewebsites.net)
2. You should see the "API is running" message
3. Test the API endpoints using Postman or another API testing tool

## Troubleshooting

If you encounter issues:

1. Check "Log stream" in the Azure portal
2. Review "Application logs" in the "Monitoring" section
3. Verify that all environment variables are correctly set
4. Ensure your container has no issues when running locally
