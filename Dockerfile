FROM node:18-slim

# Instal dependensi dasar sistem untuk menjalankan Chromium & Xvfb headless
RUN apt-get update && apt-get install -y \
    chromium \
    xvfb \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Konfigurasi environment untuk Puppeteer bawaan system
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ekspos port default Railway
EXPOSE 3000

# Jalankan server via virtual display buffer
CMD ["xvfb-run", "--server-args=-screen 0 1280x1024x24", "node", "run.js"]
