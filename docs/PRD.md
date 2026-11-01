# PRD: Lulwa website

## 1. Goal

WhatsApp chats, calls, leads and directions taps from people in Dammam with a broken AC, fridge, washer or dryer. Lead the map pack and organic results for those searches in Arabic, and own the thin English results.

Measured by: GA4 events `whatsapp_click`, `call_click`, `directions_click`, `picker_complete`, `lead_submit`; Search Console positions for §4; Lighthouse T18.

The client has set no numbers yet. Ask for 3 and 6 month targets before launch.

## 2. What ranking takes, in order

Honest order of effect for a local repair shop: (1) Google Business Profile category, name, reviews, photos; (2) relevant, real pages per service; (3) links and citations from Saudi directories; (4) page speed, which is a tiebreaker and a conversion gain. A 100 Lighthouse score alone ranks nothing. Everything in this plan serves all four, and (1) and (3) sit outside the code.

## 3. Competitors, checked 1 Nov 2026

Real Google in the browser pane with `gl=sa`, from Pakistan. Map results may differ in Dammam. agy's own SERP lists in `research/raw/` are partly unreliable; use them for domain ideas only. Sizes measured by crawl.

| Who | Where seen | Site | URLs | Notes |
|---|---|---|---|---|
| صيانة غسالات اتوماتيك بالدمام | Top map result, washers | yes | ? | **4.8 from 759 reviews**, category "washer and dryer repair", keyword as business name |
| الفرج (ama-siyana.com) | Map | WordPress | 33 | 4.6 from 246 |
| النجاح للتبريد والتكييف | Map, AC | no | n/a | 4.9 from 475, mainly car AC |
| مؤسسة فاطمة | Map, AC | no | n/a | 4.6 from 86 |
| التكييف والتبريد | Map, AC and fridges | no | n/a | 4.9 from 48 |
| almsaeya.com | Organic #1, AC | WordPress | 93 | Phone in the title |
| ac-serve.com | Organic #2, AC and fridges | Custom | 166 | Shows an Egyptian phone number |
| gama-est.com | Organic, AC | WordPress | 1,609 | A cleaning company's blog post outranks repair shops |
| sianaa-ksa.com | Organic, AC | WordPress | 226 | Tag page ranks |
| siana-ksa.com | Organic #1, washers | WordPress | 247 | "30% off", URLs per service and city |
| homerun.com.sa | Organic, AC | Marketplace | blocked | "Best 40 providers", review stars in the result |
| khalasna.com | Takes most English results | Directory | ? | 167 AC technicians listed in Dammam, typical price SAR 80+ |
| Instagram | Video block on Arabic and English queries | n/a | n/a | **Reels rank in a video block** for these searches |

**Reading:** the map pack is won by review count and exact category. Organic page one is weak: anonymous WordPress sites, wrong-country phone numbers, tag pages, a cleaning company. A real, fast, named site can beat it with honest pages. English is nearly empty.

### Copy these
1. Title and H1 with service plus city, in the searcher's words (`صيانة وتصليح مكيفات بالدمام`). H1 on home keeps the keyword line inside it.
2. One page per service, split by what people type (split, window, gas refill, cleaning, once confirmed).
3. Fault long-tail pages. siana-ksa has 247 URLs, mostly this. Ours are fewer and written with a technician.
4. `HVACBusiness`, `Service`, `FAQPage`, `BreadcrumbList` JSON-LD (solutionsinspeed, saudi-pro-serve use the same set). FAQ markup serves AI search, not rich results.
5. Phone number in the meta description, as on the current site.
6. Short real videos on Instagram and TikTok, with Arabic captions naming service and city, because reels rank in the video block.
7. Exact GBP category (`خدمة إصلاح تكييف الهواء`), plus services, photos, posts, and a steady flow of real reviews. 759 reviews is the real competition.
8. Listings on homerun.com.sa, khalasna.com, tabreedfast.com, saudi-click.com, and Haraj and expatriates.com classifieds for citations.

### Do not copy
Keyword-stuffed business names (suspension risk) · fake 24/7 · "within an hour" unless true · self-serving `AggregateRating` (dammam.repair, ac-maintenance-dammam use it; Google ignores it) · exact-match domain networks · 40 thin city pages · invented discounts.

## 4. Keyword targets

Volumes unverified: no Keyword Planner access. Phase 8 pulls Google autocomplete and, once granted, Search Console. Full list in `research/raw/keywords.md`.

| Page | Arabic | English |
|---|---|---|
| `/services/ac-repair` | صيانة مكيفات الدمام، تصليح مكيفات الدمام، فني مكيفات الدمام | ac repair dammam |
| `/services/refrigerator-repair` | تصليح ثلاجات الدمام، فني ثلاجات الدمام، تعبئة غاز ثلاجة | fridge repair dammam |
| `/services/washing-machine-repair` | صيانة غسالات اتوماتيك الدمام، تصليح غسالات الدمام | washing machine repair dammam |
| `/services/dryer-repair` | صيانة نشافات الدمام | dryer repair dammam |
| `/areas/appliance-repair-in-al-khobar` | صيانة مكيفات الخبر | ac maintenance al khobar |
| `/faults/ac-not-cooling` | المكيف لا يبرد، المكيف شغال وما يبرد | ac not cooling |
| `/faults/ac-leaking-water` | تسريب ماء من المكيف | split ac leaking water |
| `/faults/fridge-not-cooling` | الثلاجة لا تبرد | fridge not cooling |
| `/faults/washer-not-spinning` | الغسالة لا تعصر | washing machine not spinning |
| `/brands/lg-appliance-repair` | صيانة ال جي الدمام، رمز خطأ OE غسالة ال جي | lg washer oe error |

