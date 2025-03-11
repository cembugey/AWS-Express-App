# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package files and the prisma folder so the schema is available
COPY package*.json ./
COPY prisma ./prisma

# Copy the .env file (ensure it's not in your .dockerignore)
COPY .env ./

# Install dependencies (this will run the postinstall script and find the Prisma schema)
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
