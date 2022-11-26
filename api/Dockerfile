FROM node:16-alpine

WORKDIR /app

# Install dependencies.
COPY package.json ./
RUN npm --loglevel error install

# Copy files (other than whatever is in .dockerignore) to the working directory.
COPY . .
