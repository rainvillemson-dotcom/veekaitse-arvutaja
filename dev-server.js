import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Serve static files from public/
app.use(express.static(join(__dirname, 'public')));

// API: field/:id - proxy PRIA
app.get('/api/field/:id', async (req, res) => {
  const fieldId = String(req.params.id).replace(/[^0-9]/g, '');
  if (!fieldId) return res.status(400).json({ error: 'Massiivi number puudub' });

  try {
    const url = `https://kls.pria.ee/geoserver/pria_avalik/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=pria_avalik:pria_massiivid&outputFormat=application/json&CQL_FILTER=xy_id='${fieldId}'&srsName=EPSG:3301`;
    const response = await fetch(url, { headers: { 'User-Agent': 'VeekaitseKalkulaator/1.0' } });
    const data = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: 'PRIA päring ebaõnnestus: ' + err.message });
  }
});

// API: water-zones - proxy Keskkonnaamet (two layers combined)
app.get('/api/water-zones', async (req, res) => {
  const { bbox } = req.query;
  if (!bbox) return res.status(400).json({ error: 'bbox parameeter puudub' });

  try {
    const headers = { 'User-Agent': 'VeekaitseKalkulaator/1.0' };
    const [r1, r2] = await Promise.all([
      fetch(`https://gsavalik.envir.ee/geoserver/kitsendused/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=kitsendused:metsakas_kpois_RANNA_VOI_KALDA_VEEKAITSEVOOND&outputFormat=application/json&srsName=EPSG:3301&bbox=${bbox},EPSG:3301&maxFeatures=200`, { headers }),
      fetch(`https://gsavalik.envir.ee/geoserver/eelis/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=eelis:kr_vep&outputFormat=application/json&srsName=EPSG:3301&bbox=${bbox},EPSG:3301&maxFeatures=200`, { headers })
    ]);
    const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
    const features = [...(d1.features || []), ...(d2.features || [])];
    res.setHeader('Content-Type', 'application/json');
    res.json({ type: 'FeatureCollection', features });
  } catch (err) {
    res.status(500).json({ error: 'Keskkonnaagentuuri päring ebaõnnestus: ' + err.message });
  }
});

// API: nearby-fields - proxy PRIA massivid bbox piirkonnas
app.get('/api/nearby-fields', async (req, res) => {
  const { bbox } = req.query;
  if (!bbox) return res.status(400).json({ error: 'bbox parameeter puudub' });

  try {
    const url = `https://kls.pria.ee/geoserver/pria_avalik/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=pria_avalik:pria_massiivid&outputFormat=application/json&srsName=EPSG:3301&bbox=${bbox},EPSG:3301&maxFeatures=500`;
    const response = await fetch(url, { headers: { 'User-Agent': 'VeekaitseKalkulaator/1.0' } });
    const data = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: 'PRIA naabermassivide päring ebaõnnestus: ' + err.message });
  }
});

// API: buildings - proxy Keskkonnaamet ehitised
app.get('/api/buildings', async (req, res) => {
  const { bbox } = req.query;
  if (!bbox) return res.status(400).json({ error: 'bbox parameeter puudub' });

  try {
    const url = `https://gsavalik.envir.ee/geoserver/maaamet/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=maaamet:eluhooned&outputFormat=application/json&srsName=EPSG:3301&bbox=${bbox},EPSG:3301&maxFeatures=300`;
    const response = await fetch(url, { headers: { 'User-Agent': 'VeekaitseKalkulaator/1.0' } });
    const data = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: 'Ehitiste päring ebaõnnestus: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  Põllu Piirangute Kalkulaator töötab:`);
  console.log(`  → http://localhost:${PORT}\n`);
});
