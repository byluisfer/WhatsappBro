FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy dependencies
COPY ./server/package.json ./server/pnpm-lock.yaml ./
# Install dependencies and asegure that the installed dependencies are exact the same als copyed
RUN pnpm install --frozen-lockfile

# Copy all from server folder
COPY ./server .

# Run the command
CMD ["pnpm", "dev"]