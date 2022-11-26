FROM node:16-alpine

WORKDIR /app

# Install app dependencies.
COPY package.json ./

RUN yarn install --silent --ignore-engines

# Copy files (other than whatever is in .dockerignore) to the working directory.
COPY . ./
