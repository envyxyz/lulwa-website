# Keyword map

One primary query per page, so no two pages compete. Updated 8 Nov 2026 from agy research on google.com.sa (autocomplete-style variants, People Also Ask, top-5 titles; raw files in that session's scratchpad, volumes unknown) and the live titles in `docs/SEO-MIGRATION.md`.

**Title rule:** the live title's phrase stays word for word (it ranks today); "صيانة و" is added in front where Saudis search "صيانة X بالدمام". Body copy (`src/content/guides/*.json`) carries the primary phrase in the first paragraph and one h2, and each secondary once.

| Page | Title phrase kept from live | Primary in body | Secondary (once each) |
|---|---|---|---|
| `/` | تصليح الأجهزة المنزلية والمكيفات في الدمام | ورشة صيانة مكيفات وأجهزة منزلية بالدمام | تصليح مكيفات وأجهزة كهربائية الدمام, فني صيانة أجهزة ومكيفات الجلوية |
| `/services` | خدمات تصليح الأجهزة المنزلية في الدمام | خدمات صيانة الأجهزة المنزلية والتكييف بالدمام | صيانة أجهزة كهرومنزلية الدمام |
| `/services/ac-repair` | تصليح مكيفات في الدمام | صيانة مكيفات بالدمام | تصليح مكيفات سبليت, فني مكيفات شباك, شحن فريون |
| `/services/refrigerator-repair` | تصليح ثلاجات في الدمام | صيانة ثلاجات بالدمام | تعبئة فريون ثلاجة, تصليح كمبروسر, ثلاجة ما تبرد |
| `/services/washing-machine-repair` | صيانة غسالات في الدمام | صيانة غسالات بالدمام | غسالات أوتوماتيك, كارتة غسالة |
| `/services/dryer-repair` | تصليح نشافات في الدمام | صيانة نشافات بالدمام | مجففات ملابس, نشافة ما تسخن |
| `/services/freezer-repair` … `water-heater-repair` | تصليح <appliance> في الدمام | صيانة <appliance> بالدمام | per page, ask first |
| 15 faults | anchors on their service page (`/services/<slug>#<fault>`) | the symptom question as h3 | none |
| `/areas/appliance-repair-in-<area>` | تصليح الأجهزة المنزلية في <area> | صيانة مكيفات <area> | فني مكيفات <area>, تصليح غسالات <area> |
| `/brands/<brand>-appliance-repair` | تصليح أجهزة (or مكيفات) <brand> في الدمام | صيانة <products> <brand> بالدمام | the brand's Arabic spellings (كاريير/كارير, ال جي/إل جي) |
| `/blog/ac-repair-in-dammam` | تصليح مكيفات الدمام | أعطال المكيفات الشائعة وأسبابها (informational) | ليه المكيف يطلع هواء حار, تنقيط ماء من السبليت |
| `/blog/ac-repair-installation-…-complete-guide` | (was English) | دليل صيانة وتركيب المكيفات الشامل | الطن المناسب, الإنفرتر, تمديد مواسير النحاس |
| `/blog/washing-machine-maintenance-…` | (was English) | دليل أعطال الغسالات الأوتوماتيك | الغسالة ما تصرف, تنظيف الفلتر, رموز الأعطال |

## Rules that keep pages apart
- Service pages own "<service> + الدمام" (commercial). Blog posts are how-to guides and never use a service page's primary as theirs.
- Area pages own the place name; they never chase a service's primary. Brand pages own the brand name.
- The home page owns the broad workshop query; `/services` owns the hub query.

## Not targeted
- Central AC (مركزي), "24 ساعة", "فوري", "فني فلبيني", car AC: not confirmed or other markets.
