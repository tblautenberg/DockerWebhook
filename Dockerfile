# Use lightweight badass base
FROM node:20-slim

# Create app dir
WORKDIR /DockerWebhook

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Install kubectl safely
RUN apt-get update && \
    apt-get install -y curl ca-certificates gnupg && \
    curl -fsSLo /usr/local/bin/kubectl https://dl.k8s.io/release/v1.29.0/bin/linux/amd64/kubectl && \
    chmod +x /usr/local/bin/kubectl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*


# Copy your deadly code
COPY webhook-deployer.js .
COPY aspcalc.yaml .

# Run the bitch
CMD ["node", "webhook-deployer.js"]
