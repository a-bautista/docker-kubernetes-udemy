# Specify a base image
# FROM node --> you can use this but this will install many extra features that you might not need
FROM node:alpine

# Specify all your working files in this directory
WORKDIR /usr/app


# Get the package.json file and install ONLY the dependencies that are written in this file when you execute the npm install command because this process will be much faster
# ./ outside directory ./ docker directory
COPY ./package.json ./

# Command to literally install the dependencies from the package.json file
RUN npm install 

# Copy all the installed files from the dependencies
COPY ./ ./



# Default command
CMD ["npm", "start"]

