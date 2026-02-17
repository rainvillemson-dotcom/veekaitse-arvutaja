export default async function handler(req, res) {
  const { id } = req.query;
  const fieldId = String(id).replace(/[^0-9]/g, '');

  if (!fieldId) {
    return res.status(400).json({ error: 'Massiivi number puudub' });
  }

  try {
    const url = `https://kls.pria.ee/geoserver/pria_avalik/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=pria_avalik:pria_massiivid&outputFormat=application/json&CQL_FILTER=xy_id='${fieldId}'&srsName=EPSG:3301`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'VeekaitseKalkulaator/1.0' }
    });

    const data = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ error: 'PRIA päring ebaõnnestus: ' + err.message });
  }
}
