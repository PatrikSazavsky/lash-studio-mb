# Lash & PMU Studio Mladá Boleslav - Digitální prezentace

Prémiová webová prezentace beauty studia v Mladé Boleslavi pod vedením stylistky **Ivety Švecové**.  
Web je navržen a implementován jako špičkový digitální produkt kombinující luxusní editorial design, moderní webové standardy a vysokou konverzní účinnost.

---

## 💎 Koncept a vizuální identita

- **Estetický směr:** Luxury beauty editorial, moderní skandinávský minimalismus, čistá typografie a velkorysý whitespace.
- **Barevná paleta:**
  - `Alabaster & Ivory Silk` (`#FAF8F5`, `#F3EFE9`) pro vzdušný a přívětivý podklad.
  - `Champagne Gold` (`#C5A880`, `#DFCEB9`) pro decentní akcenty a luxusní vyznění.
  - `Obsidian Noir` (`#121110`) pro kontrastní hero sekci a noční eleganci.
- **Typografie:**
  - Titulky: `Cormorant Garamond` (italská renesanční elegance s haute-couture křivkami).
  - Text a navigace: `Plus Jakarta Sans` (geometrická přesnost, špičková čitelnost na všech displejích).
- **Zákaz AI slopu:** Žádné generické neonové přechody, žádné 40px nafouknuté karty, žádné dekorativní spamování ikonami ani em-dashes. Vše má svůj účel.

---

## 🚀 Architektura a funkce

1. **Top Bar:** Rychlý kontakt, lokalita (Studio Robert Polák, Jičínská 1133) a přímé prokliky na telefon i WhatsApp.
2. **Hero sekce:** Vizuálně dominantní scéna s originální fotografií, vysokou prioritou načtení (`fetchpriority="high"`) a okamžitou výzvou k objednání.
3. **O studiu:** Představení Ivety Švecové, její filozofie, důraz na kvalitu, hygienu a certifikované materiály splňující normy EU.
4. **Služby:**
   - Prodlužování řas pomocí šetrné UV technologie (Natural, Light objem, Extra objem, Efekty).
   - InLei Lash Filler & Brow Bomber (italská klinicky ověřená laminace přírodních řas a obočí).
   - Permanentní make-up (pudrové obočí, stínované rty, meziřasové linky, PMU removal).
   - Mini tetování a dárkové poukazy.
5. **Interaktivní ceník:** Přepínatelné kategorie s kompletními cenami platnými od 2. 3. 2026.
6. **Autentická fotogalerie:** Reálné makro fotografie prací z Mladé Boleslavi s kategoriemi a nativním lightboxem.
7. **Pokyny a následná péče:** Odborné rady pro přípravu před zákrokem, péči po PMU, mytí prodloužených řas a zdravotní kontraindikace.
8. **Kontakt a rezervace:** Interaktivní poptávkový formulář s validací, honeypotem a ochranou proti spamu.
9. **Nativní modály:** Standardizovaný HTML5 `<dialog>` pro objednávku, detailní prohlížení fotek i zásady GDPR.

---

## 🛠 Technická specifikace a moderní standardy

- **Standardy:** Validní sémantické HTML5, moderní CSS3 (Logical properties, CSS Grid, Flexbox, Fluid clamp typography), lehký Vanilla JavaScript bez zbytečných závislostí.
- **Modern Web Guidance:**
  - `navbar`: Přizpůsobivá sémantická navigace s mobilním popover menu a scrollspy sledováním aktivní sekce.
  - `dialog`: Nativní `<dialog>` s detekcí kliknutí mimo modal, podporou klávesy `Esc` a uzavíracími tlačítky.
  - `optimize-image-priority`: LCP obrázek v hero sekci má explicitní `fetchpriority="high"`, ostatní vizuály využívají `loading="lazy"`.
- **SEO & Lokální vyhledatelnost:**
  - Strukturovaná data Schema.org (`@type: BeautySalon`, `@type: OfferCatalog`, otevírací doba, ceník a GPS souřadnice pro Mladou Boleslav).
  - Open Graph metadata, canonical URL, generovaný `sitemap.xml` a `robots.txt`.
- **Responzivita:** Mobile-first přístup, optimalizováno pro telefony, tablety i velké desktopové obrazovky s plovoucí spodní lištou pro rychlé vytočení hovoru z mobilu.

---

## 📁 Struktura složky

```
outputs/lash-studio-mb/
├── index.html                  # Kompletní produkční stránka
├── assets/
│   ├── css/
│   │   └── style.css           # Kompletní designový systém a styly
│   ├── js/
│   │   └── main.js             # Klientská logika, dialogy, validace
│   └── images/
│       ├── favicon.svg         # Vektorový emblém studia
│       ├── 1000006708.png      # Oficiální logo Iveta Švecová
│       ├── 1000015751.png      # Hero vizuál (LCP)
│       ├── 1000030051.png      # PMU stínované rty (makro)
│       ├── Photo_1770790564786.png # Pudrové obočí
│       ├── 1000027788.png      # Meziřasová linka (makro)
│       ├── 1000026069.png      # Volume lashes
│       └── ...                 # Další originální fotografie studia
├── sitemap.xml                 # XML mapa stránek pro vyhledávače
├── robots.txt                  # Pravidla pro roboty
├── .htaccess                   # Konfigurace pro Apache (HTTPS, CSP, Gzip, Cache)
├── nginx.conf                  # Konfigurace pro Nginx
├── SECURITY_AUDIT.md           # Podrobný bezpečnostní protokol
└── README.md                   # Dokumentace projektu
```
