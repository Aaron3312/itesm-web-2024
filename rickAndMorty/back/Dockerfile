# Use the official Node.js 16 image as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /rickAndMorty/back/

# Copy package.json and package-lock.json to work directory
COPY package*.json ./
COPY index.js ./
COPY env.js ./

# Install dependencies in the container
RUN npm install

# Copy the rest of your application's code to the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]