Seasonality: AC faults and gas refill peak April to September; cleaning before summer, February to April. Fault and cleaning pages must be live and indexed by February.

## 5. Sitemap

Arabic at the root, English at `/en/`, identical slugs. Old slugs stay. About 55 pages per language.

- `/`
- `/services` · `/services/{ac-repair, refrigerator-repair, freezer-repair, washing-machine-repair, dryer-repair}` plus any repair the client confirms
- `/faults` · 12 to 16 pages, the content moat (new)
- `/areas` · `/areas/appliance-repair-in-{dammam, al-khobar, dhahran, qatif, saihat}` once coverage is confirmed
- `/brands` · 10 pages: LG, Samsung, Gree, Carrier, Midea, Haier, Daikin, Zamil, Whirlpool, Super General. Others listed on the hub
- `/reviews` · `/work` (real jobs) · `/about` · `/contact`
- `/blog` and 3 existing posts, truth-passed, with twins
- `/privacy-policy` · `/terms-of-service` · `/cookie-policy`
- `/thanks` noindex, `404`

Every old URL is handled in `docs/url-map.csv`: 33 keep, 22 brand pages 301 to the hub that names them, 16 area pages get 410 or a 301 depending on real coverage (a blanket redirect to an unrelated hub reads as a soft 404), 4 wait on the client. Slugs stay ASCII: they already hold what equity exists, and percent-encoded Arabic turns ugly when pasted into WhatsApp.

## 6. Templates

**Home:** hero · fault picker · what we repair · how a visit works · real reviews · real work · the shop (address, hours, map, legal name) · questions · close.

**Service:** H1 with service and city · who it's for · common faults linked to fault pages · which units · what a visit involves · real work photo · questions · contact. No price until confirmed.

**Fault:** the question as H1 · direct answer in the first 50 words · what you can safely check yourself · what needs a technician · line diagram with the copper pearl on the failing part · contact. Reviewed by the technician, named once the client agrees. This is the page AI answers can cite.

**Area:** only with something true and local: neighbourhoods covered, a real job there, a real review from there, real drive time from Al-Jalawiyah.

**Brand:** independent-service disclaimer, real error codes per model family, units seen. No prices.

## 7. Features

- **Fault picker:** appliance, then fault, then area. Ends in a prefilled WhatsApp message in the page's language. Works as plain links without JS.
- **Lead form:** name, phone, appliance, area, message. Worker validates with Zod, posts to Apps Script, Sheet row plus email, then offers WhatsApp. If the Sheet fails, WhatsApp still works. Reuse `../rehan-traders/website/worker/` and `integrations/`.
- **Attribution:** every WhatsApp link carries a short source tag at the end of the message (page slug, plus `utm_campaign` kept in `sessionStorage`), so the shop can count which page or ad sent a chat. Skipped: a KV lead buffer, add when Sheet failures show in logs.
- **Open status:** computed client-side from `site.hours`, Asia/Riyadh. Plain hours without JS.
- **Map:** tap-to-load Google embed, no API key.
- **Skipped, with reason:** AI chat (WhatsApp is the channel; add when replies are slow) · online payment · dark mode · accounts · a price estimator (no prices confirmed).

## 8. Non-functional

See `CLAUDE.md` rules 11 to 18 and `docs/TEST-CONTRACT.md`. Hosting: Cloudflare Workers free plan, static assets. Check `cdn-cgi/trace` for `colo` from a real Saudi connection. agy says Cloudflare has a Dammam location and Hostinger has no Middle East data centre; confirm with a reading before relying on it.

Robots: allow Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, ChatGPT-User, Claude-User, Google-Extended and CCBot. A shop wants to be found and cited, and blocking training crawlers wins it nothing. `llms.txt` stays as a cheap courtesy; evidence that it does anything is thin.

## 9. Client fact sheet (needed before Phase 6 ends)

1. Which repairs, exactly: central AC, ovens, dishwashers, microwaves, water heaters, AC cleaning, gas refill, installation?
2. Which areas, and real drive time to each?
3. Home visits always? Same day ever?
4. Warranty, in their words.
5. Inspection fee and any fixed prices they'll stand behind.
6. Year founded. Technician names, roles, photos, and consent to publish.
7. Payment methods.
8. VAT number, Saudi Business Center QR.
9. Exact map pin.
10. Which social profiles are theirs (Facebook, Instagram @lulwadammam, X, YouTube, Snapchat, Pinterest, Threads, Trustpilot, Crunchbase, Linktree are linked from the old site).
11. Ten new job photos sent as WhatsApp documents, including two before-and-after pairs.
12. 3 and 6 month targets.
