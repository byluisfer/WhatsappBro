FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy dependencies
COPY ./client/package.json ./client/pnpm-lock.yaml ./
# Install dependencies and asegure that the installed dependencies are exact the same als copyed
RUN pnpm install --frozen-lockfile

# Copy all from client folder
COPY ./client .

# Run the command
CMD ["pnpm", "dev"]