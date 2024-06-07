# Use the official Node.js 18 image with Alpine Linux as the base image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /

# Install dependencies for the client
WORKDIR /client
COPY client/package.json client/yarn.lock ./
RUN yarn install --production

# Build the client
COPY client/src ./src
COPY client/public ./public
RUN yarn build

# Install dependencies for the server
WORKDIR /server
COPY server/package.json server/yarn.lock ./
RUN yarn install --production

# Copy the rest of the application code into the container
WORKDIR /
COPY . .

# Command to run when the container starts
CMD ["node", "server/server.js"]

# Expose port 8080
EXPOSE 8080
