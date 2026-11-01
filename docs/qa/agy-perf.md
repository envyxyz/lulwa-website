### Performance Audit Findings

---

#### 1. Image Preload / LCP Discovery
* **Severity:** Medium
* **File & Line:** [src/layouts/Base.astro:21-46](file:///C:/Users/ameer/Desktop/lulwa/website/src/layouts/Base.astro#L21-L46) & [dist/index.html:1](file:///C:/Users/ameer/Desktop/lulwa/website/dist/index.html#L1)
* **Concrete Defect:** On the homepage (`/`), the hero image (`/images/split-ac-indoor-640.webp` / `avif`) is loaded with `loading="eager"`, but there is no `<link rel="preload" as="image">` in `<head>`. The browser must download and parse the HTML down into `<main>` before the image resource request is discovered.
* **Fix:** Add an optional `imagePreload` prop to `Base.astro` (or conditionally on the homepage) that emits `<link rel="preload" as="image" href="..." type="image/avif" imagesrcset="..." imagesizes="...">` in `<head>`.

---

#### 2. Caching Headers (HTML Documents)
* **Severity:** Medium
* **File & Line:** [public/_headers:1-7](file:///C:/Users/ameer/Desktop/lulwa/website/public/_headers#L1-L7)
* **Concrete Defect:** Static assets (`/_astro/*`, `/fonts/*`, `/images/*`) correctly have immutable 1-year caching rules (`max-age=31536000, immutable`), but root/HTML paths (matched by `/*`) do not declare a `Cache-Control` header. Static HTML pages rely on default CDN/browser heuristics instead of explicit revalidation.
* **Fix:** Add explicit caching under `/*` in `public/_headers` (e.g., `Cache-Control: public, max-age=0, must-revalidate` or `s-maxage=3600, stale-while-revalidate=86400`).

---

#### 3. Image srcset & Density for Work Grid (LCP Candidate on `/work`)
* **Severity:** Low
* **File & Line:** [src/components/Page.astro:130](file:///C:/Users/ameer/Desktop/lulwa/website/src/components/Page.astro#L130) & [dist/work.html:1](file:///C:/Users/ameer/Desktop/lulwa/website/dist/work.html#L1)
* **Concrete Defect:** On `work.html`, the portrait photos (`compressor-install`, `compressor-closeup-2`, `compressor-pair`, `condensing-unit-wiring`) configure `widths` as `[287]` with `sizes="(min-width: 64rem) 30vw, 50vw"`. On a 2x DPR mobile device (e.g., viewport width 390px, where 50vw is ~195px, requiring ~390px physical pixels) or tablet/desktop, only a single 287px image is available, leading to upscaling. Additionally, the first image on `work.html` renders above the fold but uses `loading="lazy"`.
* **Fix:** Provide a 2x density export (e.g., `[287, 574]`) in the image pipeline and `widths` array, and set `eager` on the first above-the-fold image on `work.astro`.

---

#### 4. Inline Script Size
* **Severity:** Low
* **File & Line:** [dist/index.html:1](file:///C:/Users/ameer/Desktop/lulwa/website/dist/index.html#L1) & [dist/index.html:208](file:///C:/Users/ameer/Desktop/lulwa/website/dist/index.html#L208)
* **Concrete Defect:** `dist/index.html` contains:
  1. A ~1.4 KB inlined JSON-LD `<script type="application/ld+json">` inside `<head>`.
  2. A 354-byte inline `<script type="module">` at the bottom of the body handling the day-of-week indicator and map replacement.
  *Note:* Neither blocks parsing (JSON-LD is data; the module script is deferred by nature), but the JSON-LD payload slightly increases initial HTML document byte weight.
* **Fix:** Acceptable for SEO and minimal overhead; no immediate code changes required unless shaving raw initial HTML payload.

---

### Areas Audited with No Defects Found

* **Font Preload & Display:**
  * **Status:** Clean.
  * **Verification:** [src/layouts/Base.astro:18, 45](file:///C:/Users/ameer/Desktop/lulwa/website/src/layouts/Base.astro#L18-L45) accurately preloads the language-appropriate font (`/fonts/beiruti-800-900.woff2` for Arabic, `/fonts/schibsted-400-800.woff2` for English) with `as="font" type="font/woff2" crossorigin`. [src/styles/global.css:9, 15, 21, 27](file:///C:/Users/ameer/Desktop/lulwa/website/src/styles/global.css#L9-L27) configures `font-display: swap` along with font metrics fallback definitions (`size-adjust`) to prevent layout shifts.

* **Image Dimensions & Aspect Ratios:**
  * **Status:** Clean.
  * **Verification:** All `<img>` tags in [dist/index.html](file:///C:/Users/ameer/Desktop/lulwa/website/dist/index.html) and [dist/work.html](file:///C:/Users/ameer/Desktop/lulwa/website/dist/work.html) generated via [src/components/Img.astro](file:///C:/Users/ameer/Desktop/lulwa/website/src/components/Img.astro) include explicit `width` and `height` attributes along with `class="h-auto w-full"` to reserve aspect ratio and eliminate CLS.

* **Render-Blocking Resources:**
  * **Status:** Clean.
  * **Verification:** The only render-blocking asset in `<head>` is the single compiled Astro stylesheet (`/_astro/Base.G0h-joJs.css`), which is standard and necessary to avoid FOUC. All client scripts are external ES modules (`<script type="module">`) or deferred, avoiding parser blocking.
