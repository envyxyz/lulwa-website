1. **Soft 404s from Blanket 301s to Hubs**
Redirecting 38 pruned city and brand pages to generic `/areas` and `/brands` hubs will trigger Google's soft-404 classifier, dumping page equity anyway.
*Fix:* Map top-traffic pruned URLs 1:1 to their nearest real equivalent or return a clean HTTP `410 Gone` so Google drops them immediately without waste.

2. **Identical Slugs for English and Arabic**
Using transliterated or identical English slugs at root for Arabic pages forfeits high-intent local Arabic search queries (e.g., `تصليح-مكيفات-الدمام`).
*Fix:* Implement translated, URL-encoded Arabic slugs at root, keep English slugs strictly under `/en/`, and connect every pair with explicit bidirectional `hreflang` tags.

3. **Doorway Penalty on Remaining City & Brand Pages**
Trimming 53 city/brand pages down to ~40 without substantial differentiation still violates Google's Doorway Page policy for a single-location Dammam shop.
*Fix:* Delete thin pages entirely; consolidate coverage into genuine service hubs with unique photos, localized pricing, specific technician routes, and neighborhood-level schema.

4. **Missing LocalBusiness Schema & Geo-Grounding**
Relying entirely on external GBP without matching, on-page JSON-LD breaks entity reconciliation between the website and the local knowledge graph.
*Fix:* Inject structured `HVACBusiness` JSON-LD on root with `areaServed` (GeoShape/PostalCodes for Eastern Province), `hasOfferCatalog`, and exact `sameAs` mapping to the GBP CID.

5. **Fragile Lead Pipeline & Free-Tier Worker Limits**
Google Sheets API via Worker introduces cold-start timeouts, quota throttling, and unhandled write failures with zero fallback during peak summer spikes.
*Fix:* Buffer lead payloads into Cloudflare D1 or KV first, return `200 OK` instantly, and sync asynchronously to Sheets via a scheduled cron.

6. **Lead Attribution Leak at WhatsApp Hand-off**
Sending users from a client-side picker straight to WhatsApp drops all session attribution, conversion tracking, and keyword data before the lead closes.
*Fix:* Capture user telemetry, path, and UTM params into KV before opening the WhatsApp deep-link with a unique Lead ID appended into the prefilled message string.
