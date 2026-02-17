export default async function handler(req, res) {
  const { bbox } = req.query;

  if (!bbox) {
    return res.status(400).json({ error: 'bbox parameeter puudub' });
  }

  try {
    const headers = { 'User-Agent': 'VeekaitseKalkulaator/1.0' };
    const [r1, r2] = await Promise.all([
      fetch(`https://gsavalik.envir.ee/geoserver/kitsendused/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=kitsendused:metsakas_kpois_RANNA_VOI_KALDA_VEEKAITSEVOOND&outputFormat=application/json&srsName=EPSG:3301&bbox=${bbox},EPSG:3301&maxFeatures=200`, { headers }),
      fetch(`https://gsavalik.envir.ee/geoserver/eelis/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=eelis:kr_vep&outputFormat=application/json&srsName=EPSG:3301&bbox=${bbox},EPSG:3301&maxFeatures=200`, { headers })
    ]);
    const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
    const features = [...(d1.features || []), ...(d2.features || [])];
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).json({ type: 'FeatureCollection', features });
  } catch (err) {
    res.status(500).json({ error: 'Keskkonnaagentuuri päring ebaõnnestus: ' + err.message });
  }
}
