const express = require('express');
const path = require('path');
const { solveCloudflare } = require('./cloudflare-solver');
const TurnstileSolver = require('./turnstile-solver');

const app = express();
// Railway otomatis memberikan port via process.env.PORT, default ke 3000 jika lokal
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
        record: false 
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
