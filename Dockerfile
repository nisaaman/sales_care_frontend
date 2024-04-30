# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine 
# Set the working directory to /app inside the container
WORKDIR /app/front-end
# Copy app files
COPY public public
COPY src src
COPY package.json package.json
COPY .env .env
# COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
# RUN npm ci 
# RUN npm install -g npm@7.24.2
RUN npm install -g npm@6.14.4
RUN npm install
# Build the app
RUN npm run build
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3005
# Start the app
# CMD [ "npx", "serve", "build" ]
# CMD [ "npm", "start"]
RUN npm i -g serve
# RUN serve -l 3005 -s build
CMD ["serve", "-l", "3005", "-s", "build"]
