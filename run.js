const express = require('express');
const path = require('path');
const { solveCloudflare } = require('./cloudflare-solver');
const TurnstileSolver = require('./turnstile-solver');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint API Utama
app.post('/api/solve', async (req, res) => {
  const { type, url, sitekey } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL wajib diisi' });
  }

  try {
    if (type === 'turnstile') {
      const solver = new TurnstileSolver({ 
        headless: true, 
        record: false,
        // FIX: Suntikkan argumen wajib Docker agar tidak crash
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      });
      
      await solver.initialize();
      const result = await solver.solve(url, sitekey || undefined);
      await solver.cleanup();
      
      return res.json(result);
    } else {
      const result = await solveCloudflare({
        url: url,
        headless: true,
        timeout: 60,
        // FIX: Tambahkan flag ke fungsi cloudflare-solver jika didukung oleh library-nya
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      });
      return res.json(result);
    }
  } catch (error) {
    console.error('Solver Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// FIX: Menggunakan '0.0.0.0' agar Railway bisa melakukan port-forwarding dengan benar
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running internally on port ${PORT}`);
});
