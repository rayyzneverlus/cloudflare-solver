FROM node:18-slim

# Instal semua dependensi OS untuk Chromium dan layar virtual (Xvfb)
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

# Set up environment variables untuk Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Beritahu Railway port yang akan dibuka (Railway akan mendeteksi ini)
EXPOSE 3000

# Jalankan aplikasi menggunakan xvfb-run agar browser tidak crash saat 'headless'
CMD ["xvfb-run", "--server-args=-screen 0 1280x1024x24", "node", "run.js"]
