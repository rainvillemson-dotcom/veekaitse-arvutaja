export default async function handler(req, res) {
  const { bbox } = req.query;

  if (!bbox) {
    return res.status(400).json({ error: 'bbox parameeter puudub' });
  }

  try {
    const url = `https://kls.pria.ee/geoserver/pria_avalik/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=pria_avalik:pria_massiivid&outputFormat=application/json&srsName=EPSG:3301&bbox=${bbox},EPSG:3301&maxFeatures=500`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'VeekaitseKalkulaator/1.0' }
    });
    const data = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ error: 'PRIA naabermassivide päring ebaõnnestus: ' + err.message });
  }
}
