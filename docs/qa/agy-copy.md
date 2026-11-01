I have launched the check on the page routes and will wait for it to finish.
An audit of customer-facing copy in [en.ts](file:///C:/Users/ameer/Desktop/lulwa/website/src/content/en.ts) and [ar.ts](file:///C:/Users/ameer/Desktop/lulwa/website/src/content/ar.ts) was conducted against the confirmed facts and unconfirmed restrictions in [PRODUCT.md](file:///C:/Users/ameer/Desktop/lulwa/website/PRODUCT.md).

### Findings by Category

- **Prices / Inspection Fee**: None found (Compliant).
- **Warranty**: None found (Compliant).
- **Parts Origin / "Original parts only"**: None found (Compliant).
- **Years in business / Job or customer counts**: None found (Compliant — review counts match the confirmed 8 reviews on Google Maps).
- **Technician certification / Training**: None found (Compliant).
- **Unconfirmed services**: None found (Only split/window AC, fridges with gas refilling, automatic washing machines, and dryers are listed; other appliances are explicitly excluded or deferred).
- **Unconfirmed areas**: None found (Only Dammam / Al-Jalawiyah is confirmed; other areas beyond Dammam are not listed).
- **Payment methods**: None found (Compliant).
- **Arrival or response times**: Minor phrasing in contact/thanks lead ("WhatsApp is quickest" / "For a faster answer"), but no arrival times, same-day commitments, or specific turnaround times are stated.
- **Home visits**: Found in component sink demo text.

---

### Prioritized Report

#### 1. High Severity: Unconfirmed Home Visits Promise

- **File & Line**: [ar.ts:374](file:///C:/Users/ameer/Desktop/lulwa/website/src/content/ar.ts#L374)
  - **Defect**: The string `headLine2: 'نجيك لحد بيتك'` explicitly promises a home visit ("we come right to your house"). [PRODUCT.md](file:///C:/Users/ameer/Desktop/lulwa/website/PRODUCT.md#L42) strictly prohibits: *"home visits as a standing promise"*. Even though this is in the `sink` key, `src/content/ar.ts` exports customer-facing content structures.
  - **Fix**: Remove or replace the text with confirmed positioning (e.g., matching the hero subtitle `'نصلحه في الدمام'` or `'ورشة في الجلوية بالدمام'`).

- **File & Line**: [en.ts:374](file:///C:/Users/ameer/Desktop/lulwa/website/src/content/en.ts#L374)
  - **Defect**: The string `headLine2: 'We come to you'` explicitly states a home visit. [PRODUCT.md](file:///C:/Users/ameer/Desktop/lulwa/website/PRODUCT.md#L42) forbids publishing *"home visits as a standing promise"*.
  - **Fix**: Remove or replace the string with confirmed copy such as `'Dammam repair'` or `'Repair shop in Al-Jalawiyah'`.

---

#### 2. Low / Informational: Comparative Response Speed Claims

- **File & Line**: [en.ts:239](file:///C:/Users/ameer/Desktop/lulwa/website/src/content/en.ts#L239) & [ar.ts:239](file:///C:/Users/ameer/Desktop/lulwa/website/src/content/ar.ts#L239)
  - **Text**: `lead: 'WhatsApp is quickest. Send a photo of the fault with it.'` / `lead: 'واتساب أسرع، وأرسل معه صورة العطل.'`
  - **Defect**: While no specific response time or arrival window is stated, claiming WhatsApp is "quickest" / "أسرع" borders on an unconfirmed response-time assertion.
  - **Fix**: Change to descriptive rather than speed-based copy: `'Send a photo of the fault on WhatsApp.'` / `'أرسل صورة العطل على واتساب.'`.

- **File & Line**: [en.ts:368](file:///C:/Users/ameer/Desktop/lulwa/website/src/content/en.ts#L368) & [ar.ts:368](file:///C:/Users/ameer/Desktop/lulwa/website/src/content/ar.ts#L368)
  - **Text**: `lead: 'We will reply on the number you gave. For a faster answer, message us on WhatsApp.'` / `lead: 'نرد عليك على الرقم اللي كتبته. وإذا تبي رد أسرع، راسلنا على واتساب.'`
  - **Defect**: Implies differing turnaround speed promises without a confirmed response SLA.
  - **Fix**: Simplify to: `'We will reply on the number you gave, or you can message us on WhatsApp.'` / `'نرد عليك على الرقم المسجل أو تواصل معنا مباشرة عبر واتساب.'`.
