FROM node:18

# Instal dependensi esensial untuk Google Chrome dan Xvfb
RUN apt-get update && apt-get install -y \
    xvfb \
    x11-xserver-utils \
    libxss1 \
    libgconf-2-4 \
    libnss3 \
    libasound2 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Jalankan Xvfb secara eksplisit sebelum memanggil Node
CMD ["xvfb-run", "--server-args=-screen 0 1280x1024x24 -ac", "node", "run.js"]
