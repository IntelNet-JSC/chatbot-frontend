# Step 1: Use an official Node.js image as the base
FROM node:20-alpine AS builder

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --frozen-lockfile

# Step 4: Copy the rest of the app source code
COPY . .

# Step 5: Build the Next.js app
RUN npm run build

# Step 6: Use a minimal Node.js runtime image for production
FROM node:18-alpine AS runner
WORKDIR /app

# Step 7: Copy built files from the builder stage
COPY --from=builder /app ./

# Step 8: Expose port 3000 and run the app
EXPOSE 3000
CMD ["npm", "run", "start"]