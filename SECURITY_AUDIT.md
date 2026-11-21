# Bezpečnostní audit - Lash & PMU Studio Mladá Boleslav

Datum auditu: 20. listopadu 2026  
Projekt: Redesign a vývoj webové prezentace Lash & PMU Studio (Iveta Švecová)  
Lokalita provozovny: Studio Robert Polák, Jičínská 1133, 293 01 Mladá Boleslav  
Status: **PROŠLO - Bezpečnostně ověřeno pro statický produkční deployment**

---

## 1. Souhrn auditu

V rámci předání nového webu byl proveden kompletní bezpečnostní audit zahrnující klientský kód (Frontend), formulářové toky, ochranu proti spamu, Content Security Policy (CSP), bezpečnostní HTTP hlavičky a ochranu osobních údajů (GDPR).

| Oblast kontroly | Stav | Závažnost nálezů | Poznámka k ověření |
| :--- | :--- | :--- | :--- |
| **XSS (Cross-Site Scripting)** | Zabezpečeno | Žádná | Uživatelské vstupy jsou před renderováním sanitizovány přes `escapeHtml`. Žádné nebezpečné vkládání neověřeného DOM. |
| **Ochrana externích odkazů** | Zabezpečeno | Žádná | Všechny odchozí odkazy (Facebook, WhatsApp) obsahují `target="_blank"` a povinné `rel="noopener noreferrer"`. |
| **Formuláře a ochrana proti spamu** | Zabezpečeno | Žádná | Implementován skrytý Honeypot (`studio_hp_check`), časový rate-limiter (5s debounce) a přísná validace telefonních čísel. |
| **Expozice citlivých dat** | Bezpečné | Žádná | V repozitáři ani v klientském kódu se nenachází žádné API klíče, hesla ani tokeny. |
| **Content Security Policy (CSP)** | Implementováno | Nízká | Definováno jak na úrovni `<meta>` tagu v `index.html`, tak v konfiguračních souborech `.htaccess` a `nginx.conf`. |
| **HTTP bezpečnostní hlavičky** | Připraveno | Nízká | HSTS, X-Frame-Options (ochrana proti Clickjackingu), X-Content-Type-Options (nosniff) a Permissions-Policy nastaveny. |
| **Ochrana osobních údajů (GDPR)** | Vyřešeno | Nízká | Povinný souhlas v poptávkovém formuláři, transparentní modální dialog s informacemi o správci a účelu zpracování dat. |

---

## 2. Detailní hodnocení jednotlivých vrstev

### 2.1 Frontend Security (Klientská bezpečnost)
- **Eliminace DOM XSS:** Veškerá klientská zpětná vazba (např. potvrzovací hláška po odeslání poptávky se jménem zákaznice) prochází funkcí `escapeHtml()`, která převádí `<`, `>`, `&`, `"`, `'` na bezpečné HTML entity.
- **Bezpečné zacházení s třetími stranami:** Web nenačítá žádné neprověřené cizí skripty. Google Fonts jsou načítány z oficiálních domén `fonts.googleapis.com` a `fonts.gstatic.com` s atributem `crossorigin`.
- **Nativní dialogy:** Modální okna využívají standardizovaný HTML5 prvek `<dialog>`, který prohlížeč automaticky izoluje v Top Layeru a nativně řeší uzamčení fokusu bez náchylných JavaScriptových knihoven.

### 2.2 Zpracování formulářů a ochrana proti zneužití
1. **Honeypot ochrana:** Formulář obsahuje pole `studio_hp_check` skryté pro běžné uživatele přes CSS (`display: none !important; visibility: hidden !important;`). Pokud robot toto pole vyplní, odeslání je okamžitě odmítnuto.
2. **Klientský Rate-Limiting:** Skript monitoruje čas posledního odeslání a zabraňuje vícenásobnému zběsilému klikání (minimální interval 5 sekund).
3. **Formátová validace:** Validuje se minimální délka jména, e-mailová struktura a platnost telefonního čísla v českém formátu (minimálně 9 čísel).
4. **GDPR Checkbox:** Odeslání formuláře je podmíněno aktivním zaškrtnutím souhlasu se zpracováním údajů pro domluvu termínu.

### 2.3 Serverová infrastruktura a HTTP konfigurace
Pro produkční nasazení byly připraveny konfigurace pro Apache (`.htaccess`) i Nginx (`nginx.conf`):

- **Strict-Transport-Security (HSTS):** `max-age=31536000; includeSubDomains; preload`
- **X-Frame-Options:** `SAMEORIGIN` (zabraňuje vložení webu do iframe na cizích doménách = ochrana před clickjackingem).
- **X-Content-Type-Options:** `nosniff` (zabraňuje MIME-confusion útokům).
- **Referrer-Policy:** `strict-origin-when-cross-origin` (chrání soukromí uživatelů při přechodu na externí weby).
- **Permissions-Policy:** Zakázán přístup ke kameře, mikrofonu a platebním API na úrovni prohlížeče (`camera=(), microphone=(), geolocation=(), payment=()`).
- **Ochrana skrytých souborů:** Přístup k souborům začínajícím tečkou (`.git`, `.env`, `.htaccess`) a zálohám je zakázán na úrovni webserveru (`Require all denied` / `deny all`).

---

## 3. Doporučení pro produkční spuštění

1. **Aktivace SSL/TLS certifikátu:** Po nahrání na hosting (např. WEDOS, Forpsi, Vercel, Cloudflare Pages) zajistit aktivní bezplatný certifikát Let's Encrypt a automatické přesměrování z HTTP na HTTPS (již předkonfigurováno v `.htaccess`).
2. **Backendové napojení e-mailu:** Pokud bude poptávkový formulář v budoucnu odesílat skutečné e-maily (např. přes PHP `mail()` nebo e-mailové API jako Resend/SendGrid), doporučuje se zachovat stávající honeypot a přidat serverovou validaci vstupů v cílovém skriptu.
