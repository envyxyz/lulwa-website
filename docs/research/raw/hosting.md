# Performance, Infrastructure, and Framework Evaluation for Dammam, Saudi Arabia

This report evaluates hosting options, DNS delegation via SaudiNIC, and static web architectures for a bilingual (Arabic/English, RTL/LTR) 100–200 page site serving visitors in **Dammam, Eastern Province, Saudi Arabia**.

---

## 1. Hosting Infrastructure Comparison for Dammam Visitors

```
User in Dammam (STC / Mobily / Zain)
  │
  ├──► Cloudflare Free: Anycast to DMM (or RUH/JED) if ISP peers locally; fallback to Europe/Gulf.
  ├──► Vercel:          Routed to Dubai edge (`dxb1`) or European transit (~25–45ms+).
  ├──► Netlify Free:    Routed to Central Europe / Singapore (~90–140ms+); Bahrain is Enterprise-only.
  └──► Hostinger:       Single origin in Europe/US/Asia (~90–120ms to origin, unless paired with CDN).
```

### 1.1 Cloudflare Workers Static Assets (Free Plan)
* **Presence in Saudi Arabia & Dammam:** Cloudflare operates physical Points of Presence (PoPs) in Saudi Arabia, explicitly including **Dammam (`DMM`)**, **Riyadh (`RUH`)**, and **Jeddah (`JED`)** ([Cloudflare Global Network](https://www.cloudflare.com/network/)).
* **Do Free Plan Visitors Get Routed to Saudi PoPs?**
  * **Network Policy:** Cloudflare’s official policy does not ban free tier users from local PoPs. However, Anycast routing is determined by BGP peering agreements and bandwidth transit economics ([Cloudflare Peering Details](https://www.cloudflare.com/peering/)).
  * **Real-world Routing in KSA:** Local Saudi telecom operators (STC, Mobily, Zain) peer with Cloudflare at local Internet Exchange Points (such as Saudi IX in Riyadh). Many residential and mobile connections resolve to `DMM` or `RUH` with <15ms round-trip times. However, during periods of peak ISP transit congestion, IP prefix deprioritization, or DDoS events, Cloudflare’s free tier prefixes can be shed to lower-cost international transit links (often Frankfurt or Marseille), routing some ISP traffic out of the Kingdom ([Cloudflare Community Network Routing Discussions](https://community.cloudflare.com/)).
  * *Verification:* You can test a client's live endpoint by requesting `https://<domain>/cdn-cgi/trace` and checking the `colo=` field (looking for `DMM` or `RUH`).
* **Fit for Bilingual Static Assets:** Cloudflare Pages / Workers Static Assets serves pre-compressed assets (`br`/`gzip`) from edge memory with no origin fetch on cache hit, delivering single-digit millisecond TTFB when hitting `DMM`.

### 1.2 Hostinger Shared LiteSpeed Hosting
* **Data Center Locations:** Hostinger **does not have a data center in Saudi Arabia or the Middle East** ([Hostinger Server Locations](https://www.hostinger.com/tutorials/hostinger-data-centers)). Their primary server regions are Lithuania, the UK, the Netherlands, Germany, the US, Brazil, India, Indonesia, and Malaysia.
* **Architecture:** Shared Linux hosting running LiteSpeed Web Server.
* **Latency & Performance:** Traffic from Dammam must travel over submarine cables to Western/Central Europe (typically Frankfurt/Amsterdam), resulting in a baseline physical latency of **85ms to 120ms TTFB** unless fronted by a reverse-proxy CDN.
* **Verdict:** Unnecessary complexity for a purely static 200-page site. Managing cPanel/hPanel, Apache/LiteSpeed `.htaccess` rewrites, and file uploads adds maintenance without latency benefits over an edge CDN.

### 1.3 Vercel
* **Middle East Edge Presence:** Vercel operates a regional edge presence in **Dubai, UAE (`dxb1`)**, but **no physical edge compute PoP inside Saudi Arabia** ([Vercel Edge Network Regions](https://vercel.com/docs/edge-network/regions)).
* **Routing Behavior:** Dammam visitors are generally routed to Dubai (`dxb1`) or, depending on upstream international routing from Saudi ISPs, to European edges. Round-trip time to Dubai from Dammam is approximately **20ms to 40ms**.
* **Static Assets:** Free (Hobby) tier allows standard edge caching, but bandwidth is capped at 100 GB/month with commercial usage restrictions under the Hobby Terms of Service.

### 1.4 Netlify
* **Middle East Edge Presence:** Netlify operates edge nodes in the Middle East, including **Bahrain**, but this is restricted to their **High-Performance Edge (Enterprise tier)** ([Netlify Edge Network](https://www.netlify.com/platform/core/edge/)).
* **Free Plan Routing:** Netlify's standard (Free / Pro) CDN routes global traffic through a smaller baseline network (principally Frankfurt, London, and US coasts). Free-tier visitors from Dammam typically route to European nodes, suffering **90ms to 140ms TTFB**.
* **Verdict:** Netlify Free provides the highest latency of the edge platforms for Saudi audiences.

---

## 2. SaudiNIC Nameserver Change Process (`.sa` / `.السعودية`)

Domain names under `.sa` are regulated by the Communications, Space & Technology Commission (CST) through SaudiNIC. SaudiNIC has completed the migration from its legacy direct management portal to the **accredited Registrar-Registry model** ([SaudiNIC Accreditation](https://nic.sa/)).

### Step-by-Step Nameserver Delegation:
1. **Determine Where the Domain is Managed:**
   * **Accredited Registrar (Standard):** If registered through a licensed registrar (e.g., STC Solutions, Sahara Net, NourNet, AEserver, Marcaria), modifications must be executed inside that registrar’s customer portal.
   * **Legacy SaudiNIC Portal:** Older domains registered prior to the transition may still be accessed at [nic.sa](https://nic.sa) via the Administrative Contact account.
2. **Retrieve Authoritative Nameservers:**
   * For Cloudflare: Obtain your assigned pair (e.g., `amy.ns.cloudflare.com`, `bob.ns.cloudflare.com`).
3. **Log in and Authenticate:**
   * Login requires **two-factor authentication (OTP)** linked to the registered Saudi mobile number via Nafath/IAM national authentication services depending on the registrar.
4. **Enter Nameserver Details:**
   * Navigate to: **Domain Management** $\rightarrow$ **Select Domain** $\rightarrow$ **Nameservers / DNS Settings**.
   * Switch the configuration from "Default Registrar Nameservers" to "Custom Nameservers".
   * Enter at least two fully qualified hostnames (e.g., `ns1.example.com`, `ns2.example.com`). SaudiNIC specifications require hostnames only (IP glue records are only accepted/required if the nameserver is a subdomain of the domain itself).
5. **DNSSEC Coordination:**
   * If DNSSEC was previously enabled at the registry, **disable it or update the DS record** before updating the nameservers. Failing to update or clear the DS record will cause DNS resolution failures due to invalid cryptographic chains.
6. **Propagation:**
   * SaudiNIC registry updates propagate to root `.sa` servers within minutes; local ISP recursive resolvers (STC, Mobily, Zain) refresh per your TTL settings, typically within **4 to 24 hours**.

---

## 3. Framework Comparison (100–200 Page Static Bilingual Site)

| Feature / Metric | Astro 5 | Next.js (Static Export `output: 'export'`) | Plain Static HTML + Tailwind |
| :--- | :--- | :--- | :--- |
| **Current Major Architecture** | Astro 5 (Content Layer, Vite-driven) | Next.js 15 (App Router, React 19) | Handcrafted or Minimal SSG (e.g., 11ty) |
| **Client JS Shipped (Baseline)** | **0 KB** (Zero JS by default) | **~80 KB – 110 KB (gzipped)** React runtime + hydration | **0 KB** |
| **Tailwind CSS v4 Support** | **Native** via `@tailwindcss/vite` (supported since Astro 5.2) | Supported via PostCSS or Tailwind CLI | Native via Tailwind CLI or Vite |
| **Bilingual / i18n Routing** | Built-in `i18n` config (subpath prefixing, RTL detection) | Manual folder routing `app/[lang]/` in static export mode | Manual folder structure (`/ar/`, `/en/`) |
| **Interactive Islands** | Independent partial hydration (`client:visible`, etc.) | Monolithic React hydration tree | Vanilla JS or lightweight libraries (Alpine.js) |
| **Median Mobile Lighthouse Perf** | **98 – 100** | **75 – 92** (penalized on low/mid mobile CPU) | **100** |

### 3.1 Astro (Astro 5 Architecture)
* **Zero JS Baseline:** Compiles components exclusively to HTML and CSS during build. A 200-page static marketing site ships **0 KB of JavaScript** unless you explicitly add an interactive island.
* **Islands Architecture:** If the site requires an interactive component (e.g., an Arabic/English currency calculator or mobile navigation drawer), wrap only that component:
  ```astro
  <LanguageSwitcher client:idle />
  ```
* **Native i18n Routing:** Built-in first-class configuration:
  ```javascript
  // astro.config.mjs
  export default defineConfig({
    i18n: {
      defaultLocale: "ar",
      locales: ["ar", "en"],
      routing: { prefixDefaultLocale: false }
    }
  });
  ```
  Generates `/` (Arabic, with `dir="rtl"`) and `/en/` (English, with `dir="ltr"`).
* **Tailwind CSS v4:** Astro 5 natively supports the `@tailwindcss/vite` plugin without requiring `@astrojs/tailwind` ([Astro 5.2 Release Notes](https://astro.build/blog/astro-520/)).

### 3.2 Next.js Static Export (`output: 'export'`)
* **Mandatory JavaScript:** When executing `next build` with `output: 'export'`, Next.js pre-renders all pages to HTML. However, every page still ships the **React runtime, React DOM, router chunks, and component hydration code** ([Next.js Static Exports Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)).
* **Hydration Cost:** The baseline JavaScript payload for an empty Next.js App Router page is roughly **80 KB – 110 KB (gzipped)**, expanding to 150 KB+ once minimal interactive libraries are introduced. On budget mobile devices common across regional visitor demographics, this causes Main Thread blocking during script evaluation.
* **Static Export Constraints:** Built-in Next.js i18n middleware does not run in `output: 'export'` mode; developers must manually structure directories (`app/[locale]/...`) and run `generateStaticParams()`.

### 3.3 Plain Static HTML
* **Zero Overhead:** Absolute maximum performance, 0 KB JavaScript, zero framework churn.
* **Maintainability Penalty:** Managing bilingual global chrome (header, footer, language switchers, canonical and `hreflang` tags) across 200 distinct HTML files without a component system or templating engine introduces high maintenance overhead and human error risk.

---

## 4. Empirical Evidence: JavaScript Payloads & Core Web Vitals

Real-world metrics gathered from millions of websites via the **HTTP Archive** and the **Chrome User Experience Report (CrUX)** confirm the architectural impact:

1. **Core Web Vitals Pass Rates (HTTP Archive / CrUX):**
   * Websites built with **Astro** achieve an overall Core Web Vitals mobile pass rate of approximately **48% to 52%** ([HTTP Archive CWV Technology Report](https://httparchive.org/reports/cwv)).
   * Websites built with **Next.js** register an overall mobile pass rate of approximately **29% to 32%** ([HTTP Archive CWV Technology Report](https://httparchive.org/reports/cwv)).
2. **Interaction to Next Paint (INP) & Total Blocking Time (TBT):**
   * In CrUX evaluations, **88%+ of Astro sites** maintain "Good" mobile INP ratings due to the absence of main-thread hydration locking ([PageSpeed Matters Framework Benchmark](https://pagespeedmatters.com/)).
   * For **Next.js**, "Good" INP drops to **~66%** on mobile devices due to the execution time of React's hydration pass ([PageSpeed Matters Framework Benchmark](https://pagespeedmatters.com/)).
3. **Payload Delta for a Standard Static Document:**
   * **Astro / Plain HTML:** `0 KB` transferred JS, 0 ms TBT, 100/100 Lighthouse Performance score out of the box.
   * **Next.js Static Export:** `80–120 KB` transferred JS, 150–350 ms CPU evaluation time on mid-tier mobile hardware, pulling mobile Lighthouse Performance scores down to the `80–92` range on unthrottled configurations.

---

## 5. Architectural Verdict & Implementation Recommendation

1. **Hosting Platform:** **Cloudflare Workers Static Assets (or Cloudflare Pages)** is the recommended option. It is the only option among the four evaluated with physical edge nodes directly in **Dammam (`DMM`)** and **Riyadh (`RUH`)** on its free network tier. While occasional ISP transit routing variations can occur, latency remains superior to Hostinger (which lacks Middle East servers) and Netlify Free (which routes through Europe).
2. **Framework:** **Astro 5** with `@tailwindcss/vite` (Tailwind 4). It delivers the component architecture required to maintain a 200-page bilingual site (with centralized layouts for RTL/LTR flipping and localized navigation) while generating **0 KB of client JavaScript**, avoiding the mandatory React hydration overhead inherent in Next.js static exports.
