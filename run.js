const express = require('express');
const path = require('path');
const { solveCloudflare } = require('./cloudflare-solver');
const TurnstileSolver = require('./turnstile-solver');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON dan menyajikan file statis (Frontend)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint API untuk memproses Turnstile atau Cloudflare secara dinamis
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
      // Jika sitekey kosong, otomatis menggunakan mode Page Auto-Detect
      const result = await solver.solve(url, sitekey || undefined);
      await solver.cleanup();
      
      return res.json(result);
    } else {
      // Default: Cloudflare Solver
      const result = await solveCloudflare({
        url: url,
        headless: true,
        timeout: 60,
      });
      return res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
