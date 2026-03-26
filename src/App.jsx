import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Filter, ChevronDown, ChevronUp, Moon, Sun, Globe, X, DollarSign, Briefcase, BookOpen, Award, Shield, Monitor, Users, Layers, AlertTriangle, TrendingUp, BarChart3, CheckCircle2, Star, Zap, ExternalLink, AlertCircle, CheckCircle, HelpCircle, Building2, Wrench, UserCircle } from "lucide-react";

/* ════════════════════════════════════════════════
   DATA: 26 certs with verified URLs & status
   Verification date: 2026-03-25
   ════════════════════════════════════════════════ */
const ALL_DATA = [
  // ── Reception ──
  { id:"R1", cat:"reception", cert:"VDI (Verbal Defense & Influence)", certFull:"語言防衛與衝突降級", org:"Vistelar", focus:"專門針對前線人員，提供結構化的衝突降級與危機心理介入方法論。", focusEn:"Structured conflict de-escalation and crisis psychological intervention for frontline staff.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"~$199 USD (8hr online)", costVal:199, costNote:"定價 $199/人，講師認證另計。", costNoteEn:"List price $199/person; instructor cert extra.", mode:"8小時線上結構化課程，可延伸考取講師資格。", modeEn:"8-hour online; optional instructor certification.", tier:"entry", priority:"recommended", complianceTag:null, pathOrder:1, url:"https://vistelar.com/", verified:"verified" },
  { id:"R2", cat:"reception", cert:"DAT (De-escalation & Active Threat)", certFull:"降級與主動威脅應對訓練", org:"AHLEI", focus:"專注於建立情境意識與情緒化訪客、潛在主動威脅的應對處理，提供線上自學與面授兩種模式。", focusEn:"Situational awareness, de-escalation & active threat response; available online self-paced or in-person.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"依採購方案而定", costVal:0, costNote:"AHLEI 官方產品頁面確認存在，提供線上/面授兩種形式，費用依企業採購方案而定。", costNoteEn:"Confirmed on AHLEI product page; online/in-person options; pricing per enterprise agreement.", mode:"線上自學或面授課程模組。", modeEn:"Online self-paced or in-person classroom modules.", tier:"entry", priority:"recommended", complianceTag:null, pathOrder:2, url:"https://info.ahlei.org/dat/", verified:"verified" },
  { id:"R3", cat:"reception", cert:"Disney Institute Service Excellence", certFull:"頂級無摩擦服務體驗", org:"Disney Institute", focus:"幫助團隊將安全管控的「摩擦感」降至最低，學習在訪客抵達的節點主動出擊。", focusEn:"Minimize security-control friction; proactive engagement at visitor touchpoints.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"$49–$199 (隨選) / 實體面議", costVal:499, costNote:"隨選課程 $49–$199；面授課程需洽 Disney Institute，原表 $1,750 為舊版定價。", costNoteEn:"On-demand $49-$199; in-person pricing via Disney Institute. Original $1,750 was legacy pricing.", mode:"線上隨選或實體觀摩課程。", modeEn:"On-demand online or in-person immersion.", tier:"entry", priority:"elective", complianceTag:null, pathOrder:3, url:"https://www.disneyinstitute.com/", verified:"partial" },
  { id:"R4", cat:"reception", cert:"CGSP (Certified Guest Service Professional)", certFull:"客戶導向安全意識", org:"AHLEI", focus:"快速將基礎安全意識與賓客服務融合，適合入門服務人員。", focusEn:"Fuse basic security awareness with guest service; entry-level.", prereq:"入門級別", prereqEn:"Entry level", cost:"$35–$47 USD", costVal:41, costNote:"考試費 $35 (AHLEI)；線上課程+考試套裝 $47；第三方可達 $134。", costNoteEn:"Exam $35 (AHLEI); online course+exam bundle $47; third-party up to $134.", mode:"2–10小時訓練 + 30題測驗。", modeEn:"2-10 hr training + 30-question proctored exam.", tier:"entry", priority:"baseline", complianceTag:null, pathOrder:0, url:"https://ahlei.servsafebrands.com/training-and-certification-overview", verified:"verified" },
  // ── Guard ──
  { id:"G1", cat:"guard", cert:"CPO (Certified Protection Officer)", certFull:"基礎專業化與職涯底盤", org:"IFPO", focus:"涵蓋資產防護、通訊、緊急應變等黃金標準入門認證。", focusEn:"Gold-standard entry cert: asset protection, communications, emergency response.", prereq:"6個月全職或1年兼職安全工作", prereqEn:"6 mo FT or 1 yr PT security", cost:"考試 $102–$120 / 全課程含教材另計", costVal:120, costNote:"IFPO 官方考試費 $102–$120；含教材套裝估計 $300–$500，因方案而異。", costNoteEn:"IFPO exam $102-$120; full program with materials est. $300-$500 varies.", mode:"80小時線上課+期末考，每2年續證。", modeEn:"80 hr online + exam; biennial renewal.", tier:"mid", priority:"baseline", complianceTag:null, pathOrder:1, url:"https://ifpo.org/education/certified-protection-officer-program/", verified:"verified" },
  { id:"G3", cat:"guard", cert:"Visitor Management System Training", certFull:"敏感場域/訪客管制", org:"Envoy / FacilityOS", focus:"針對設備攜入限制、進出管制與禁區護送的系統化SOP操作與查核。", focusEn:"SOPs for device restrictions, access control, restricted-zone escorts.", prereq:"依企業內部規範", prereqEn:"Per internal standards", cost:"依系統採購合約", costVal:0, costNote:"廠商系統內建訓練，隨系統採購附帶。", costNoteEn:"Vendor-provided training bundled with system procurement.", mode:"企業內部系統操作實訓。", modeEn:"Internal system hands-on training.", tier:"entry", priority:"mandatory", complianceTag:"internal", pathOrder:0, url:"https://envoy.com/", verified:"verified" },
  { id:"G4", cat:"guard", cert:"CLSO (Certified Lodging Security Officer)", certFull:"旅宿與商辦前線防護", org:"AHLEI", focus:"前線防護、人口販運辨識、去升級處理與賓客服務。", focusEn:"Frontline protection, human trafficking detection, de-escalation + guest service.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"~$127.50 USD", costVal:128, costNote:"AHLEI 報價，含互動訓練與測驗。可能因年度調整。", costNoteEn:"AHLEI listed price including training and exam; may adjust annually.", mode:"5小時互動模擬與60題測驗。", modeEn:"5 hr simulation + 60Q exam.", tier:"entry", priority:"elective", complianceTag:null, pathOrder:3, url:"https://ahlei.servsafebrands.com/training-and-certification-overview", verified:"partial" },
  { id:"G5", cat:"guard", cert:"SIA Licences (UK)", certFull:"英國法定強制資格", org:"英國 SIA (Security Industry Authority)", focus:"英國國家法規強制的門禁與保全操作員前線牌照。", focusEn:"UK statutory frontline licence for door supervision & security operatives.", prereq:"需背景審核與強制訓練", prereqEn:"Background check + mandatory training", cost:"牌照 £184 + 訓練 £150–£350", costVal:400, costNote:"GOV.UK 牌照費 £184 (3年)；訓練費依角色 £150–£350；2025年4月起換照需強制 refresher training。", costNoteEn:"GOV.UK licence £184 (3yr); training £150-£350 by role; mandatory refresher from Apr 2025.", mode:"實體混成學習，每3年換照。", modeEn:"Blended learning; 3-year renewal + refresher.", tier:"mid", priority:"mandatory", complianceTag:"UK-regulatory", pathOrder:0, url:"https://www.gov.uk/getting-an-sia-licence", verified:"verified", scopeNote:"🌍 限海外輪調：僅英國廠區值勤需求時適用。", scopeNoteEn:"🌍 Overseas rotation only: applicable when stationed at UK sites." },
  { id:"G6", cat:"guard", cert:"APP (Associate Protection Professional)", certFull:"保全職涯第一階", org:"ASIS International", focus:"安全從業人員的入門級考試，涵蓋4大基礎領域。", focusEn:"Entry-level ASIS exam; 4 foundational security domains.", prereq:"1年受薪安全經驗或6個月+認可證書", prereqEn:"1 yr paid security or 6 mo + approved credential", cost:"會員 $580 / 非會員 $910", costVal:580, costNote:"ASIS 官方統一收費；原表 $300–$620 低估，已修正。", costNoteEn:"ASIS official pricing; original $300-$620 was understated, corrected.", mode:"考試型，3年一循環續證。", modeEn:"Exam-based; 3-year cycle.", tier:"mid", priority:"recommended", complianceTag:null, pathOrder:4, url:"https://www.asisonline.org/certification/apply-for-certification/", verified:"verified" },
  // ── Control Room ──
  { id:"C1", cat:"control", cert:"SICC (Security Industry Cybersecurity Cert)", certFull:"網路與實體安全融合", org:"SIA (Security Industry Association)", focus:"補足操作員對IP攝影機、門禁等物聯網設備被駭或失效的敏感度。", focusEn:"Close operators' IoT blind spots — IP cameras, access control cyber-physical threats.", prereq:"2年相關經驗", prereqEn:"2 yr relevant experience", cost:"自修套裝 $395–$595 / 含課程 $695–$895", costVal:595, costNote:"原表 $75–$100 為舊資訊；SIA 現行自修套裝 $395(會員)/$595(非會員)，含課 $695/$895。", costNoteEn:"Original $75-$100 outdated; SIA current self-study $395/$595, with course $695/$895.", mode:"10領域線上考試，年繳 $40 續證。", modeEn:"10-domain exam; $40/yr renewal.", tier:"mid", priority:"recommended", complianceTag:null, pathOrder:2, url:"https://www.securityindustry.org/professional-development/security-industry-cybersecurity-certification-sicc/", verified:"verified" },
  { id:"C2", cat:"control", cert:"GSOC (GIAC Security Operations Certified)", certFull:"進階戰情與威脅關聯", org:"GIAC / SANS", focus:"透過 SANS SEC450 課程培養藍隊 SOC 分析能力，涵蓋網路與實體關聯分析。", focusEn:"Blue team SOC analyst skills via SANS SEC450; cyber-physical correlation analysis.", prereq:"建議具備 SIEM、日誌分析基礎", prereqEn:"SIEM / log analysis background recommended", cost:"SANS 課程 ~$7,000–$9,000 + 考試另計", costVal:8000, costNote:"GIAC GSOC 認證透過 SANS SEC450 課程取得；原表「GSOC」名稱需注意非獨立實體安全認證。", costNoteEn:"GIAC GSOC earned via SANS SEC450; note this is IT/cyber SOC, not physical security-specific.", mode:"5–6天高強度課程 + 嚴格測驗。", modeEn:"5-6 day intensive course + rigorous exam.", tier:"advanced", priority:"elective", complianceTag:null, pathOrder:5, url:"https://www.sans.org/cyber-security-courses/blue-team-fundamentals-security-operations-analysis/", verified:"verified" },
  { id:"C3", cat:"control", cert:"Five Diamond Certification", certFull:"監控品質與降低誤派遣", org:"TMA (The Monitoring Association)", focus:"告警監控中心組織治理、降低誤派遣率，避免警報疲勞。", focusEn:"Alarm monitoring governance; reduce false dispatch & alert fatigue.", prereq:"組織需100%操作員完訓", prereqEn:"100% operator completion req'd", cost:"~$400/site/yr", costVal:400, costNote:"TMA 組織級認證，費用依站點規模而定。", costNoteEn:"TMA organizational cert; cost varies by site.", mode:"年度驗證，操作員每3年再認證。", modeEn:"Annual site verify; 3-yr operator re-cert.", tier:"mid", priority:"recommended", complianceTag:null, pathOrder:3, url:"https://tma.us/", verified:"partial", scopeNote:"⚠ 需組織決策：此為站點級認證，非個人可獨立推動。", scopeNoteEn:"⚠ Org decision required: site-level cert, not individually actionable." },
  { id:"C4", cat:"control", cert:"RPL (Registered Public Safety Leader)", certFull:"通訊高壓調度與決策", org:"APCO International", focus:"標準化績效考核與高壓調度管理，避免操作員隧道視覺。", focusEn:"Standardized performance & high-pressure dispatch; prevent tunnel vision.", prereq:"APCO 會員及管理經驗", prereqEn:"APCO membership + mgmt experience", cost:"~$1,105 USD", costVal:1105, costNote:"APCO 官網列出之方案價格。", costNoteEn:"APCO official program pricing.", mode:"12個月線上專案，每4年再認證。", modeEn:"12-month online project; 4-yr re-cert.", tier:"advanced", priority:"elective", complianceTag:null, pathOrder:4, url:"https://www.apcointl.org/", verified:"partial" },
  { id:"C5", cat:"control", cert:"Tactical Dispatch / EMD", certFull:"菁英戰術與緊急協議", org:"APCO / IAED", focus:"突發戰術事件管理、醫療與消防分流及協議操作。", focusEn:"Tactical incident mgmt, medical/fire triage & protocol dispatch.", prereq:"1年經驗加 FEMA 基礎課", prereqEn:"1 yr + FEMA basics", cost:"依地區與授權機構而定", costVal:0, costNote:"APCO/IAED 地區授權機構定價。", costNoteEn:"Pricing set by regional authorized agencies.", mode:"情境演練，累積教育時數續證。", modeEn:"Scenario-based; continuing ed for renewal.", tier:"mid", priority:"recommended", complianceTag:null, pathOrder:3, url:"https://www.apcointl.org/", verified:"partial" },
  { id:"C6", cat:"control", cert:"CCTV Operator Licence (UK SIA)", certFull:"公共空間監控牌照", org:"英國 SIA", focus:"英國公共空間監控的法定操作員執照。", focusEn:"UK statutory CCTV public space surveillance operator licence.", prereq:"年滿18歲，有英國工作權", prereqEn:"18+, right to work in UK", cost:"牌照 £184 + 訓練 £200–£350", costVal:450, costNote:"GOV.UK 牌照 £184；CCTV 訓練 3天，約 £200–£350。", costNoteEn:"GOV.UK licence £184; CCTV training 3 days, £200-£350.", mode:"至少3天面授實作，3年一期。", modeEn:"Min. 3-day in-person; 3-year term.", tier:"entry", priority:"mandatory", complianceTag:"UK-regulatory", pathOrder:0, url:"https://www.gov.uk/getting-an-sia-licence", verified:"verified" },
  { id:"C7", cat:"control", cert:"ISO 11064 (Ergonomic Design)", certFull:"控制中心抗疲勞設計", org:"ISO", focus:"人體工學設計規範（照明、聲學），確保操作員效能。", focusEn:"Ergonomic standard (lighting, acoustics) for sustained operator performance.", prereq:"針對設施與系統設計端", prereqEn:"For facility & system designers", cost:"標準文件購買費", costVal:0, costNote:"ISO 標準文件可從 ISO 官網或各國標準機構購買。", costNoteEn:"ISO standard documents purchased from ISO or national standards bodies.", mode:"應用於空間佈局與硬體建置。", modeEn:"Applied to layout & hardware.", tier:"mid", priority:"recommended", complianceTag:"ISO", pathOrder:1, url:"https://www.iso.org/standard/19045.html", verified:"verified" },
  // ── Strategic ──
  { id:"S1", cat:"strategic", cert:"FEMA ICS / NIMS", certFull:"跨單位共通語言", org:"美國 FEMA", focus:"讓前中後端具備指揮、作戰、計畫、後勤一致的標準化通報語言。", focusEn:"Standardized command/ops/planning/logistics language across all echelons.", prereq:"無限制", prereqEn:"No restriction; foundational", cost:"免費", costVal:0, costNote:"美國政府免費提供線上自學課程，全球可修。", costNoteEn:"Free US government online courses, globally accessible.", mode:"線上自學 (IS-100.c / IS-700.b)。", modeEn:"Self-paced online (IS-100.c / IS-700.b).", tier:"entry", priority:"baseline", complianceTag:null, pathOrder:0, url:"https://training.fema.gov/nims/", verified:"verified" },
  { id:"S2", cat:"strategic", cert:"CPP (Certified Protection Professional)", certFull:"高階企業安全總盤", org:"ASIS International", focus:"企業安全風險管理與戰略規劃，北美黃金標準。", focusEn:"Enterprise security risk management & strategic planning — NA gold standard.", prereq:"5–7年經驗 (含3年主管)", prereqEn:"5-7 yr (incl. 3 yr mgmt)", cost:"會員 $580 / 非會員 $910", costVal:745, costNote:"ASIS 官方考試費；另有備考課程/教材費。3年需 60 CPE 續證。", costNoteEn:"ASIS official exam fee; prep courses/materials extra. 60 CPE / 3yr renewal.", mode:"電腦測驗 (200題/4小時)，每3年 60 CPE。", modeEn:"Computer exam (200Q/4hr); 60 CPE / 3 yr.", tier:"advanced", priority:"recommended", complianceTag:null, pathOrder:3, url:"https://www.asisonline.org/certification/apply-for-certification/", verified:"verified" },
  { id:"S3", cat:"strategic", cert:"CBCP (DRI) / CBCI (BCI)", certFull:"高階營運持續實務", org:"DRI International / BCI", focus:"大規模營運中斷復原、戰情室與連續性計畫。", focusEn:"Enterprise disruption recovery; war rooms & continuity plans.", prereq:"2年實務 (CBCP) / 無 (CBCI)", prereqEn:"2 yr (CBCP) / none (CBCI)", cost:"CBCP: 訓練$2,850+考試$400 / CBCI: 依地區", costVal:3250, costNote:"DRI CBCP 訓練 $2,850 + 考試申請 $400 + 年費 $225。BCI CBCI 課程 3–5天，費用依地區及授課夥伴而定。", costNoteEn:"DRI CBCP training $2,850 + exam app $400 + $225/yr. BCI CBCI 3-5 days, cost varies by region/partner.", mode:"測驗+經歷審查 (CBCP)；需持續 CPD。", modeEn:"Exam + experience review (CBCP); ongoing CPD.", tier:"advanced", priority:"recommended", complianceTag:null, pathOrder:4, url:"https://drii.org/certification/cbcp", verified:"verified", scopeNote:"📋 限 BCP 權責：建議僅負責營運持續計畫的主管取得。", scopeNoteEn:"📋 BCP leads only: recommended for managers responsible for business continuity planning." },
  { id:"S4", cat:"strategic", cert:"CEM (Certified Emergency Manager)", certFull:"最高階緊急應變", org:"IAEM", focus:"專職緊急管理與公共部門的最高黃金標準。", focusEn:"Highest gold standard for emergency managers & public sector.", prereq:"3年全職加災難演習", prereqEn:"3 yr FT + disaster drills", cost:"$430–$640 USD", costVal:535, costNote:"IAEM 官方費用區間。", costNoteEn:"IAEM official fee range.", mode:"文件審核加選擇題，5年一期。", modeEn:"Document review + MCQ; 5-yr term.", tier:"advanced", priority:"elective", complianceTag:null, pathOrder:5, url:"https://www.iaem.org/certification", verified:"verified" },
  { id:"S5", cat:"strategic", cert:"PSP (Physical Security Professional)", certFull:"實體與技術防護建置", org:"ASIS International", focus:"物理安全設備評估、建置與技術整合專案管理。", focusEn:"Physical security equipment eval, build-out & tech integration PM.", prereq:"3–5年實體安全或專案", prereqEn:"3-5 yr physical security / PM", cost:"會員 $580 / 非會員 $910", costVal:745, costNote:"ASIS 官方統一收費，同 CPP/PCI。", costNoteEn:"ASIS standard pricing, same as CPP/PCI.", mode:"電腦測驗，3年續證。", modeEn:"Computer exam; 3-yr renewal.", tier:"advanced", priority:"recommended", complianceTag:null, pathOrder:3, url:"https://www.asisonline.org/certification/apply-for-certification/", verified:"verified" },
  { id:"S6", cat:"strategic", cert:"PCI (Professional Certified Investigator)", certFull:"內部調查與案件管理", org:"ASIS International", focus:"企業內部舞弊調查、證據蒐集與案件管理。", focusEn:"Internal fraud investigation, evidence collection & case management.", prereq:"3–5年調查 (含2年案件管理)", prereqEn:"3-5 yr investigation (2 yr case mgmt)", cost:"會員 $580 / 非會員 $910", costVal:745, costNote:"ASIS 官方統一收費。", costNoteEn:"ASIS standard pricing.", mode:"多選題，每3年 60 CPE。", modeEn:"MCQ; 60 CPE / 3 yr.", tier:"advanced", priority:"elective", complianceTag:null, pathOrder:5, url:"https://www.asisonline.org/certification/apply-for-certification/", verified:"verified" },
  { id:"S7", cat:"strategic", cert:"Level 6 Diploma / CSMP / CSyP", certFull:"高階戰略與學術文憑", org:"ISRM / Security Institute", focus:"戰略風險、頂級顧問的嚴格學術與同儕審查。", focusEn:"Strategic risk for top-level consultants — academic & peer review.", prereq:"碩士級別論文能力", prereqEn:"Master's dissertation capability", cost:"~£1,350+ (CSMP)", costVal:1700, costNote:"以 CSMP 為例。各機構與級別費用不同。", costNoteEn:"CSMP example; varies by organization and level.", mode:"12個月遠距，政策論文。", modeEn:"12-month distance; policy paper.", tier:"advanced", priority:"elective", complianceTag:null, pathOrder:6, url:"https://www.isrm.org.uk/", verified:"partial" },
  { id:"S8", cat:"strategic", cert:"TAPA FSR/TSR / SEMI E187", certFull:"半導體與高價值防護", org:"TAPA / SEMI", focus:"高價值貨物竊盜稽核標準＋半導體機台強制網安標準。", focusEn:"High-value cargo theft audit + mandatory semiconductor equipment cybersecurity.", prereq:"需通過合規測試", prereqEn:"Must pass compliance assessment", cost:"非會員: 訓練€2,000/人 + 認證費", costVal:2500, costNote:"TAPA EMEA 非會員訓練 €2,000/人/課程；認證 €500–€1,000。會員含免費訓練名額。", costNoteEn:"TAPA EMEA non-member €2,000/person/course; cert €500-€1,000. Members get included training.", mode:"第三方外部實體稽核。", modeEn:"Third-party physical audit.", tier:"advanced", priority:"mandatory", complianceTag:"semiconductor", pathOrder:1, url:"https://tapaemea.org/", verified:"verified" },
  { id:"S9", cat:"strategic", cert:"SANS ICS410 / SEC450", certFull:"藍隊與工控系統資安", org:"SANS Institute", focus:"工控系統 (SCADA) 與高階網安實戰。", focusEn:"ICS/SCADA & advanced cybersecurity hands-on lab.", prereq:"進階網安技術", prereqEn:"Advanced cybersecurity skills", cost:"$7,000–$9,000 USD / 門課", costVal:8000, costNote:"SANS 官方課程定價；含 GIAC 認證考試需額外費用。", costNoteEn:"SANS official course pricing; GIAC cert exam extra.", mode:"5–6天高強度實機操作。", modeEn:"5-6 day intensive hands-on lab.", tier:"advanced", priority:"recommended", complianceTag:"semiconductor", pathOrder:2, url:"https://www.sans.org/cyber-security-courses/ics-scada-cyber-security-essentials/", verified:"verified" },
  // ── AI & Digital Transformation (Pioneer Academy) ──
  { id:"E01", cat:"aidx", cert:"Career Essentials in GenAI", certFull:"生成式AI職業基礎", org:"Microsoft + LinkedIn", focus:"最快取得 LinkedIn 認證的路徑，自動顯示在 LinkedIn 個人檔案上。", focusEn:"Fastest path to a recognizable credential. Auto-displays on LinkedIn.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"免費", costVal:0, costNote:"免費。完成後自動獲得 LinkedIn 認證。", costNoteEn:"Free. Auto-earns LinkedIn credential on completion.", mode:"4小時影片課程。", modeEn:"4-hour video course.", tier:"entry", priority:"baseline", complianceTag:null, pathOrder:0, url:"https://www.linkedin.com/learning/paths/career-essentials-in-generative-ai-by-microsoft-and-linkedin", verified:"verified" },
  { id:"E03", cat:"aidx", cert:"Elements of AI", certFull:"AI 入門", org:"University of Helsinki", focus:"最深入的 AI 概念覆蓋。25+ 語言。全球 200 萬+ 畢業生。", focusEn:"Deepest conceptual AI coverage. 25+ languages. 2M+ graduates.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"免費", costVal:0, costNote:"芬蘭赫爾辛基大學免費提供，支援 25+ 語言。", costNoteEn:"Free from U of Helsinki, 25+ languages.", mode:"30小時文字課程。", modeEn:"30-hour text-based course.", tier:"entry", priority:"recommended", complianceTag:null, pathOrder:1, url:"https://www.elementsofai.com/", verified:"verified" },
  { id:"E04", cat:"aidx", cert:"IBM SkillsBuild AI Fundamentals", certFull:"IBM AI 基礎", org:"IBM", focus:"企業認證。Credly 驗證的數位徽章，適合企業招聘使用。", focusEn:"Enterprise credential. Credly-verified badge for corporate hiring.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"免費", costVal:0, costNote:"免費。Credly 數位徽章。", costNoteEn:"Free. Credly digital badge.", mode:"10小時混合課程。", modeEn:"10-hour mixed format.", tier:"entry", priority:"recommended", complianceTag:null, pathOrder:2, url:"https://skillsbuild.org/", verified:"verified" },
  { id:"E05", cat:"aidx", cert:"Google AI Essentials", certFull:"Google AI Essentials", org:"Google / Coursera", focus:"最具實作性的入門課程。Coursera 排名第一。7 天免費試用。", focusEn:"Most hands-on entry course. #1 on Coursera. 7-day free trial.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"Coursera 訂閱 (7天免費)", costVal:49, costNote:"Coursera 訂閱制，有 7 天免費試用。", costNoteEn:"Coursera subscription; 7-day free trial.", mode:"5小時實作課程。", modeEn:"5-hour hands-on course.", tier:"entry", priority:"recommended", complianceTag:null, pathOrder:3, url:"https://www.coursera.org/specializations/ai-essentials-google", verified:"verified" },
  { id:"E06", cat:"aidx", cert:"AI for Everyone", certFull:"給所有人的AI", org:"DeepLearning.AI", focus:"策略性 AI 理解的黃金標準。吳恩達 (Andrew Ng) 講授。", focusEn:"Gold standard for strategic AI understanding. Andrew Ng.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"Coursera 訂閱 (7天免費)", costVal:49, costNote:"Coursera 訂閱制。專為管理層設計。", costNoteEn:"Coursera subscription. Designed for management.", mode:"6小時影片課程，多語言字幕。", modeEn:"6-hour video course, multi-language subtitles.", tier:"entry", priority:"baseline", complianceTag:null, pathOrder:4, url:"https://www.coursera.org/learn/ai-for-everyone", verified:"verified" },
  { id:"E07", cat:"aidx", cert:"AI & Career Empowerment", certFull:"AI 與職涯賦能", org:"UMD Smith School", focus:"大學認證。供應鏈與營運 AI 強項。", focusEn:"University-backed. Strong supply chain & operations AI.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"免費", costVal:0, costNote:"馬里蘭大學免費提供。", costNoteEn:"Free from University of Maryland.", mode:"25小時影片課程。", modeEn:"25-hour video course.", tier:"entry", priority:"elective", complianceTag:null, pathOrder:5, url:"https://www.rhsmith.umd.edu/programs/executive-education/learning-opportunities-individuals/free-online-certificate-artificial-intelligence-and-career-empowerment", verified:"verified" },
  { id:"E08", cat:"aidx", cert:"AWS GenAI Introduction", certFull:"AWS 生成式AI入門", org:"AWS", focus:"僅約 1 小時。快速 AWS 品牌徽章。", focusEn:"Only ~1 hour. Quick AWS-branded badge.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"免費", costVal:0, costNote:"免費。AWS 訓練徽章。", costNoteEn:"Free. AWS training badge.", mode:"1小時混合課程。", modeEn:"1-hour mixed format.", tier:"entry", priority:"elective", complianceTag:null, pathOrder:6, url:"https://aws.amazon.com/training/learn-about/generative-ai/", verified:"verified" },
  { id:"E10", cat:"aidx", cert:"NVIDIA GenAI Explained", certFull:"NVIDIA 生成式AI解說", org:"NVIDIA DLI", focus:"NVIDIA 品牌課程。開發者計畫免費。", focusEn:"NVIDIA-branded. Free with Developer Program.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"免費", costVal:0, costNote:"NVIDIA 開發者計畫免費。", costNoteEn:"Free with NVIDIA Developer Program.", mode:"2小時影片課程。", modeEn:"2-hour video course.", tier:"entry", priority:"elective", complianceTag:null, pathOrder:7, url:"https://www.nvidia.com/en-us/training/online/", verified:"verified" },
  { id:"I01", cat:"aidx", cert:"Prompt Engineering for ChatGPT", certFull:"ChatGPT 提示工程", org:"Vanderbilt / Coursera", focus:"最權威的提示工程課程。Jules White 博士。評分 4.98/5。", focusEn:"The definitive PE course. Dr. Jules White. 4.98/5.", prereq:"基本 AI 工具使用經驗", prereqEn:"Basic AI tool usage", cost:"Coursera 訂閱", costVal:49, costNote:"Coursera 訂閱制。", costNoteEn:"Coursera subscription.", mode:"18小時影片，多語言字幕。", modeEn:"18-hour video, multi-language subtitles.", tier:"mid", priority:"recommended", complianceTag:null, pathOrder:8, url:"https://www.coursera.org/learn/prompt-engineering", verified:"verified" },
  { id:"I02", cat:"aidx", cert:"ChatGPT PE for Developers", certFull:"開發者提示工程", org:"DeepLearning.AI + OpenAI", focus:"開發者 + LLM API。吳恩達 + OpenAI 合作。Jupyter 實驗環境。", focusEn:"Developers + LLM APIs. Andrew Ng + OpenAI. Jupyter labs.", prereq:"Python 基礎", prereqEn:"Basic Python", cost:"免費", costVal:0, costNote:"免費短課程。1.5 小時。", costNoteEn:"Free short course. 1.5 hours.", mode:"1.5小時實作。", modeEn:"1.5-hour hands-on.", tier:"mid", priority:"recommended", complianceTag:null, pathOrder:9, url:"https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", verified:"verified" },
  { id:"I04", cat:"aidx", cert:"Google AI Professional Certificate", certFull:"Google AI 專業證書", org:"Google / Coursera", focus:"20+ 實作活動。Gemini 生態系。作品集建構器。2026年2月推出。", focusEn:"20+ hands-on activities. Gemini. Portfolio builder. Feb 2026.", prereq:"基本 AI 使用經驗", prereqEn:"Basic AI usage", cost:"Coursera 訂閱", costVal:49, costNote:"Coursera 訂閱制。Google 官方專業證書。", costNoteEn:"Coursera subscription. Official Google pro cert.", mode:"7小時實作課程。", modeEn:"7-hour hands-on course.", tier:"mid", priority:"recommended", complianceTag:null, pathOrder:10, url:"https://www.coursera.org/professional-certificates/google-ai", verified:"verified" },
  { id:"I07", cat:"aidx", cert:"Stanford ML Specialization", certFull:"Stanford 機器學習", org:"Stanford / DeepLearning.AI", focus:"吳恩達的傳奇課程。全球 480 萬+ 學習者。", focusEn:"Andrew Ng's legendary program. 4.8M+ learners.", prereq:"基礎數學", prereqEn:"Basic mathematics", cost:"Coursera 訂閱", costVal:49, costNote:"Coursera 訂閱制。", costNoteEn:"Coursera subscription.", mode:"60小時影片課程。", modeEn:"60-hour video course.", tier:"mid", priority:"elective", complianceTag:null, pathOrder:11, url:"https://www.coursera.org/specializations/machine-learning-introduction", verified:"verified" },
  { id:"I08", cat:"aidx", cert:"Anthropic PE Interactive Tutorial", certFull:"Anthropic 提示工程教學", org:"Anthropic", focus:"Claude 專屬提示工程。互動式 Jupyter 筆記本。", focusEn:"Claude-specific PE. Interactive Jupyter notebooks.", prereq:"Python 基礎", prereqEn:"Basic Python", cost:"免費", costVal:0, costNote:"免費 GitHub 開源教學。", costNoteEn:"Free open-source GitHub tutorial.", mode:"4小時實作。", modeEn:"4-hour hands-on.", tier:"mid", priority:"recommended", complianceTag:null, pathOrder:12, url:"https://github.com/anthropics/prompt-eng-interactive-tutorial", verified:"verified" },
  { id:"I09", cat:"aidx", cert:"Harvard CS50 AI", certFull:"Harvard CS50 AI", org:"Harvard / edX", focus:"最嚴謹的 AI + Python 課程。免費哈佛證書。", focusEn:"Most rigorous AI + Python. Free Harvard certificate.", prereq:"基礎程式設計", prereqEn:"Basic programming", cost:"免費 (證書需付費)", costVal:0, costNote:"課程免費；認證證書需付費。", costNoteEn:"Course free; verified certificate requires payment.", mode:"70小時影片課程。", modeEn:"70-hour video course.", tier:"mid", priority:"elective", complianceTag:null, pathOrder:13, url:"https://cs50.harvard.edu/ai/", verified:"verified" },
  { id:"A01", cat:"aidx", cert:"IBM GenAI Engineering Pro Cert", certFull:"IBM GenAI 工程專業證書", org:"IBM / Coursera", focus:"完整 GenAI 工程。RAG + LangChain。畢業專題。", focusEn:"Full GenAI engineering. RAG + LangChain. Capstone.", prereq:"Python 中階 + ML 基礎", prereqEn:"Intermediate Python + ML basics", cost:"Coursera 訂閱", costVal:49, costNote:"Coursera 訂閱制。約 100 小時。", costNoteEn:"Coursera subscription. ~100 hours.", mode:"100小時實作課程。", modeEn:"100-hour hands-on course.", tier:"advanced", priority:"elective", complianceTag:null, pathOrder:14, url:"https://www.coursera.org/professional-certificates/ibm-generative-ai-engineering", verified:"verified" },
  { id:"A04", cat:"aidx", cert:"Deep Learning Specialization", certFull:"深度學習專項", org:"DeepLearning.AI", focus:"吳恩達的權威深度學習。神經網路到轉換器的完整旅程。", focusEn:"Andrew Ng's definitive DL. Neural nets to transformers.", prereq:"Python + 線性代數基礎", prereqEn:"Python + linear algebra", cost:"Coursera 訂閱", costVal:49, costNote:"Coursera 訂閱制。80 小時。", costNoteEn:"Coursera subscription. 80 hours.", mode:"80小時影片+實作。", modeEn:"80-hour video + hands-on.", tier:"advanced", priority:"elective", complianceTag:null, pathOrder:15, url:"https://www.coursera.org/specializations/deep-learning", verified:"verified" },
  { id:"A05", cat:"aidx", cert:"DeepLearning.AI Short Courses", certFull:"DeepLearning.AI 短課程集", org:"DeepLearning.AI", focus:"50+ 免費短課程。與 OpenAI、Google、AWS 共同創建。", focusEn:"50+ free short courses. Co-created with OpenAI, Google, AWS.", prereq:"依個別課程而定", prereqEn:"Varies by course", cost:"免費", costVal:0, costNote:"全部免費。每門約 1–3 小時。", costNoteEn:"All free. ~1-3 hours each.", mode:"1–3小時實作短課程。", modeEn:"1-3 hour hands-on short courses.", tier:"advanced", priority:"recommended", complianceTag:null, pathOrder:16, url:"https://www.deeplearning.ai/courses/", verified:"verified" },
  { id:"A06", cat:"aidx", cert:"fast.ai Practical Deep Learning", certFull:"fast.ai 實用深度學習", org:"fast.ai", focus:"「先建構，後理論。」600 萬+ 觀看。傳奇社群。", focusEn:"'Build first, theory later.' 6M+ views. Legendary community.", prereq:"Python 基礎", prereqEn:"Basic Python", cost:"免費", costVal:0, costNote:"完全免費。PyTorch 為基礎。", costNoteEn:"Completely free. PyTorch-based.", mode:"40小時影片課程。", modeEn:"40-hour video course.", tier:"advanced", priority:"elective", complianceTag:null, pathOrder:17, url:"https://course.fast.ai/", verified:"verified" },
  { id:"A07", cat:"aidx", cert:"Hugging Face LLM Course", certFull:"Hugging Face LLM 課程", org:"Hugging Face", focus:"開源 LLM 精通。微調 + 推理模型。", focusEn:"Open-source LLM mastery. Fine-tuning + reasoning models.", prereq:"Python + ML 基礎", prereqEn:"Python + ML basics", cost:"免費", costVal:0, costNote:"完全免費開源課程。", costNoteEn:"Completely free open-source.", mode:"40小時實作課程。", modeEn:"40-hour hands-on course.", tier:"advanced", priority:"elective", complianceTag:null, pathOrder:18, url:"https://huggingface.co/learn/llm-course/chapter1/1", verified:"verified" },
  { id:"A08", cat:"aidx", cert:"Hugging Face AI Agents Course", certFull:"Hugging Face AI 代理課程", org:"Hugging Face", focus:"使用開源工具建構 AI 代理。smolagents + LangGraph + MCP。", focusEn:"Build AI agents with open-source tools. smolagents + LangGraph + MCP.", prereq:"Python 中階 + LLM 基礎", prereqEn:"Intermediate Python + LLM basics", cost:"免費", costVal:0, costNote:"免費開源。含 MCP 協議。", costNoteEn:"Free open-source. Includes MCP protocol.", mode:"20小時實作課程。", modeEn:"20-hour hands-on course.", tier:"advanced", priority:"recommended", complianceTag:null, pathOrder:19, url:"https://huggingface.co/learn", verified:"verified" },
  // ── Anthropic Academy (launched 2026-03-02) ──
  { id:"AA01", cat:"aidx", cert:"Claude 101", certFull:"Claude 101 基礎", org:"Anthropic Academy", focus:"Claude 日常工作應用基礎。核心功能、實用場景與進階學習資源導覽。所有人的起點。", focusEn:"Claude for everyday work. Core features, practical use cases & learning resource navigation. Starting point for everyone.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"免費（含證書）", costVal:0, costNote:"完全免費。完成後頒發 Anthropic 官方證書，可加入 LinkedIn。", costNoteEn:"Completely free. Anthropic official certificate on completion; LinkedIn-ready.", mode:"自學線上課程。", modeEn:"Self-paced online.", tier:"entry", priority:"baseline", complianceTag:null, pathOrder:20, url:"https://anthropic.skilljar.com/claude-101", verified:"verified" },
  { id:"AA02", cat:"aidx", cert:"AI Fluency: Framework & Foundations", certFull:"AI 素養：框架與基礎", org:"Anthropic Academy", focus:"4D 框架（Delegation 委派、Description 描述、Discernment 辨識、Diligence 盡責）— 與 AI 系統有效、安全、負責任地協作。", focusEn:"4D Framework (Delegation, Description, Discernment, Diligence) — collaborate with AI systems effectively, safely & responsibly.", prereq:"無經驗要求", prereqEn:"No experience required", cost:"免費（含證書）", costVal:0, costNote:"免費。與 University College Cork 及 Ringling College 教授共同開發。Creative Commons 授權。", costNoteEn:"Free. Co-developed with UCC & Ringling College professors. Creative Commons licensed.", mode:"自學線上課程。", modeEn:"Self-paced online.", tier:"entry", priority:"baseline", complianceTag:null, pathOrder:21, url:"https://anthropic.skilljar.com/ai-fluency-framework-foundations", verified:"verified" },
  { id:"AA03", cat:"aidx", cert:"Driving Enterprise Adoption of Claude", certFull:"推動企業 Claude 導入", org:"Anthropic Academy", focus:"企業內部 Claude 導入策略、變革管理與規模化部署。專為推動組織 AI 轉型的管理者設計。", focusEn:"Enterprise Claude adoption strategy, change management & scaled deployment. Designed for managers driving organizational AI transformation.", prereq:"管理職或 AI 推動角色", prereqEn:"Management or AI champion role", cost:"免費（含證書）", costVal:0, costNote:"免費。含 Train-the-Trainer 延伸課程。", costNoteEn:"Free. Includes Train-the-Trainer extension course.", mode:"自學線上課程。", modeEn:"Self-paced online.", tier:"mid", priority:"recommended", complianceTag:null, pathOrder:22, url:"https://anthropic.skilljar.com/driving-enterprise-adoption-of-claude", verified:"verified" },
  { id:"AA04", cat:"aidx", cert:"Building with the Claude API", certFull:"使用 Claude API 開發", org:"Anthropic Academy", focus:"完整的 Claude API 開發課程 — 系統提示、工具使用、上下文窗口、架構模式與 AI 產品設計策略。超過 8 小時內容。", focusEn:"Comprehensive Claude API course — system prompts, tool use, context windows, architecture patterns & AI product design. 8+ hours.", prereq:"程式設計經驗", prereqEn:"Programming experience", cost:"免費（含證書）", costVal:0, costNote:"免費。涵蓋 API 基礎到生產部署。", costNoteEn:"Free. Covers API basics to production deployment.", mode:"8+ 小時實作課程。", modeEn:"8+ hour hands-on course.", tier:"mid", priority:"recommended", complianceTag:null, pathOrder:23, url:"https://anthropic.skilljar.com/claude-with-the-anthropic-api", verified:"verified" },
  { id:"AA05", cat:"aidx", cert:"Introduction to MCP (Model Context Protocol)", certFull:"MCP 模型上下文協議入門", org:"Anthropic Academy", focus:"從零建構 MCP 伺服器與客戶端（Python）。掌握三大核心原語 — Tools、Resources、Prompts — 連接 Claude 與外部服務。", focusEn:"Build MCP servers & clients from scratch (Python). Master 3 core primitives — Tools, Resources, Prompts — connecting Claude to external services.", prereq:"Python 中階", prereqEn:"Intermediate Python", cost:"免費（含證書）", costVal:0, costNote:"免費。另有進階 MCP 課程（Advanced Topics）。", costNoteEn:"Free. Advanced MCP Topics course also available.", mode:"自學實作課程。", modeEn:"Self-paced hands-on.", tier:"advanced", priority:"recommended", complianceTag:null, pathOrder:24, url:"https://anthropic.skilljar.com/introduction-to-model-context-protocol", verified:"verified" },
  { id:"AA06", cat:"aidx", cert:"Claude Code in Action", certFull:"Claude Code 實戰", org:"Anthropic Academy", focus:"將 Claude Code 整合到開發工作流程 — 命令列 AI 助手，直接在終端機進行程式碼生成、除錯與重構。", focusEn:"Integrate Claude Code into dev workflow — command-line AI assistant for code generation, debugging & refactoring directly in terminal.", prereq:"開發者，熟悉命令列", prereqEn:"Developer, comfortable with CLI", cost:"免費（含證書）", costVal:0, costNote:"免費。含 Agent Skills 與 Subagents 延伸課程。", costNoteEn:"Free. Agent Skills & Subagents extension courses available.", mode:"自學實作課程。", modeEn:"Self-paced hands-on.", tier:"advanced", priority:"recommended", complianceTag:null, pathOrder:25, url:"https://anthropic.skilljar.com/claude-code-in-action", verified:"verified" },
];

/* ════════════════════════════════════════════════
   BENCHMARK: Industry recognition by cert ID
   ════════════════════════════════════════════════ */
const BENCHMARK = {
  R1: { companies:["Mall of America","Casino Arizona","Tropicana","Marquette University Police"], sectors:["Retail","Gaming & Casino","Healthcare","Higher Education","Law Enforcement"], regionsEn:"North America, Europe (via Dynamis UK partner)", regionsZh:"北美、歐洲 (透過英國 Dynamis 合作夥伴)", noteEn:"Adopted by 100,000+ public safety officers over 30 years. Used across 14 industry verticals.", noteZh:"30 年來培訓超過 10 萬名公共安全人員，涵蓋 14 個產業類別。" },
  R2: { companies:["Hilton","Marriott","Hyatt","IHG","Wyndham"], sectors:["Hospitality","Tourism","Convention Centers"], regionsEn:"Global (via AHLEI network)", regionsZh:"全球 (透過 AHLEI 網路)", noteEn:"AHLEI is the education arm of the American Hotel & Lodging Association, training across 100+ countries.", noteZh:"AHLEI 為美國飯店與住宿協會教育單位，訓練遍布 100 多國。" },
  R3: { companies:["Disney Parks & Resorts","Fortune 500 corporate clients"], sectors:["Hospitality","Healthcare","Retail","Government","Financial Services"], regionsEn:"Global", regionsZh:"全球", noteEn:"Disney Institute has trained professionals from over 35 industries including healthcare systems, airlines, and government agencies.", noteZh:"Disney Institute 已為超過 35 個產業的專業人士提供訓練，包括醫療體系、航空公司與政府機構。" },
  R4: { companies:["Marriott","Hilton","Lee County CVB","Oregon Tourism"], sectors:["Hospitality","Tourism","Destination Marketing"], regionsEn:"Global (recognized in 100+ countries)", regionsZh:"全球 (100 多國認可)", noteEn:"CGSP is the most widely held hospitality guest service credential worldwide. Properties can earn 'Certified Guest Service Property' status.", noteZh:"CGSP 是全球最廣泛持有的餐旅賓客服務認證。完訓物業可申請「認證賓客服務場所」資格。" },
  G1: { companies:["G4S (now Allied Universal)","Securitas","Garda World","Prosegur"], sectors:["Contract Security","Corporate Security","Critical Infrastructure","Hospitals"], regionsEn:"Global (IFPO recognized in 66+ countries)", regionsZh:"全球 (IFPO 於 66 國以上認可)", noteEn:"Since 1988, the CPO is the most widely held private security certification globally. Many employers require or prefer it.", noteZh:"自 1988 年以來，CPO 是全球最廣泛持有的民間保全認證，許多雇主要求或優先採用。" },
  G3: { companies:["Envoy (used by Slack, Pinterest, Box)","Verkada","HID Global","LenelS2"], sectors:["Tech Campuses","Corporate HQ","Semiconductor Fabs","Data Centers"], regionsEn:"Global", regionsZh:"全球", noteEn:"Visitor management systems are standard at tech campuses and high-security facilities. Training is vendor-specific.", noteZh:"訪客管理系統是科技園區與高安全設施的標準配備，訓練隨廠商系統提供。" },
  G4: { companies:["Marriott","Hilton","IHG","Accor"], sectors:["Hospitality","Commercial Real Estate"], regionsEn:"North America, Caribbean", regionsZh:"北美、加勒比海", noteEn:"Developed with input from the hospitality industry; includes human trafficking awareness module.", noteZh:"由餐旅業共同開發，包含人口販運辨識模組。" },
  G5: { companies:["G4S","Securitas","Mitie","Corps Security"], sectors:["All UK private security"], regionsEn:"United Kingdom (statutory requirement)", regionsZh:"英國 (法定強制)", noteEn:"Legally mandatory for all private security operatives in the UK under the Private Security Industry Act 2001. ~370,000 active licence holders.", noteZh:"依《2001 年民間保全業法》，英國所有民間保全人員的法定強制牌照。約 37 萬名持照人。" },
  G6: { companies:["Allied Universal","Securitas","Deloitte","Marriott","Pratt & Whitney","Coherent Corp"], sectors:["Corporate Security","Defense","Aerospace","Hospitality"], regionsEn:"Global (ASIS has 34,000+ members in 140+ countries)", regionsZh:"全球 (ASIS 在 140 多國擁有 34,000+ 會員)", noteEn:"ASIS APP is the entry-level gateway to the CPP/PSP/PCI credential family. Recognized by U.S. DoD COOL program.", noteZh:"ASIS APP 是 CPP/PSP/PCI 認證家族的入門門檻。獲美國國防部 COOL 計畫認可。" },
  C1: { companies:["Northland Controls","PSA Security Network","Axis Communications"], sectors:["Security Integration","Physical-Cyber Convergence","IoT Security"], regionsEn:"Global", regionsZh:"全球", noteEn:"First-ever cert focused on cybersecurity for physical security systems. Co-developed with PSA Security Network and Security Specifiers.", noteZh:"首個專注於實體安全系統網路安全的認證，由 PSA Security Network 與 Security Specifiers 共同開發。" },
  C2: { companies:["Amazon","Microsoft","Google","CrowdStrike","Mandiant","Dragos"], sectors:["SOC / Cyber Defense","Critical Infrastructure","Cloud Security"], regionsEn:"Global", regionsZh:"全球", noteEn:"GIAC GSOC (via SANS SEC450) is the blue team SOC analyst standard. Note: this is cyber-focused, not physical security-specific.", noteZh:"GIAC GSOC (透過 SANS SEC450) 是藍隊 SOC 分析師標準。注意：偏重網路安全而非實體安全。" },
  C3: { companies:["ADT","Brinks","Stanley Security","Vivint"], sectors:["Alarm Monitoring Centers","Central Stations"], regionsEn:"North America", regionsZh:"北美", noteEn:"TMA Five Diamond is the gold standard for U.S. monitoring centers. Focuses on reducing false dispatches which cost municipalities millions annually.", noteZh:"TMA 五鑽是美國監控中心的黃金標準，專注降低每年造成市政數百萬美元損失的誤派遣。" },
  C4: { companies:["Major U.S. 911/PSAP centers","APCO member agencies"], sectors:["Public Safety Communications","Emergency Dispatch"], regionsEn:"North America, Australasia", regionsZh:"北美、澳紐", noteEn:"APCO RPL is recognized across U.S. public safety answering points (PSAPs) and emergency communications centers.", noteZh:"APCO RPL 在美國公共安全通訊中心 (PSAP) 與緊急通訊中心獲認可。" },
  C5: { companies:["APCO/IAED member agencies","Emergency medical services"], sectors:["Emergency Dispatch","Fire/EMS","Tactical Operations"], regionsEn:"North America, selected global", regionsZh:"北美及部分全球地區", noteEn:"IAED protocols are used in 46 countries for emergency medical and fire dispatch.", noteZh:"IAED 協議在 46 個國家用於緊急醫療與消防調度。" },
  C6: { companies:["Securitas","G4S","Mitie","Local authorities"], sectors:["Public Space Surveillance","Retail","Transport"], regionsEn:"United Kingdom (statutory)", regionsZh:"英國 (法定強制)", noteEn:"UK statutory requirement for monitoring public spaces via CCTV. Among fastest-growing security roles in UK.", noteZh:"英國公共空間 CCTV 監控法定要求，是英國成長最快的安全職位之一。" },
  C7: { companies:["Applied to control centers at: NASA, Airbus, nuclear facilities"], sectors:["Critical Infrastructure","Aviation","Energy","Defense"], regionsEn:"Global (ISO standard)", regionsZh:"全球 (ISO 標準)", noteEn:"ISO 11064 is the international reference for control room ergonomics. Applied in aviation, nuclear, oil & gas, and SOC environments.", noteZh:"ISO 11064 是控制室人因工程的國際標準，應用於航空、核能、油氣及 SOC 環境。" },
  S1: { companies:["All U.S. federal agencies","State/local emergency management","Walmart (emergency response)","Disney Parks"], sectors:["Government","Emergency Management","Corporate Crisis Response","Healthcare"], regionsEn:"Global (U.S. origin, widely adopted internationally)", regionsZh:"全球 (美國發源，廣泛國際採用)", noteEn:"ICS/NIMS is the mandated U.S. federal incident command framework. Adopted by WHO, UN agencies, and many multinational corporations for crisis response.", noteZh:"ICS/NIMS 是美國聯邦強制的事件指揮架構，已被 WHO、聯合國機構及多家跨國企業採用為危機應變框架。" },
  S2: { companies:["Marriott","Allied Universal","Deloitte","Pratt & Whitney","Coherent Corp","Intel","Microsoft"], sectors:["Corporate Security","Defense","Aerospace","Finance","Technology"], regionsEn:"Global (ASIS: 34,000+ members, 140+ countries)", regionsZh:"全球 (ASIS: 34,000+ 會員，140+ 國)", noteEn:"The CPP is the 'gold standard' for security management. ~10,000 holders globally. Required or preferred by most Fortune 500 CSO positions. Recognized by U.S. DoD.", noteZh:"CPP 是安全管理的「黃金標準」，全球約 1 萬持證者。多數 Fortune 500 安全長職位要求或優先採用。獲美國國防部認可。" },
  S3: { companies:["JPMorgan Chase","HSBC","Amazon","Google","Deloitte","PwC"], sectors:["Financial Services","Technology","Consulting","Healthcare","Government"], regionsEn:"Global (DRI: US-focused; BCI: Europe/Asia-focused)", regionsZh:"全球 (DRI: 美國為主; BCI: 歐亞為主)", noteEn:"CBCP is the most widely held business continuity certification. BCI CBCI has 10,000+ members in 100+ countries. Required by many financial regulators.", noteZh:"CBCP 是最廣泛持有的營運持續認證。BCI CBCI 在 100 多國有 1 萬多名會員。許多金融監管機構要求取得。" },
  S4: { companies:["FEMA","State emergency management agencies","Red Cross","WHO"], sectors:["Government","Emergency Management","Public Health","Humanitarian"], regionsEn:"Primarily North America", regionsZh:"主要北美地區", noteEn:"CEM is the premier credential for emergency management professionals. Required for many U.S. state/local emergency management director positions.", noteZh:"CEM 是緊急管理專業人員的頂級認證。許多美國州/地方緊急管理主管職位要求取得。" },
  S5: { companies:["Allied Universal","Securitas","Johnson Controls","Honeywell","Bosch Security"], sectors:["Security Integration","Physical Security Design","Corporate Security"], regionsEn:"Global", regionsZh:"全球", noteEn:"PSP validates expertise in physical security system design and integration. Often paired with CPP for senior security roles.", noteZh:"PSP 驗證實體安全系統設計與整合專業。常與 CPP 搭配作為高階安全職位要求。" },
  S6: { companies:["Big Four accounting firms","Corporate investigation units","Insurance companies"], sectors:["Corporate Investigation","Compliance","Insurance Fraud","Financial Services"], regionsEn:"Global", regionsZh:"全球", noteEn:"PCI is the standard for corporate investigation professionals. Covers fraud, evidence handling, and testimony preparation.", noteZh:"PCI 是企業調查專業人員的標準，涵蓋舞弊調查、證據處理與證詞準備。" },
  S7: { companies:["UK government contractors","Global security consultancies"], sectors:["Strategic Security Consulting","Government Advisory","Risk Management"], regionsEn:"UK, Europe, Commonwealth nations", regionsZh:"英國、歐洲、大英國協國家", noteEn:"UK-centric strategic qualifications. CSyP (Chartered Security Professional) is the highest individual designation from the Security Institute.", noteZh:"以英國為中心的戰略資格。CSyP（特許安全專業人員）是 Security Institute 最高個人資格。" },
  S8: { companies:["Intel","NEC","Apple supply chain","Samsung logistics","DHL","FedEx","UPS","Kuehne+Nagel"], sectors:["Semiconductor","High-Tech Manufacturing","Logistics","Pharmaceutical"], regionsEn:"Global (TAPA: Americas, EMEA, APAC chapters)", regionsZh:"全球 (TAPA: 美洲、EMEA、APAC 分會)", noteEn:"TAPA was co-founded by Intel & NEC in 1997 specifically for semiconductor & high-tech supply chain security. SEMI E187 is mandatory for fab equipment cybersecurity. Directly relevant to TSMC operations.", noteZh:"TAPA 於 1997 年由 Intel 與 NEC 共同創立，專門針對半導體與高科技供應鏈安全。SEMI E187 是晶圓廠設備網安強制標準。與台積電營運直接相關。" },
  S9: { companies:["Dragos","Claroty","Nozomi Networks","Siemens","Schneider Electric","Honeywell"], sectors:["ICS/SCADA Security","Critical Infrastructure","Energy","Manufacturing","Semiconductor"], regionsEn:"Global", regionsZh:"全球", noteEn:"SANS ICS training is the global standard for industrial control system security. GICSP certification holders work at critical infrastructure operators worldwide.", noteZh:"SANS ICS 訓練是工控系統安全的全球標準。GICSP 認證持有者任職於全球關鍵基礎設施營運商。" },
  E01: { companies:["Microsoft","LinkedIn","Fortune 500 HR departments"], sectors:["All Industries","Corporate Training","HR"], regionsEn:"Global (LinkedIn's 1B+ users)", regionsZh:"全球 (LinkedIn 10億+ 用戶)", noteEn:"Auto-displays on LinkedIn profile. Recognized by HR departments using LinkedIn Talent Solutions.", noteZh:"自動顯示於 LinkedIn 個人檔案。使用 LinkedIn Talent Solutions 的 HR 部門認可。" },
  E03: { companies:["EU Commission (promotes it)","Nokia","Reaktor"], sectors:["Government","Education","Tech","All Industries"], regionsEn:"Global (25+ languages, 170+ countries)", regionsZh:"全球 (25+ 語言，170+ 國家)", noteEn:"2M+ graduates globally. Recommended by EU as foundational AI literacy. Co-created with Reaktor.", noteZh:"全球 200 萬+ 畢業生。歐盟推薦為基礎 AI 素養課程。與 Reaktor 共同開發。" },
  E06: { companies:["Google","Amazon","Deloitte","McKinsey (recommends)"], sectors:["Management","Strategy","All Industries"], regionsEn:"Global", regionsZh:"全球", noteEn:"Andrew Ng's course for non-technical leaders. Referenced in McKinsey and HBR AI strategy articles.", noteZh:"吳恩達為非技術領導者設計的課程。被 McKinsey 與 HBR 的 AI 策略文章引用。" },
  I01: { companies:["Enterprise teams globally","Vanderbilt University"], sectors:["All Industries","Corporate Training"], regionsEn:"Global", regionsZh:"全球", noteEn:"Highest-rated prompt engineering course on Coursera (4.98/5). Dr. Jules White.", noteZh:"Coursera 上評分最高的提示工程課程 (4.98/5)。Jules White 博士。" },
  I07: { companies:["Google","Meta","Amazon","Microsoft","Startups globally"], sectors:["Technology","Finance","Healthcare","Research"], regionsEn:"Global (4.8M+ enrolled)", regionsZh:"全球 (480 萬+ 註冊)", noteEn:"The most enrolled ML course in history. Andrew Ng's Stanford-based curriculum used by tech companies for onboarding.", noteZh:"史上註冊人數最多的機器學習課程。吳恩達的 Stanford 課程被科技公司用於新人培訓。" },
  I09: { companies:["Harvard","Top universities globally","Tech companies"], sectors:["Education","Technology","Research"], regionsEn:"Global", regionsZh:"全球", noteEn:"Part of Harvard's CS50 franchise — the most popular intro CS course worldwide.", noteZh:"Harvard CS50 系列的一部分 — 全球最受歡迎的計算機科學入門課程。" },
  A05: { companies:["OpenAI","Google","AWS","Meta","Cohere","Pinecone"], sectors:["AI/ML Engineering","Technology","Research"], regionsEn:"Global", regionsZh:"全球", noteEn:"50+ free short courses co-created with leading AI companies. Fastest way to learn cutting-edge techniques.", noteZh:"50+ 免費短課程，與頂尖 AI 公司共同創建。學習最前沿技術的最快途徑。" },
  A08: { companies:["Hugging Face","Open-source AI community"], sectors:["AI Engineering","Open Source","Research"], regionsEn:"Global", regionsZh:"全球", noteEn:"Covers MCP (Model Context Protocol) — the emerging standard for AI agent tool integration adopted by Anthropic.", noteZh:"涵蓋 MCP（模型上下文協議）— Anthropic 採用的 AI 代理工具整合新興標準。" },
  AA01: { companies:["Anthropic","Enterprise clients globally"], sectors:["All Industries","Corporate Training"], regionsEn:"Global", regionsZh:"全球", noteEn:"Official Anthropic certification. Launched March 2026. Free with LinkedIn-ready certificate. Starting point for all Claude users.", noteZh:"Anthropic 官方認證。2026 年 3 月上線。免費含 LinkedIn 證書。所有 Claude 使用者的起點。" },
  AA02: { companies:["Anthropic","University College Cork","Ringling College"], sectors:["Education","Corporate Training","All Industries"], regionsEn:"Global (Creative Commons licensed)", regionsZh:"全球（Creative Commons 授權）", noteEn:"Co-developed with academic institutions. 4D Framework adopted by universities worldwide. Higher Ed Advisory Board chaired by former Yale president Rick Levin.", noteZh:"與學術機構共同開發。4D 框架已被全球大學採用。高等教育顧問委員會由前耶魯大學校長 Rick Levin 主持。" },
  AA03: { companies:["Anthropic enterprise clients","AWS (Bedrock)","Google Cloud (Vertex AI)"], sectors:["Enterprise IT","Management","Digital Transformation"], regionsEn:"Global", regionsZh:"全球", noteEn:"Designed for managers driving AI adoption. Includes Train-the-Trainer methodology. Claude Code annualized revenue hit $2.5B in 2026.", noteZh:"專為推動 AI 導入的管理者設計。含培訓師培訓方法論。Claude Code 2026 年年化營收達 25 億美元。" },
  AA05: { companies:["Anthropic","MCP ecosystem adopters"], sectors:["AI Engineering","Platform Development","Automation"], regionsEn:"Global", regionsZh:"全球", noteEn:"MCP is Anthropic's open standard for AI-tool integration. Rapidly adopted across the AI developer ecosystem since late 2024.", noteZh:"MCP 是 Anthropic 的 AI 工具整合開放標準。自 2024 年底以來在 AI 開發者生態系統中迅速被採用。" },
};

const CAT_META = {
  reception: { zh:"大小廳接待人員", en:"Reception & Concierge", icon: Users, color:"#0891B2", pathLabel:{ zh:"接待人員建議路徑", en:"Reception Learning Path" } },
  guard:     { zh:"警勤保全", en:"Security Officers", icon: Shield, color:"#059669", pathLabel:{ zh:"保全人員建議路徑", en:"Guard Learning Path" } },
  control:   { zh:"中控室與監控中心", en:"Control Room / SOC", icon: Monitor, color:"#7C3AED", pathLabel:{ zh:"中控人員建議路徑", en:"Control Room Path" } },
  strategic: { zh:"跨單位整合與戰略", en:"Strategic & Command", icon: Layers, color:"#DC2626", pathLabel:{ zh:"戰略指揮建議路徑", en:"Strategic Command Path" } },
  aidx:      { zh:"AI & 數位轉型", en:"AI & Digital Transformation", icon: Zap, color:"#F59E0B", pathLabel:{ zh:"AI 先鋒學院路徑", en:"AI Pioneer Academy Path" } },
};
const TIER_META = { entry:{ zh:"入門", en:"Entry", color:"#10B981" }, mid:{ zh:"中階", en:"Mid", color:"#F59E0B" }, advanced:{ zh:"高階", en:"Adv", color:"#EF4444" } };
const PRIORITY_META = {
  mandatory:   { zh:"法遵強制", en:"Mandatory", color:"#DC2626", icon: AlertTriangle },
  baseline:    { zh:"基線必備", en:"Baseline", color:"#F59E0B", icon: CheckCircle2 },
  recommended: { zh:"建議取得", en:"Recommended", color:"#0891B2", icon: Star },
  elective:    { zh:"選修加值", en:"Elective", color:"#64748B", icon: Zap },
};
const VERIFY_META = {
  verified:     { zh:"已驗證", en:"Verified", color:"#10B981", icon: CheckCircle },
  partial:      { zh:"部分驗證", en:"Partial", color:"#F59E0B", icon: AlertCircle },
  unverifiable: { zh:"待確認", en:"Unverifiable", color:"#EF4444", icon: HelpCircle },
};
const COST_RANGES = [
  { key:"free", zh:"免費/依專案", en:"Free/Project", test:v=>v===0 },
  { key:"low",  zh:"< $500",     en:"< $500",       test:v=>v>0&&v<500 },
  { key:"mid",  zh:"$500–$2k",   en:"$500–$2k",     test:v=>v>=500&&v<=2000 },
  { key:"high", zh:"> $2,000",   en:"> $2,000",     test:v=>v>2000 },
];

/* ════════════════════════════════════════════════
   ROLES: GPS positions × AI maturity cross-paths
   Each role has a curated cross-track learning path
   ════════════════════════════════════════════════ */
const ROLES = [
  { id:"coordinator", icon:Users, color:"#059669",
    zh:"管理師（詢問台/警勤/保全）", en:"Coordinator (Reception / Guard / Security)",
    descZh:"管理前線服務與安全人員，涵蓋詢問台接待、警勤巡邏與保全勤務，是最大宗的第一線角色。", descEn:"Manage frontline service & security staff — reception desk, guard patrol & security operations. The largest frontline role group.",
    courses:["R4","G3","R1","R2","G1","G4","R3","S1","AA01","AA02","E08","E01","E06"],
    phaseLabels:{ zh:["服務與門禁必修","衝突降級與專業","跨域共通語言","AI 素養與入門"], en:["Service & Access Basics","De-escalation & Professional","Cross-domain Language","AI Fluency & Entry"] },
    phases:[ ["R4","G3","R1"], ["R2","G1","G4"], ["R3","S1"], ["AA01","AA02","E08","E01","E06"] ],
  },
  { id:"engineer_cc", icon:Monitor, color:"#7C3AED",
    zh:"工程師（中控）", en:"Engineer (Control Center)",
    descZh:"中控室值勤與系統維運，負責監控、警報處理、調度協調。年資從新進到資深不等，技術深度隨經驗成長。", descEn:"Control center duty & system operations — monitoring, alarm handling, dispatch coordination. Seniority ranges from junior to senior; technical depth grows with experience.",
    courses:["C6","C7","C1","C3","C5","S1","G5","AA01","E01","E05","I08","I01","AA04"],
    phaseLabels:{ zh:["操作與人因基礎","監控與網安融合","應變與調度","AI 應用與 Claude 開發"], en:["Operations & Ergonomics","Monitoring & Cyber-Physical","Response & Dispatch","AI Application & Claude Dev"] },
    phases:[ ["C6","C7"], ["C1","C3","C5"], ["S1","G5"], ["AA01","E01","E05","I08","I01","AA04"] ],
  },
  { id:"engineer_sp", icon:Wrench, color:"#0891B2",
    zh:"安全防護工程師", en:"Security Protection Engineer",
    descZh:"實體周邊安全系統的設計、安裝、調試與技術支援 — 涵蓋圍欄入侵探測、地震傳感器、防盜報警、門禁與監控系統。類似 DEA Security (義大利) 的現場工程師角色，需撰寫安全規範與技術文件。", descEn:"Design, install, commission & support physical perimeter security systems — fence intrusion detection, seismic sensors, burglar alarms, access control & surveillance. Similar to DEA Security (Italy) field engineer role. Authors security specs & technical documentation.",
    courses:["S5","C1","C7","C3","S8","S9","S1","S2","AA01","E05","I02","I08","AA04","AA05","AA06","A05","A08"],
    phaseLabels:{ zh:["防護系統設計與建置","網安融合與標準","風險評估與合規","AI 核心：提示工程與文件自動化","AI 選修進階：限有開發背景者"], en:["Protection System Design","Cyber-Physical & Standards","Risk Assessment & Compliance","AI Core: Prompt Eng & Doc Automation","AI Elective Advanced: Dev Background Req'd"] },
    phases:[ ["S5","C1","C7","C3"], ["S8","S9"], ["S1","S2"], ["AA01","E05","I02","I08"], ["AA04","AA05","AA06","A05","A08"] ],
  },
  { id:"manager", icon:Star, color:"#F59E0B",
    zh:"理級主管", en:"Section Manager",
    descZh:"帶領前線、中控或工程團隊，負責排班管理、事件升級、績效考核與訓練督導。是處長與第一線之間的關鍵樞紐。", descEn:"Lead frontline, control center or engineering teams. Responsible for shift management, incident escalation, performance review & training supervision. Key hub between division head and frontline.",
    courses:["G1","G3","C3","C4","R1","R3","S1","S2","G6","S3","AA01","AA02","AA03","E01","E06","I01","I04"],
    phaseLabels:{ zh:["團隊管理基礎","品質治理與調度","戰略認知與持續營運","AI 領導力與組織導入"], en:["Team Mgmt Basics","Quality Governance & Dispatch","Strategic & Business Continuity","AI Leadership & Org Adoption"] },
    phases:[ ["G1","G3","R1"], ["C3","C4","R3"], ["S1","S2","G6","S3"], ["AA01","AA02","AA03","E01","E06","I01","I04"] ],
  },
  { id:"secretary", icon:BookOpen, color:"#FB7185",
    zh:"處長秘書 / 行政", en:"Executive Secretary / Admin",
    descZh:"支援處長日常行政、會議管理、文件處理、跨單位溝通協調。是資訊流轉的關鍵節點，需具備基礎安全意識與高效 AI 工具應用能力。", descEn:"Support division head with admin, meeting management, document handling & cross-unit coordination. Key node for information flow; needs basic security awareness and efficient AI tool proficiency.",
    courses:["R4","S1","R1","AA01","AA02","E01","E05","E06","E03","I01","I04"],
    phaseLabels:{ zh:["安全意識基礎","溝通與應變語言","AI 素養與生產力","AI 進階應用"], en:["Security Awareness","Communication & Response","AI Fluency & Productivity","Advanced AI Application"] },
    phases:[ ["R4","R1"], ["S1"], ["AA01","AA02","E01","E05","E06","E03"], ["I01","I04"] ],
  },
  { id:"director", icon:Layers, color:"#DC2626",
    zh:"處長 / 副處長", en:"Division Head / Deputy",
    descZh:"部門戰略規劃、跨單位協調、預算資源配置、組織轉型與人才發展。唯一需要全域視野的角色。", descEn:"Division strategy, cross-unit coordination, budget allocation, organizational transformation & talent development. The only role requiring full-spectrum visibility.",
    courses:["S2","S3","S4","S8","S7","S1","S6","AA02","AA03","E06","E03","E07"],
    phaseLabels:{ zh:["戰略認證","營運持續與調查","產業合規與標準","AI 轉型視野與組織導入"], en:["Strategic Certs","Continuity & Investigation","Industry Compliance","AI Vision & Org Adoption"] },
    phases:[ ["S2","S3","S4"], ["S7","S6"], ["S8","S1"], ["AA02","AA03","E06","E03","E07"] ],
  },
];

export default function App() {
  const [lang, setLang] = useState("zh");
  const [theme, setTheme] = useState("dark");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState([]);
  const [tierFilter, setTierFilter] = useState([]);
  const [costFilter, setCostFilter] = useState([]);
  const [prioFilter, setPrioFilter] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState("cards");
  const [activeRole, setActiveRole] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => { const h = () => setIsMobile(window.innerWidth < 768); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  const t = useCallback((en, zh) => lang === "zh" ? zh : en, [lang]);

  const themes = {
    dark: { "--bg":"#060B14","--surface":"#0D1520","--surface-2":"#162032","--surface-3":"#1C2940","--text-1":"#E8EDF4","--text-2":"#8A9BB5","--text-3":"#5A6B82","--accent":"#0EA5E9","--accent-muted":"rgba(14,165,233,0.10)","--border":"rgba(255,255,255,0.06)","--shadow":"rgba(0,0,0,0.5)","--badge-bg":"rgba(255,255,255,0.05)","--input-bg":"#162032","--input-border":"rgba(255,255,255,0.08)","--red-muted":"rgba(220,38,38,0.10)","--amber-muted":"rgba(245,158,11,0.10)" },
    light: { "--bg":"#F1F5F9","--surface":"#FFFFFF","--surface-2":"#F8FAFC","--surface-3":"#EFF3F8","--text-1":"#0F172A","--text-2":"#475569","--text-3":"#94A3B8","--accent":"#0284C7","--accent-muted":"rgba(2,132,199,0.07)","--border":"#E2E8F0","--shadow":"rgba(0,0,0,0.05)","--badge-bg":"#F1F5F9","--input-bg":"#FFFFFF","--input-border":"#CBD5E1","--red-muted":"rgba(220,38,38,0.06)","--amber-muted":"rgba(245,158,11,0.06)" }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const roleObj = ROLES.find(r=>r.id===activeRole);
    return ALL_DATA.filter(item => {
      if (roleObj && !roleObj.courses.includes(item.id)) return false;
      if (catFilter.length && !catFilter.includes(item.cat)) return false;
      if (tierFilter.length && !tierFilter.includes(item.tier)) return false;
      if (prioFilter.length && !prioFilter.includes(item.priority)) return false;
      if (costFilter.length && !costFilter.some(k => COST_RANGES.find(r => r.key === k)?.test(item.costVal))) return false;
      if (q) { return [item.cert,item.certFull,item.org,item.focus,item.focusEn,item.prereq,item.prereqEn,item.cost,item.complianceTag||""].join(" ").toLowerCase().includes(q); }
      return true;
    });
  }, [search, catFilter, tierFilter, costFilter, prioFilter, activeRole]);

  const activeFilterCount = catFilter.length + tierFilter.length + costFilter.length + prioFilter.length;
  const toggle = (arr, set, val) => set(p => p.includes(val) ? p.filter(v => v !== val) : [...p, val]);
  const clearAll = () => { setCatFilter([]); setTierFilter([]); setCostFilter([]); setPrioFilter([]); setSearch(""); setActiveRole(null); };

  const stats = useMemo(() => {
    const byCat = {}; Object.keys(CAT_META).forEach(k => { byCat[k] = { total:0, mandatory:0, baseline:0, estimated:0 }; });
    ALL_DATA.forEach(d => { byCat[d.cat].total++; if(d.priority==="mandatory") byCat[d.cat].mandatory++; if(d.priority==="baseline") byCat[d.cat].baseline++; byCat[d.cat].estimated+=d.costVal; });
    return { byCat, totalMandatory:ALL_DATA.filter(d=>d.priority==="mandatory").length, totalBaseline:ALL_DATA.filter(d=>d.priority==="baseline").length, semiItems:ALL_DATA.filter(d=>d.complianceTag==="semiconductor"), verified:ALL_DATA.filter(d=>d.verified==="verified").length, partial:ALL_DATA.filter(d=>d.verified==="partial").length, unverifiable:ALL_DATA.filter(d=>d.verified==="unverifiable").length };
  }, []);

  const Chip = ({ active, label, onClick, color }) => (<button onClick={onClick} style={{ padding:"4px 10px",borderRadius:14,fontSize:11,fontWeight:500,cursor:"pointer",border:active?`1.5px solid ${color||"var(--accent)"}`:"1px solid var(--border)",background:active?`${color||"var(--accent)"}14`:"transparent",color:active?(color||"var(--accent)"):"var(--text-3)",transition:"all 0.12s" }}>{label}</button>);
  const Badge = ({ children, color, small }) => (<span style={{ display:"inline-flex",alignItems:"center",gap:3,padding:small?"2px 6px":"3px 8px",borderRadius:10,fontSize:small?10:11,fontWeight:600,background:`${color}16`,color,border:`1px solid ${color}28` }}>{children}</span>);
  // StatCard defined as standalone function at bottom of file

  const pathCats = catFilter.length ? catFilter : Object.keys(CAT_META);

  return (
    <div style={{ ...themes[theme], fontFamily:"'Noto Sans TC','DM Sans',system-ui,sans-serif", background:"var(--bg)", color:"var(--text-1)", minHeight:"100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", padding:isMobile?"14px 16px":"18px 24px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap" }}>
          <div style={{ flex:1,minWidth:200 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}><div style={{ width:5,height:22,borderRadius:3,background:"var(--accent)" }}/><h1 style={{ fontSize:isMobile?16:20,fontWeight:700,margin:0 }}>{t("Security Training Explorer","企業安全防護訓練檢索")}</h1></div>
            <p style={{ fontSize:11,color:"var(--text-3)",margin:"4px 0 0 13px" }}>GSM / GPS · {t(`${ALL_DATA.length} items · 5 tracks incl. AI Pioneer Academy · Fact-checked`,`${ALL_DATA.length} 項 · 5 大軌道含 AI 先鋒學院 · 已查核`)} · <span style={{color:"#10B981"}}>{stats.verified} {t("verified","已驗證")}</span> · <span style={{color:"#F59E0B"}}>{stats.partial} {t("partial","部分")}</span> · <span style={{color:"#EF4444"}}>{stats.unverifiable} {t("unverifiable","待確認")}</span></p>
          </div>
          <div style={{ display:"flex",gap:4 }}>
            <button onClick={() => setLang(l => l==="zh"?"en":"zh")} style={{ display:"flex",alignItems:"center",gap:3,padding:"5px 9px",borderRadius:6,border:"1px solid var(--border)",background:"var(--surface-2)",color:"var(--text-2)",cursor:"pointer",fontSize:11,fontWeight:500 }}><Globe size={12}/>{lang==="zh"?"EN":"中"}</button>
            <button onClick={() => setTheme(t => t==="dark"?"light":"dark")} style={{ display:"flex",alignItems:"center",padding:"5px 8px",borderRadius:6,border:"1px solid var(--border)",background:"var(--surface-2)",color:"var(--text-2)",cursor:"pointer" }}>{theme==="dark"?<Sun size={12}/>:<Moon size={12}/>}</button>
          </div>
        </div>

        {/* View tabs */}
        <div style={{ display:"flex",gap:2,marginTop:12,background:"var(--surface-2)",borderRadius:7,padding:2,width:"fit-content" }}>
          {[{k:"cards",zh:"認證檢索",en:"Certs",icon:Search},{k:"roles",zh:"角色路徑",en:"Role Paths",icon:UserCircle},{k:"benchmark",zh:"業界採用",en:"Benchmark",icon:Building2},{k:"dashboard",zh:"預算總覽",en:"Budget",icon:BarChart3},{k:"path",zh:"軌道總覽",en:"Tracks",icon:TrendingUp}].map(v => {const VI=v.icon;return(<button key={v.k} onClick={()=>setView(v.k)} style={{ display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:5,border:"none",cursor:"pointer",fontSize:11,fontWeight:view===v.k?600:400,background:view===v.k?"var(--accent)":"transparent",color:view===v.k?"#fff":"var(--text-3)" }}><VI size={12}/>{t(v.en,v.zh)}</button>)})}
        </div>

        {/* Role Quick Lane */}
        {(view==="cards"||view==="roles")&&<div style={{marginTop:10}}>
          <div style={{fontSize:10,fontWeight:600,color:"var(--text-3)",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em",display:"flex",alignItems:"center",gap:4}}><UserCircle size={11}/>{t("Quick Lane: I am a...","快速通道：我的職位是...")}</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {ROLES.map(r=>{const RI=r.icon;const isActive=activeRole===r.id;return(
              <button key={r.id} onClick={()=>{setActiveRole(isActive?null:r.id);if(!isActive&&view==="cards"){}}} style={{
                display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:8,cursor:"pointer",
                border:isActive?`1.5px solid ${r.color}`:"1px solid var(--border)",
                background:isActive?`${r.color}12`:"var(--surface)",
                color:isActive?r.color:"var(--text-2)",fontSize:11,fontWeight:isActive?600:400,transition:"all 0.12s",
              }}><RI size={13}/>{t(r.en,r.zh)}<span style={{fontSize:9,color:"var(--text-3)"}}>{r.courses.length}</span></button>
            )})}
            {activeRole&&<button onClick={()=>setActiveRole(null)} style={{padding:"6px 10px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",color:"var(--text-3)",fontSize:11,cursor:"pointer"}}><X size={11}/></button>}
          </div>
          {activeRole&&<div style={{fontSize:11,color:ROLES.find(r=>r.id===activeRole)?.color,marginTop:4,lineHeight:1.5}}>
            {t(ROLES.find(r=>r.id===activeRole)?.descEn,ROLES.find(r=>r.id===activeRole)?.descZh)} · {ROLES.find(r=>r.id===activeRole)?.courses.length} {t("recommended items","項推薦")}
          </div>}
        </div>}

        {/* Search + Filters */}
        {view==="cards"&&<>
          <div style={{ display:"flex",gap:6,marginTop:10 }}>
            <div style={{ flex:1,display:"flex",alignItems:"center",gap:6,background:"var(--input-bg)",border:"1px solid var(--input-border)",borderRadius:7,padding:"6px 10px" }}>
              <Search size={14} style={{color:"var(--text-3)",flexShrink:0}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("Search…","搜尋…")} style={{ flex:1,border:"none",outline:"none",background:"transparent",color:"var(--text-1)",fontSize:12,fontFamily:"inherit" }}/>
              {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-3)",display:"flex"}}><X size={12}/></button>}
            </div>
            <button onClick={()=>setShowFilters(f=>!f)} style={{ display:"flex",alignItems:"center",gap:3,padding:"6px 10px",borderRadius:7,border:showFilters?"1.5px solid var(--accent)":"1px solid var(--input-border)",background:showFilters?"var(--accent-muted)":"var(--input-bg)",color:showFilters?"var(--accent)":"var(--text-2)",cursor:"pointer",fontSize:11,fontWeight:500,position:"relative" }}><Filter size={12}/>{t("Filter","篩選")}{activeFilterCount>0&&<span style={{position:"absolute",top:-4,right:-4,width:15,height:15,borderRadius:8,background:"var(--accent)",color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{activeFilterCount}</span>}</button>
          </div>
          {showFilters&&(
            <div style={{ marginTop:8,padding:12,borderRadius:7,border:"1px solid var(--border)",background:"var(--surface-2)" }}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,fontWeight:600,color:"var(--text-2)"}}>{t("Filters","篩選")}</span>{activeFilterCount>0&&<button onClick={clearAll} style={{fontSize:10,color:"var(--accent)",background:"none",border:"none",cursor:"pointer"}}>{t("Clear","清除")}</button>}</div>
              <FR label={t("Priority","優先序")}>{Object.entries(PRIORITY_META).map(([k,v])=><Chip key={k} active={prioFilter.includes(k)} color={v.color} label={t(v.en,v.zh)} onClick={()=>toggle(prioFilter,setPrioFilter,k)}/>)}</FR>
              <FR label={t("Role","角色")}>{Object.entries(CAT_META).map(([k,v])=><Chip key={k} active={catFilter.includes(k)} color={v.color} label={t(v.en,v.zh)} onClick={()=>toggle(catFilter,setCatFilter,k)}/>)}</FR>
              <FR label={t("Level","層級")}>{Object.entries(TIER_META).map(([k,v])=><Chip key={k} active={tierFilter.includes(k)} color={v.color} label={t(v.en,v.zh)} onClick={()=>toggle(tierFilter,setTierFilter,k)}/>)}</FR>
              <FR label={t("Cost","費用")} last>{COST_RANGES.map(r=><Chip key={r.key} active={costFilter.includes(r.key)} label={t(r.en,r.zh)} onClick={()=>toggle(costFilter,setCostFilter,r.key)}/>)}</FR>
            </div>
          )}
        </>}
      </div>

      <div style={{ padding:isMobile?"10px 16px 16px":"14px 24px 24px" }}>

        {/* Role Paths */}
        {view==="roles"&&<div>
          {!activeRole && <div style={{textAlign:"center",padding:isMobile?24:40}}>
            <UserCircle size={36} style={{margin:"0 auto 12px",color:"var(--text-3)",opacity:0.4}}/>
            <div style={{fontSize:15,fontWeight:600,marginBottom:6}}>{t("Select a role above to see your personalized cross-track learning path","請在上方選擇你的職位，查看跨軌道個人化學習路徑")}</div>
            <div style={{fontSize:12,color:"var(--text-3)",lineHeight:1.6,maxWidth:500,margin:"0 auto"}}>{t("Each role maps a recommended progression across security certifications AND AI courses — designed for IDP discussions with your supervisor.","每個角色都映射一條跨越安全認證與 AI 課程的推薦進程 — 專為與主管的 IDP（個人發展計畫）討論設計。")}</div>
          </div>}
          {activeRole && (()=>{
            const role = ROLES.find(r=>r.id===activeRole);
            const RI = role.icon;
            return (
              <div>
                <div style={{background:"var(--surface)",borderRadius:10,border:`1.5px solid ${role.color}30`,padding:isMobile?14:18,marginBottom:14,display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:44,height:44,borderRadius:10,background:`${role.color}14`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><RI size={22} style={{color:role.color}}/></div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:17,fontWeight:700,color:role.color}}>{t(role.en,role.zh)}</div>
                    <div style={{fontSize:12,color:"var(--text-2)",lineHeight:1.5,marginTop:2}}>{t(role.descEn,role.descZh)}</div>
                    <div style={{fontSize:11,color:"var(--text-3)",marginTop:3}}>{role.courses.length} {t("items across","項，跨越")} {new Set(role.courses.map(id=>ALL_DATA.find(d=>d.id===id)?.cat).filter(Boolean)).size} {t("tracks","個軌道")}</div>
                  </div>
                </div>
                {role.phases.map((phase, pi) => {
                  const items = phase.map(id=>ALL_DATA.find(d=>d.id===id)).filter(Boolean);
                  const phaseLabel = t(role.phaseLabels.en[pi], role.phaseLabels.zh[pi]);
                  return (
                    <div key={pi} style={{marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                        <div style={{width:26,height:26,borderRadius:13,background:`${role.color}18`,border:`2px solid ${role.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:role.color,flexShrink:0}}>{pi+1}</div>
                        <div style={{fontSize:13,fontWeight:700,color:role.color}}>{phaseLabel}</div>
                        <div style={{flex:1,height:1,background:"var(--border)"}}/>
                        <div style={{fontSize:10,color:"var(--text-3)"}}>{items.length} {t("items","項")}</div>
                      </div>
                      <div style={{marginLeft:13,borderLeft:`2px solid ${pi<role.phases.length-1?"var(--border)":"transparent"}`,paddingLeft:20,paddingBottom:pi<role.phases.length-1?8:0}}>
                        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:6}}>
                          {items.map(item=>{
                            const catM=CAT_META[item.cat];const CI=catM.icon;const tM=TIER_META[item.tier];
                            return(
                              <div key={item.id} style={{background:"var(--surface)",borderRadius:8,border:"1px solid var(--border)",padding:12,display:"flex",gap:10,alignItems:"flex-start"}}>
                                <div style={{width:26,height:26,borderRadius:6,background:`${catM.color}12`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><CI size={13} style={{color:catM.color}}/></div>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                                    <span style={{fontSize:12,fontWeight:600}}>{item.cert}</span>
                                    <Badge color={catM.color} small>{t(catM.en.split("/")[0].trim().split(" ")[0],catM.zh.substring(0,3))}</Badge>
                                    <Badge color={tM.color} small>{t(tM.en,tM.zh)}</Badge>
                                  </div>
                                  <div style={{fontSize:10,color:"var(--text-2)",marginTop:2,lineHeight:1.5}}>{item.org} · {item.cost}</div>
                                  {item.url&&item.url!=="#"&&<a href={item.url} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:"var(--accent)",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:2,marginTop:3}}><ExternalLink size={9}/>{t("Official","官方")}</a>}
                                  {item.scopeNote&&<div style={{fontSize:9,color:"#F59E0B",marginTop:3,lineHeight:1.4}}>{t(item.scopeNoteEn,item.scopeNote)}</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div style={{background:"var(--surface)",borderRadius:8,border:"1px solid var(--border)",padding:14,marginTop:8}}>
                  <div style={{fontSize:11,fontWeight:600,color:"var(--text-3)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em"}}>{t("Path Summary","路徑摘要")}</div>
                  <div style={{display:"flex",gap:12,flexWrap:"wrap",fontSize:12}}>
                    <span><strong style={{color:"var(--accent)"}}>{role.courses.length}</strong> {t("total items","項總計")}</span>
                    <span><strong style={{color:"#10B981"}}>{role.courses.filter(id=>{const d=ALL_DATA.find(x=>x.id===id);return d?.costVal===0}).length}</strong> {t("free","免費")}</span>
                    <span><strong style={{color:"#F59E0B"}}>${role.courses.reduce((s,id)=>{const d=ALL_DATA.find(x=>x.id===id);return s+(d?.costVal||0)},0).toLocaleString()}</strong> {t("est. total","預估總費用")}</span>
                    {(()=>{const tracks=new Set(role.courses.map(id=>ALL_DATA.find(d=>d.id===id)?.cat).filter(Boolean));return <span><strong style={{color:role.color}}>{tracks.size}</strong> {t("tracks","軌道")}</span>})()}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>}

        {/* Benchmark */}
        {view==="benchmark"&&<div>
          <p style={{fontSize:12,color:"var(--text-2)",marginBottom:14,lineHeight:1.6}}>{t("Industry adoption and recognition benchmarks for each certification. Data compiled from official sources, job postings, and industry reports.","各認證的業界採用與認可基準。資料彙編自官方來源、職缺公告與產業報告。")}</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ALL_DATA.filter(d=>BENCHMARK[d.id]).map(item=>{const b=BENCHMARK[item.id];const catM=CAT_META[item.cat];const CI=catM.icon;return(
              <div key={item.id} style={{background:"var(--surface)",borderRadius:9,border:"1px solid var(--border)",overflow:"hidden"}}>
                <div style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid var(--border)"}}>
                  <div style={{width:28,height:28,borderRadius:6,background:`${catM.color}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><CI size={14} style={{color:catM.color}}/></div>
                  <div style={{flex:1}}><span style={{fontSize:13,fontWeight:600}}>{item.cert}</span><span style={{fontSize:11,color:"var(--text-3)",marginLeft:8}}>{item.org}</span></div>
                </div>
                <div style={{padding:14,display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:10}}>
                  <div style={{padding:10,borderRadius:6,background:"var(--surface-2)",border:"1px solid var(--border)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6,fontSize:10,fontWeight:600,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.04em"}}><Building2 size={11}/>{t("Recognized By","採用企業")}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{b.companies.map((c,i)=><span key={i} style={{fontSize:11,padding:"3px 8px",borderRadius:5,background:"var(--badge-bg)",color:"var(--text-1)",fontWeight:500,border:"1px solid var(--border)"}}>{c}</span>)}</div>
                  </div>
                  <div style={{padding:10,borderRadius:6,background:"var(--surface-2)",border:"1px solid var(--border)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6,fontSize:10,fontWeight:600,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.04em"}}><Layers size={11}/>{t("Sectors","適用產業")}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{b.sectors.map((s,i)=><span key={i} style={{fontSize:11,padding:"3px 8px",borderRadius:5,background:`${catM.color}10`,color:catM.color,fontWeight:500,border:`1px solid ${catM.color}20`}}>{s}</span>)}</div>
                  </div>
                  <div style={{gridColumn:isMobile?"1":"1/3",padding:10,borderRadius:6,background:"var(--surface-2)",border:"1px solid var(--border)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6,fontSize:10,fontWeight:600,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.04em"}}><Globe size={11}/>{t("Coverage","覆蓋範圍")}: <span style={{color:"var(--text-2)",textTransform:"none"}}>{t(b.regionsEn,b.regionsZh)}</span></div>
                    <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{t(b.noteEn,b.noteZh)}</div>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>}

        {/* Dashboard */}
        {view==="dashboard"&&<div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
            <StatCard label={t("Total","總數")} value={stats.totalMandatory+stats.totalBaseline+ALL_DATA.filter(d=>d.priority==="recommended"||d.priority==="elective").length} color="var(--accent)" icon={Award}/>
            <StatCard label={t("Mandatory","強制")} value={stats.totalMandatory} color="#DC2626" icon={AlertTriangle}/>
            <StatCard label={t("Verified","已驗證")} value={stats.verified} sub={`/ ${ALL_DATA.length}`} color="#10B981" icon={CheckCircle}/>
          </div>
          <h3 style={{fontSize:13,fontWeight:600,color:"var(--text-2)",marginBottom:10}}>{t("Budget by Track","各軌道預估")}</h3>
          {Object.entries(stats.byCat).map(([k,v])=>{const m=CAT_META[k];const CI=m.icon;const mx=Math.max(...Object.values(stats.byCat).map(x=>x.estimated));return(
            <div key={k} style={{background:"var(--surface)",borderRadius:8,border:"1px solid var(--border)",padding:14,marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:6}}><CI size={14} style={{color:m.color}}/><span style={{fontSize:13,fontWeight:600}}>{t(m.en,m.zh)}</span><Badge color={m.color} small>{v.total}</Badge></div><div style={{fontSize:16,fontWeight:700,color:m.color}}>${v.estimated.toLocaleString()}</div></div>
              <div style={{height:5,borderRadius:3,background:"var(--surface-3)",overflow:"hidden"}}><div style={{width:`${mx>0?v.estimated/mx*100:0}%`,height:"100%",borderRadius:3,background:m.color,transition:"width 0.3s"}}/></div>
            </div>
          )})}
          <div style={{marginTop:14,padding:12,borderRadius:7,background:"var(--amber-muted)",border:"1px solid rgba(245,158,11,0.12)"}}>
            <p style={{fontSize:11,color:"var(--text-2)",margin:0,lineHeight:1.6}}><strong style={{color:"#F59E0B"}}>{t("Note","備註")}:</strong> {t("Per-person list prices. Bulk/enterprise pricing, travel & opportunity costs excluded. Verify with each issuing body.","單人定價估算，不含團體優惠、差旅及機會成本。採購前請向各發證機構確認。")}</p>
          </div>
        </div>}

        {/* Path */}
        {view==="path"&&<div style={{display:"flex",flexDirection:"column",gap:16}}>{pathCats.map(ck=>{const m=CAT_META[ck];const CI=m.icon;const items=ALL_DATA.filter(d=>d.cat===ck).sort((a,b)=>a.pathOrder-b.pathOrder);return(
          <div key={ck} style={{background:"var(--surface)",borderRadius:9,border:"1px solid var(--border)",overflow:"hidden"}}>
            <div style={{padding:"12px 16px",background:`${m.color}0A`,borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:7}}><CI size={15} style={{color:m.color}}/><span style={{fontSize:14,fontWeight:700,color:m.color}}>{t(m.pathLabel.en,m.pathLabel.zh)}</span></div>
            <div style={{padding:16}}>{items.map((item,idx)=>{const pM=PRIORITY_META[item.priority];const tM=TIER_META[item.tier];const vM=VERIFY_META[item.verified];const PI=pM.icon;return(
              <div key={item.id} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:22,flexShrink:0}}>
                  <div style={{width:20,height:20,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:`${pM.color}18`,border:`2px solid ${pM.color}`,fontSize:9,fontWeight:700,color:pM.color}}>{idx+1}</div>
                  {idx<items.length-1&&<div style={{width:2,flex:1,minHeight:36,background:"var(--border)"}}/>}
                </div>
                <div style={{flex:1,paddingBottom:idx<items.length-1?12:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                    <span style={{fontSize:13,fontWeight:600}}>{item.cert}</span>
                    <Badge color={pM.color} small><PI size={8}/> {t(pM.en,pM.zh)}</Badge>
                    <Badge color={tM.color} small>{t(tM.en,tM.zh)}</Badge>
                    <Badge color={vM.color} small>{t(vM.en,vM.zh)}</Badge>
                  </div>
                  <p style={{fontSize:11,color:"var(--text-2)",margin:"3px 0 0",lineHeight:1.5}}>{t(item.focusEn,item.focus)}</p>
                  <div style={{fontSize:10,color:"var(--text-3)",marginTop:3,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>{item.org} · {item.cost}{item.url&&item.url!=="#"&&<a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{color:"var(--accent)",display:"inline-flex",alignItems:"center",gap:2,textDecoration:"none"}}><ExternalLink size={10}/>{t("Official","官方")}</a>}</div>
                </div>
              </div>
            )})}</div>
          </div>
        )})}</div>}

        {/* Cards */}
        {view==="cards"&&<>
          <div style={{color:"var(--text-3)",fontSize:11,marginBottom:8}}>{t(`${filtered.length}/${ALL_DATA.length}`,`${ALL_DATA.length} 中顯示 ${filtered.length}`)}{activeFilterCount>0&&<span style={{color:"var(--accent)",marginLeft:4}}>({activeFilterCount} {t("active","啟用")})</span>}</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {filtered.length===0&&<div style={{textAlign:"center",padding:36,color:"var(--text-3)"}}><Search size={26} style={{margin:"0 auto 8px",opacity:0.3}}/><div style={{fontSize:13}}>{t("No results","無結果")}</div></div>}
            {filtered.map(item=>{
              const catM=CAT_META[item.cat];const tierM=TIER_META[item.tier];const prioM=PRIORITY_META[item.priority];const vM=VERIFY_META[item.verified];const isExp=expanded===item.id;const CI=catM.icon;const PI=prioM.icon;const VI=vM.icon;
              return(
                <div key={item.id} onClick={()=>setExpanded(isExp?null:item.id)} style={{background:"var(--surface)",borderRadius:8,border:isExp?`1.5px solid ${catM.color}40`:"1px solid var(--border)",cursor:"pointer",transition:"all 0.12s"}}>
                  <div style={{padding:isMobile?"10px 12px":"12px 16px",display:"flex",alignItems:"flex-start",gap:10}}>
                    <div style={{width:30,height:30,borderRadius:6,flexShrink:0,background:`${catM.color}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><CI size={15} style={{color:catM.color}}/></div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,fontWeight:600}}>{item.cert}</span>
                        <Badge color={prioM.color} small><PI size={8}/> {t(prioM.en,prioM.zh)}</Badge>
                        <Badge color={tierM.color} small>{t(tierM.en,tierM.zh)}</Badge>
                        <Badge color={vM.color} small><VI size={8}/></Badge>
                        {item.complianceTag==="semiconductor"&&<Badge color="#7C3AED" small>SEMI</Badge>}
                        {item.complianceTag==="UK-regulatory"&&<Badge color="#DC2626" small>UK</Badge>}
                      </div>
                      <div style={{fontSize:11,color:"var(--text-2)",marginTop:3}}>{t(item.focusEn,item.certFull)} · <span style={{color:catM.color,fontWeight:500}}>{item.org}</span></div>
                    </div>
                    <div style={{flexShrink:0,color:"var(--text-3)",marginTop:2}}>{isExp?<ChevronUp size={15}/>:<ChevronDown size={15}/>}</div>
                  </div>
                  {isExp&&(
                    <div style={{padding:isMobile?"0 12px 12px":"0 16px 16px",marginLeft:isMobile?0:40,borderTop:"1px solid var(--border)",paddingTop:12}}>
                      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:8}}>
                        <DB icon={<BookOpen size={12}/>} title={t("Focus","重點")} content={t(item.focusEn,item.focus)}/>
                        <DB icon={<Briefcase size={12}/>} title={t("Prerequisites","先決條件")} content={t(item.prereqEn,item.prereq)}/>
                        <DB icon={<DollarSign size={12}/>} title={t("Cost","費用")} content={<><div>{item.cost}</div><div style={{fontSize:11,color:"var(--text-3)",marginTop:4,fontStyle:"italic",lineHeight:1.5}}>{t(item.costNoteEn,item.costNote)}</div></>}/>
                        <DB icon={<Award size={12}/>} title={t("Delivery","授課機制")} content={t(item.modeEn,item.mode)}/>
                      </div>
                      {/* Scope Note */}
                      {item.scopeNote&&<div style={{marginTop:8,padding:"8px 12px",borderRadius:6,background:"var(--amber-muted)",border:"1px solid rgba(245,158,11,0.15)",fontSize:11,color:"var(--text-2)",lineHeight:1.5}}>{t(item.scopeNoteEn,item.scopeNote)}</div>}
                      {/* Benchmark */}
                      {BENCHMARK[item.id]&&<div style={{marginTop:8,padding:10,borderRadius:6,background:"var(--surface-3)",border:"1px solid var(--border)"}}>
                        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6,fontSize:10,fontWeight:600,color:"var(--accent)",textTransform:"uppercase",letterSpacing:"0.04em"}}><Building2 size={11}/>{t("Industry Benchmark","業界基準")}</div>
                        <div style={{fontSize:11,color:"var(--text-2)",lineHeight:1.6,marginBottom:4}}>{t(BENCHMARK[item.id].noteEn,BENCHMARK[item.id].noteZh)}</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{BENCHMARK[item.id].companies.slice(0,5).map((c,i)=><span key={i} style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:"var(--badge-bg)",color:"var(--text-1)",fontWeight:500}}>{c}</span>)}{BENCHMARK[item.id].companies.length>5&&<span style={{fontSize:10,color:"var(--text-3)"}}>+{BENCHMARK[item.id].companies.length-5}</span>}</div>
                      </div>}
                      {/* Official link */}
                      {item.url&&item.url!=="#"&&(
                        <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{
                          display:"inline-flex",alignItems:"center",gap:5,marginTop:10,padding:"6px 14px",borderRadius:6,
                          background:"var(--accent-muted)",color:"var(--accent)",fontSize:11,fontWeight:600,textDecoration:"none",
                          border:"1px solid rgba(14,165,233,0.2)",
                        }}><ExternalLink size={12}/>{t("Official Website","官方網站")} →</a>
                      )}
                      <div style={{marginTop:8,display:"flex",gap:5,flexWrap:"wrap"}}>
                        {[t(catM.en,catM.zh),item.org,item.complianceTag].filter(Boolean).map((tag,i)=>(
                          <span key={i} style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"var(--badge-bg)",color:"var(--text-3)",fontWeight:500}}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>}
      </div>

      <div style={{padding:"12px 24px",borderTop:"1px solid var(--border)",textAlign:"center",fontSize:10,color:"var(--text-3)"}}>
        {t("Security Training Explorer v7.1 · GSM / GPS · 2026-03-26 · Role feedback applied",
           "企業安全訓練檢索 v7.1 · GSM / GPS · 2026-03-26 · 已納入各角色回饋")}
      </div>
    </div>
  );
}

function FR({label,children,last}){return(<div style={{marginBottom:last?0:8}}><div style={{fontSize:10,fontWeight:600,color:"var(--text-3)",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{children}</div></div>)}
function DB({icon,title,content}){return(<div style={{padding:10,borderRadius:6,background:"var(--surface-2)",border:"1px solid var(--border)"}}><div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4,fontSize:10,fontWeight:600,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.04em"}}>{icon}{title}</div><div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{content}</div></div>)}
function StatCard({label,value,sub,color,icon:I}){return(<div style={{padding:14,borderRadius:9,background:"var(--surface)",border:"1px solid var(--border)",flex:1,minWidth:130}}><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}>{I&&<I size={13} style={{color}}/>}<span style={{fontSize:10,fontWeight:600,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</span></div><div style={{fontSize:24,fontWeight:700,color}}>{value}</div>{sub&&<div style={{fontSize:11,color:"var(--text-3)",marginTop:2}}>{sub}</div>}</div>)}
