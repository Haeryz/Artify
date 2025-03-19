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
3. Add all required environment variables:

   | Name | Value | Note |
   |------|-------|------|
   | FIREBASE_PROJECT_ID | your-project-id | From Firebase console |
   | FIREBASE_CLIENT_EMAIL | your-client-email@firebase.com | From Firebase service account |
   | FIREBASE_PRIVATE_KEY | -----BEGIN PRIVATE KEY-----\nxxxx\n-----END PRIVATE KEY----- | From Firebase service account json |
   | NODE_ENV | production | Set as production for deployment |
   | PORT | 5000 | The port your app will run on |
   | FRONTEND_URL | https://your-frontend-url.com | For CORS settings |

   > **IMPORTANT:** For the FIREBASE_PRIVATE_KEY, you need to include the entire key INCLUDING the newline characters (represented as \n). When copying from a JSON file, the key might appear as a single line with escaped newlines - keep it exactly as is.

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
3. Visit the health endpoint (https://your-app-name.azurewebsites.net/health) to check system status
4. Test the API endpoints using Postman or another API testing tool

## Troubleshooting

### Common Issue: Firebase Configuration Not Found

If you see errors like `ERR_MODULE_NOT_FOUND, url: file:///usr/src/app/config/firebase.js`:

1. Make sure your Docker image includes all required configuration files
2. Check that all Firebase environment variables are correctly set in Azure App Service Configuration
3. Verify the format of FIREBASE_PRIVATE_KEY, especially the newline characters (\n)
4. Try restarting the App Service after updating environment variables

### Container Fails to Start

1. Check the Log Stream in Azure Portal under "Monitoring" to see error messages
2. Verify environment variables are correctly set
3. Test the Docker image locally first:
   ```bash
   docker run -p 5000:5000 -e FIREBASE_PROJECT_ID=xxx -e FIREBASE_CLIENT_EMAIL=xxx -e FIREBASE_PRIVATE_KEY="xxx" yourusername/artify-backend
   ```
4. Try increasing the App Service startup time in Configuration > General Settings

### Checking Logs

1. In Azure Portal, go to your App Service
2. Under "Monitoring", select "Log stream"
3. View real-time logs of your application
4. For more detailed logs, enable "App Service Logs" under "Monitoring"
