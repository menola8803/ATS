export type Lang = 'sv' | 'en';

const sv = {
  // start screen and tabs
  tagline: 'CV-KOLL FÖR WORD & ODT', splashSub: 'Ditt CV, redo för ATS',
  splashOpen: 'ÖPPNA', splashImprove: 'FÖRBÄTTRA', splashSave: 'SPARA',
  tabHome: 'Hem', tabEval: 'Utvärdera', tabDocs: 'Dokument', tabSettings: 'Inställningar', mainMenu: 'Huvudmeny',

  // general
  back: 'Tillbaka', ok: 'OK', cancel: 'Avbryt', settings: 'Inställningar', version: 'Version', newVersion: 'Ny version',
  developer: 'Utvecklare: Claes Sundman · Scandinavian Nexum Consulting',

  // home
  evaluateCv: 'Utvärdera CV', evaluateCvSub: 'Word (.docx) eller ODT · AI-förslag per stycke',
  jobAd: 'Jobbannons', jobAdSub: 'Klistra in · ger rätt nyckelord', jobAdSet: 'Annons inlagd · {n} ord', jobAdPh: 'Klistra in annonstexten här…',
  clearAd: 'Ta bort annonsen', savedDocs: 'Sparade dokument ({n})', seeAll: 'Se alla  ›', notTested: 'Ej testad',
  noDocsYet: 'Inga dokument än. Tryck på Utvärdera CV, eller prova ett demo-CV under Dokument.',
  reading: 'Läser dokumentet…', openFailed: 'Filen kunde inte läsas. Välj en Word-fil (.docx) eller en ODT-fil (.odt).',
  wrongType: 'ATS läser Word (.docx) och ODT (.odt). Spara CV:t i något av de formaten och försök igen. Gamla .doc-filer går att spara om som .docx i Word.',

  // evaluate (review)
  evalEmptyTitle: 'Utvärdera ett CV', evalEmptyBody: 'Välj ditt CV i Word (.docx) eller ODT. ATS räknar en poäng direkt på telefonen och ger sedan AI-förslag för varje stycke.',
  chooseFile: 'Välj fil', tabOriginal: 'Original', tabImproved: 'Förbättrad',
  lockOn: 'Ärlighetsspärr på · AI:n lägger aldrig till fakta som inte finns i ditt CV',
  canImprove: 'Kan förbättras', changed: 'Ändrad', atsFriendly: 'ATS-vänligt', fillIn: 'Fyll i',
  suggestionsTap: 'AI-förslag – tryck för att använda', undoKeep: 'Ångra – behåll original',
  useAllFirst: 'Använd alla första', saveNew: 'Spara nytt', usedCount: '{n} av {m} förslag använda',
  getSuggestions: 'Få AI-förslag', getSuggestionsSub: 'Claude läser hela CV:t och föreslår bättre text för varje stycke som kan förbättras. Inget nytt hittas på.',
  analysing: 'Analyserar {n} stycken…', newSuggestions: 'Nya förslag',
  noKeyTitle: 'Ingen AI-nyckel än', noKeyBody: 'ATS-poängen fungerar utan nyckel. För AI-förslag behövs en egen API-nyckel från Anthropic. Under Inställningar › AI-förslag står steg för steg hur du skaffar en och lägger in den.',
  toSettings: 'Till inställningar',
  aiErrBadkey: 'AI-nyckeln fungerar inte. Kontrollera den under Inställningar.', aiErrBusy: 'AI-tjänsten är upptagen just nu. Försök igen om en stund.',
  aiErrNetwork: 'Ingen anslutning. Kontrollera internet och försök igen.', aiErrAnswer: 'AI:n gav ett svar som inte gick att läsa. Försök igen.', aiErrOther: 'Något gick fel: {e}',
  fillLabel: 'Fyll i {p}', fillHint: 'AI:n vet inte det här och hittar inte på – skriv in det själv.',
  scoreLabel: 'ATS-poäng', scoreDetails: 'Vad poängen bygger på', scoreHide: 'Dölj',
  kwMatch: 'Matchning mot annonsen: {p} %', kwMissing: 'Saknas i ditt CV: {w}', kwAllFound: 'Ditt CV har alla annonsens viktiga ord.',
  noAdHint: 'Lägg in en jobbannons på startsidan för att se vilka nyckelord som saknas.', demoAdNote: 'Demo-CV:t jämförs med en matchande demo-annons.',
  saveBlockedTitle: 'Fyll i platshållarna först', saveBlockedBody: '{n} stycken har kvar en platshållare som [ANTAL]. Fyll i dem, eller välj ett annat förslag.',
  noChangesTitle: 'Inga ändringar än', noChangesBody: 'Tryck på ett AI-förslag för att använda det, och spara sedan.',

  chkTablesOk: 'Inga tabeller', chkTablesBad: '{n} tabell(er) – rekryteringssystem läser dem ofta i fel ordning',
  chkHeaderOk: 'Inget i sidhuvud eller sidfot', chkHeaderBad: 'Text i sidhuvud eller sidfot – missas ofta av rekryteringssystem',
  chkBoxesOk: 'Inga textrutor', chkBoxesBad: '{n} textruta/textrutor – innehållet läses ofta inte alls',
  chkImagesOk: 'Inga bilder', chkImagesBad: '{n} bild(er) – text i bilder kan inte läsas',
  chkColumnsOk: 'En spalt', chkColumnsBad: 'Flera spalter – kan läsas i fel ordning',
  chkProfileOk: 'Rubrik för profil', chkProfileBad: 'Saknar rubrik för profil (Profil / Sammanfattning)',
  chkExperienceOk: 'Rubrik för erfarenhet', chkExperienceBad: 'Saknar rubriken Erfarenhet',
  chkEducationOk: 'Rubrik för utbildning', chkEducationBad: 'Saknar rubriken Utbildning',
  chkSkillsOk: 'Rubrik för kompetenser', chkSkillsBad: 'Saknar rubriken Kompetenser',
  chkEmailOk: 'E-post finns', chkEmailBad: 'Ingen e-postadress i texten',
  chkPhoneOk: 'Telefonnummer finns', chkPhoneBad: 'Inget telefonnummer i texten',
  chkLinkedinOk: 'LinkedIn finns', chkLinkedinBad: 'Ingen LinkedIn-länk',
  chkLengthOk: '{n} ord – lagom längd', chkLengthBad: '{n} ord – ungefär 300–900 ord är lagom',

  // save
  saveTitle: 'Spara nytt dokument', fileName: 'Filnamn', format: 'Format', formatSame: 'Samma format som originalet',
  saveAs: 'Spara som {ext}', saving: 'Sparar…', share: 'Dela…', seeBeforeAfter: 'Se då och nu',
  improvedN: '✓ {n} stycken förbättrade', alreadyGoodN: '✓ {n} stycken redan ATS-vänliga', originalUntouched: '✓ Originalfilen lämnas orörd',
  savedWhere: 'Sparad som {name} i Download/ATS', saveFailed: 'Kunde inte spara: {e}', needAndroid: 'Att spara i Download/ATS kräver Android 10 eller nyare.',

  // compare
  beforeTab: 'Då · original', nowTab: 'Nu · förbättrat', highlight: 'Markera ändrade stycken ({n})',
  changedByAi: 'Ändrat av AI', replaced: 'Ersattes', improveMore: 'Förbättra mer',

  // documents
  myDocs: 'Mina dokument', folderName: 'Download/ATS', filterAll: 'Alla', filterTested: 'Testade', filterNot: 'Ej testade', filterDemo: 'Demo',
  badgesHelp: 'ⓘ  Vad betyder märkena?', helpTested: 'Testad – ATS-poäng 0–100 från senaste kontrollen', helpNot: 'Inte kontrollerad än – tryck för att testa',
  helpDemo: 'Exempel-CV som följer med appen – prova utan ditt eget', countText: '{a} testade · {b} ej testade · {c} demo',
  demoJonas: 'Demo · IT-tekniker · svag', demoSara: 'Demo · Ekonomiassistent · medel', demoMira: 'Demo · Undersköterska · stark',
  docSaved: 'Sparad av ATS', docOpened: 'Öppnad', noneHere: 'Inga dokument här.',

  // settings
  appearance: 'Utseende', theme: 'Tema', themeDark: 'Mörk', themeBeige: 'Beige', themeNote: 'Samma teman som Alif: mörk petrol med guld och mint, eller ljust beige.',
  language: 'Språk', langNote: 'AI-förslagen skrivs alltid på dokumentets eget språk.',
  aiSection: 'AI-förslag', perPara: 'Förslag per stycke', tone: 'Ton', toneNeutral: 'Neutral', toneFormal: 'Formell', tonePersuasive: 'Säljande',
  useAd: 'Använd jobbannons', useAdSub: 'Nyckelord från annonsen styr förslagen',
  honesty: 'Ärlighetsspärr', honestySub: 'Alltid på · AI:n använder bara fakta som redan finns i ditt CV. Saknas en siffra blir det en platshållare som du fyller i.',
  aiService: 'AI-tjänst · Claude', aiServiceSub: 'Förslagen skapas av Claude från Anthropic, med din egen nyckel.',
  model: 'Modell', modelFast: 'Snabb · Haiku', modelBest: 'Bäst · Sonnet',
  modelFastNote: 'Svarar på några sekunder och kostar minst per dokument.', modelBestNote: 'Bättre formuleringar, lite långsammare och dyrare.',
  keyWhat: 'AI-förslagen skapas av Claude från företaget Anthropic. Appen behöver din egen API-nyckel – ett slags lösenord som kopplar ATS till ditt konto hos Anthropic. Varje förslag kostar en liten summa som dras från ditt saldo där. ATS-poängen fungerar utan nyckel.',
  keyHow: 'Så skaffar du en nyckel', keySteps: [
    'Tryck på Öppna console.anthropic.com nedan och logga in, eller skapa ett konto.',
    'Fyll på saldo under Billing. Förslagen betalas därifrån.',
    'Gå till API Keys och tryck Create Key. Döp den till exempel till ATS.',
    'Kopiera nyckeln. Den börjar med sk-ant- och visas bara en gång, så spara den också i till exempel en lösenordshanterare.',
    'Klistra in den i fältet API-nyckel här nedanför, tryck Spara nyckeln och sedan Testa nyckeln.',
  ],
  keyFormat: 'En API-nyckel från Anthropic börjar med sk-ant-. Kontrollera att hela nyckeln är inklistrad.',
  apiKey: 'API-nyckel', apiKeyPh: 'Skriv in din API-nyckel för Claude (Anthropic) här', saveKey: 'Spara nyckeln', testKey: 'Testa nyckeln', keyTesting: 'Testar…',
  keyOk: '✓ Nyckeln fungerar', keyBad: 'Nyckeln fungerar inte', keyNone: 'Ingen nyckel sparad', keySaved: 'Nyckel sparad', keyRemove: 'Ta bort nyckeln',
  keyNote: 'Sparas krypterat på telefonen, aldrig i appen. Skaffa en nyckel på console.anthropic.com.', getKey: 'Öppna console.anthropic.com',
  savingSection: 'Spara', folder: 'Mapp', folderSub: 'Download/ATS · det förbättrade CV:t sparas alltid som en ny fil',
  folderNote: 'Här sparar appen ATS dina förbättrade CV (Word och ODT). Originalfilerna ändras aldrig.',
  showDemo: 'Visa demo-dokument', showDemoSub: 'Tre exempel-CV att prova appen med',
  updatesSection: 'Uppdateringar', aboutSection: 'Om', manual: 'Manual', manualSub: 'Så använder du ATS',
  privacy: 'Integritet', privacySub: 'Texten skickas bara till AI:n',
  privacyBody: [
    'ATS räknar poängen på telefonen. Ingenting skickas någonstans för det.',
    'När du trycker på Få AI-förslag skickas CV:ts text, och jobbannonsen om du har lagt in en, till Claude hos Anthropic med din egen API-nyckel. Inget annat skickas, och inget skickas till utvecklaren.',
    'API-nyckeln sparas krypterat på telefonen.',
    'Dokumenten sparas i Download/ATS på telefonen. Originalfilen ändras aldrig.',
    'Sökningen efter uppdateringar visar din IP-adress för uppdateringsservern. Den kan stängas av under Uppdateringar.',
  ],

  // updates (same as Alif)
  update: 'Uppdateringar', updateSub: 'Söker efter en ny version av ATS', checkUpdate: 'Sök efter uppdatering', upToDate: 'Du har senaste versionen',
  checking: 'Söker…', updateFail: 'Kunde inte söka just nu.', noRelease: 'Ingen version är publicerad än.',
  updNewFound: 'Ny version {v} finns', updCheckedAt: 'Senast kontrollerad {t}', updNeverChecked: 'Inte kontrollerad ännu',
  updNew: 'Ny version', updStable: 'Stabil', updPrerelease: 'Förhandsversion', updYouHave: 'Du har {v}', updReleased: 'släppt {d}',
  updWhatsNew: 'Nytt i versionen', updDownloadInstall: 'Ladda ner och installera', updDownloadingPct: 'Laddar ner… {p} %',
  updVerified: 'Nedladdad och kontrollerad (SHA-256)', updDownloaded: 'Nedladdad och kontrollerad', updInstall: 'Installera {v}',
  updInstallNote: 'Uppdateringen installeras ovanpå appen. Allt ditt finns kvar. Android frågar om du vill installera, och ATS startar om av sig själv efteråt.',
  updAllow: 'Android frågar först om ATS får installera appar. Slå på "Tillåt från den här källan", gå tillbaka och tryck Installera igen.',
  updOpenPage: 'Öppna nedladdningssidan',
  updErrNetwork: 'Nedladdningen misslyckades. Kontrollera anslutningen och försök igen.',
  updErrChecksum: 'Filen stämde inte med den publicerade kontrollsumman och togs bort.',
  updErrPackage: 'Filen är inte en uppdatering av ATS.',
  updErrOlder: 'Filen är inte nyare än den installerade versionen.',
  updErrSignature: 'Den nya versionen är signerad med en annan nyckel och kan inte installeras ovanpå. Avinstallera ATS och installera den nya från nedladdningssidan.',
  updErrInstall: 'Kunde inte öppna installationen. Öppna nedladdningssidan i stället.',
  updPrivacy: 'Sökningen visar din IP-adress för uppdateringsservern. Stäng av automatisk sökning om du inte vill det.',
  updatedTitle: 'ATS är uppdaterad till {v}', updatedBody: 'Tryck för att öppna ATS.', updateChannel: 'Uppdatering av ATS',
  updateAutoLabel: 'Sök efter ny version automatiskt',
  updateHow: 'ATS kollar högst var sjätte timme när appen öppnas. Finns en ny version lyser kugghjulet. Tryck på Ladda ner och installera, så öppnas Androids installationsruta – tryck Uppdatera där. Allt ditt finns kvar.',

  // checks: Gulf personal details
  chkNationalityOk: 'Nationalitet angiven', chkNationalityBad: 'Ingen nationalitet – förväntas i Gulfstaterna',
  chkVisaOk: 'Visumstatus angiven', chkVisaBad: 'Ingen visumstatus (visa/Iqama/QID) – förväntas i Gulfstaterna',
  chkAvailabilityOk: 'Tillgänglighet angiven', chkAvailabilityBad: 'Ingen tillgänglighet – rekommenderas i Gulfstaterna',

  // save: format choice
  formatSameShort: 'behåller layouten', formatConvertNote: 'Det andra formatet byggs om som ett rent, ATS-säkert dokument. Tabeller och rutor blir stycken, bilder tas bort.',

  // settings: region
  regionSection: 'Region', regionLabel: 'Var söker du jobb?', regionNote: 'Olika länder vill se olika saker i ett CV. Valet styr hur poängen räknas.',
  regionEu: 'Sverige / Europa', regionEuSub: 'Inget foto, inga personuppgifter, 1–2 sidor',
  regionGulf: 'Gulfstaterna', regionGulfSub: 'Qatar, Saudiarabien, Oman, UAE, Kuwait, Bahrain',
  gulfHeading: 'Så ändras Gulf-läget',
  gulfPhoto: 'Foto tillåts – drar inte poäng. Tabeller och rutor gör det fortfarande.',
  gulfPersonal: 'Personuppgifter kollas: nationalitet, visum/Iqama/QID och tillgänglighet.',
  gulfLength: 'Längre CV ok – godkänd längd upp till cirka 1 400 ord.',
  gulfArabic: 'Arabiska rubriker känns igen (الملخص، الخبرة، التعليم، المهارات).',
  gulfAi: 'AI:n anpassar texten för en Gulfrekryterare.',
  gulfHonesty: 'Ärlighetsspärren gäller – fyll bara i uppgifter som stämmer.',

  // settings: protection
  protectSection: 'Skydd',
  protectAuth: 'Äkthetskoll', protectAuthSub: 'Appen startar bara om den är signerad med utvecklarens nyckel. En omsignerad kopia stoppas.',
  protectCode: 'Koden är skyddad', protectCodeSub: 'Byggd med R8, som förvränger koden så appen är svår att bakåtkompilera.',
  protectKeys: 'Dina nycklar stannar', protectKeysSub: 'API-nyckeln sparas bara på telefonen och skickas bara till Anthropic.',
  notAuthenticTitle: 'Den här kopian är inte äkta', notAuthenticBody: 'ATS är signerad med en annan nyckel än utvecklarens. Installera ATS från den riktiga nedladdningssidan. Avinstallera den här kopian först.',

  // file picker
  pickTitle: 'Välj CV', pickFolder: 'Download/ATS',
  pickAccessTitle: 'Visa alla CV i mappen', pickAccessBody: 'Ge ATS åtkomst till Download/ATS en gång, så listas även filer du lagt dit från dator eller mejl.', pickGiveAccess: 'Ge åtkomst',
  pickAll: 'Alla', pickOriginal: 'Original', pickImproved: 'Förbättrade', pickCount: '{n} dokument · nyast först',
  improvedBy: 'Förbättrad av ATS', pickBrowse: 'Bläddra på telefonen…', pickBrowseSub: 'För ett CV i Drive, mejl eller annan mapp', pickEmpty: 'Inga CV i Download/ATS än.',

  // uninstall
  uninstallSection: 'Avinstallera', uninstall: 'Avinstallera ATS', uninstallSub: 'Säkerhetskopiera först om du vill',
  uninstallIntro: 'Innan du avinstallerar kan du ta en säkerhetskopia av dina inställningar, poäng och sparade CV. Nyckeln kopieras aldrig.',
  backupNow: 'Säkerhetskopiera till Download/ATS', backupMade: 'Säkerhetskopia sparad: {name}', backupShare: 'Dela säkerhetskopian', backupFailed: 'Kunde inte säkerhetskopiera: {e}',
  keepFolderTitle: 'Behåll dokumenten?', keepFolder: 'Behåll Download/ATS (standard)', keepFolderSub: 'Dina sparade CV ligger kvar efter avinstallationen.',
  deleteAll: 'Ta bort allt i Download/ATS', deleteAllSub: 'Android ber dig bekräfta borttagningen.',
  openUninstall: 'Öppna avinstallationen', restoreTitle: 'Återställ från säkerhetskopia', restoreSub: 'Välj en ATS-backup (.zip) för att få tillbaka inställningar och poäng.', restorePick: 'Välj säkerhetskopia', restoreDone: 'Återställt från säkerhetskopian.', restoreFailed: 'Kunde inte återställa: {e}',

  // keyboard / fill preview
  previewLabel: 'Förhandsvisning', fieldNext: 'Nästa', fieldDone: 'Klar',
};

export type Strings = { [K in keyof typeof sv]: (typeof sv)[K] extends string[] ? string[] : string };

const en: Strings = {
  tagline: 'CV CHECK FOR WORD & ODT', splashSub: 'Your CV, ready for ATS',
  splashOpen: 'OPEN', splashImprove: 'IMPROVE', splashSave: 'SAVE',
  tabHome: 'Home', tabEval: 'Evaluate', tabDocs: 'Documents', tabSettings: 'Settings', mainMenu: 'Main menu',

  back: 'Back', ok: 'OK', cancel: 'Cancel', settings: 'Settings', version: 'Version', newVersion: 'New version',
  developer: 'Developer: Claes Sundman · Scandinavian Nexum Consulting',

  evaluateCv: 'Evaluate CV', evaluateCvSub: 'Word (.docx) or ODT · AI suggestions per paragraph',
  jobAd: 'Job ad', jobAdSub: 'Paste · gets the right keywords', jobAdSet: 'Ad added · {n} words', jobAdPh: 'Paste the ad text here…',
  clearAd: 'Remove the ad', savedDocs: 'Saved documents ({n})', seeAll: 'See all  ›', notTested: 'Not tested',
  noDocsYet: 'No documents yet. Tap Evaluate CV, or try a demo CV under Documents.',
  reading: 'Reading the document…', openFailed: 'The file could not be read. Choose a Word file (.docx) or an ODT file (.odt).',
  wrongType: 'ATS reads Word (.docx) and ODT (.odt). Save the CV in one of those formats and try again. Old .doc files can be saved again as .docx in Word.',

  evalEmptyTitle: 'Evaluate a CV', evalEmptyBody: 'Choose your CV in Word (.docx) or ODT. ATS calculates a score right on the phone and then gives AI suggestions for every paragraph.',
  chooseFile: 'Choose file', tabOriginal: 'Original', tabImproved: 'Improved',
  lockOn: 'Honesty lock on · the AI never adds facts that are not in your CV',
  canImprove: 'Can be improved', changed: 'Changed', atsFriendly: 'ATS-friendly', fillIn: 'Fill in',
  suggestionsTap: 'AI suggestions – tap to use', undoKeep: 'Undo – keep original',
  useAllFirst: 'Use all first', saveNew: 'Save new', usedCount: '{n} of {m} suggestions used',
  getSuggestions: 'Get AI suggestions', getSuggestionsSub: 'Claude reads the whole CV and suggests better text for every paragraph that can be improved. Nothing new is made up.',
  analysing: 'Analysing {n} paragraphs…', newSuggestions: 'New suggestions',
  noKeyTitle: 'No AI key yet', noKeyBody: 'The ATS score works without a key. AI suggestions need your own API key from Anthropic. Settings › AI suggestions shows step by step how to get one and add it.',
  toSettings: 'To settings',
  aiErrBadkey: 'The AI key does not work. Check it in Settings.', aiErrBusy: 'The AI service is busy right now. Try again in a moment.',
  aiErrNetwork: 'No connection. Check the internet and try again.', aiErrAnswer: 'The AI gave an answer that could not be read. Try again.', aiErrOther: 'Something went wrong: {e}',
  fillLabel: 'Fill in {p}', fillHint: 'The AI does not know this and does not make it up – type it in yourself.',
  scoreLabel: 'ATS score', scoreDetails: 'What the score is based on', scoreHide: 'Hide',
  kwMatch: 'Match with the ad: {p} %', kwMissing: 'Missing from your CV: {w}', kwAllFound: 'Your CV has all the important words in the ad.',
  noAdHint: 'Add a job ad on the home screen to see which keywords are missing.', demoAdNote: 'The demo CV is compared with a matching demo ad.',
  saveBlockedTitle: 'Fill in the placeholders first', saveBlockedBody: '{n} paragraphs still have a placeholder such as [NUMBER]. Fill them in, or choose another suggestion.',
  noChangesTitle: 'No changes yet', noChangesBody: 'Tap an AI suggestion to use it, then save.',

  chkTablesOk: 'No tables', chkTablesBad: '{n} table(s) – recruiting systems often read them in the wrong order',
  chkHeaderOk: 'Nothing in the header or footer', chkHeaderBad: 'Text in the header or footer – often missed by recruiting systems',
  chkBoxesOk: 'No text boxes', chkBoxesBad: '{n} text box(es) – the content is often not read at all',
  chkImagesOk: 'No images', chkImagesBad: '{n} image(s) – text in images cannot be read',
  chkColumnsOk: 'One column', chkColumnsBad: 'Several columns – may be read in the wrong order',
  chkProfileOk: 'Profile heading', chkProfileBad: 'No profile heading (Profile / Summary)',
  chkExperienceOk: 'Experience heading', chkExperienceBad: 'No Experience heading',
  chkEducationOk: 'Education heading', chkEducationBad: 'No Education heading',
  chkSkillsOk: 'Skills heading', chkSkillsBad: 'No Skills heading',
  chkEmailOk: 'Email address found', chkEmailBad: 'No email address in the text',
  chkPhoneOk: 'Phone number found', chkPhoneBad: 'No phone number in the text',
  chkLinkedinOk: 'LinkedIn found', chkLinkedinBad: 'No LinkedIn link',
  chkLengthOk: '{n} words – a good length', chkLengthBad: '{n} words – about 300–900 words is right',

  saveTitle: 'Save new document', fileName: 'File name', format: 'Format', formatSame: 'Same format as the original',
  saveAs: 'Save as {ext}', saving: 'Saving…', share: 'Share…', seeBeforeAfter: 'See before and after',
  improvedN: '✓ {n} paragraphs improved', alreadyGoodN: '✓ {n} paragraphs already ATS-friendly', originalUntouched: '✓ The original file is left untouched',
  savedWhere: 'Saved as {name} in Download/ATS', saveFailed: 'Could not save: {e}', needAndroid: 'Saving to Download/ATS needs Android 10 or newer.',

  beforeTab: 'Before · original', nowTab: 'Now · improved', highlight: 'Highlight changed paragraphs ({n})',
  changedByAi: 'Changed by AI', replaced: 'Replaced', improveMore: 'Improve more',

  myDocs: 'My documents', folderName: 'Download/ATS', filterAll: 'All', filterTested: 'Tested', filterNot: 'Not tested', filterDemo: 'Demo',
  badgesHelp: 'ⓘ  What do the badges mean?', helpTested: 'Tested – ATS score 0–100 from the latest check', helpNot: 'Not checked yet – tap to evaluate',
  helpDemo: 'Sample CVs that come with the app – try it without your own', countText: '{a} tested · {b} not tested · {c} demo',
  demoJonas: 'Demo · IT technician · weak', demoSara: 'Demo · Accounts assistant · medium', demoMira: 'Demo · Assistant nurse · strong',
  docSaved: 'Saved by ATS', docOpened: 'Opened', noneHere: 'No documents here.',

  appearance: 'Appearance', theme: 'Theme', themeDark: 'Dark', themeBeige: 'Beige', themeNote: 'The same themes as Alif: dark petrol with gold and mint, or light beige.',
  language: 'Language', langNote: 'AI suggestions are always written in the document’s own language.',
  aiSection: 'AI suggestions', perPara: 'Suggestions per paragraph', tone: 'Tone', toneNeutral: 'Neutral', toneFormal: 'Formal', tonePersuasive: 'Persuasive',
  useAd: 'Use job ad', useAdSub: 'Keywords from the ad steer the suggestions',
  honesty: 'Honesty lock', honestySub: 'Always on · the AI only uses facts already in your CV. If a number is missing it leaves a placeholder for you to fill in.',
  aiService: 'AI service · Claude', aiServiceSub: 'Suggestions are created by Claude from Anthropic, using your own key.',
  model: 'Model', modelFast: 'Fast · Haiku', modelBest: 'Best · Sonnet',
  modelFastNote: 'Answers in a few seconds and costs the least per document.', modelBestNote: 'Better wording, a little slower and more expensive.',
  keyWhat: 'AI suggestions are created by Claude from the company Anthropic. The app needs your own API key – a kind of password that connects ATS to your account at Anthropic. Each suggestion costs a small amount, taken from your balance there. The ATS score works without a key.',
  keyHow: 'How to get a key', keySteps: [
    'Tap Open console.anthropic.com below and sign in, or create an account.',
    'Add credit under Billing. The suggestions are paid from there.',
    'Go to API Keys and tap Create Key. Name it, for example, ATS.',
    'Copy the key. It starts with sk-ant- and is only shown once, so also save it in, for example, a password manager.',
    'Paste it into the API key field below, tap Save the key and then Test key.',
  ],
  keyFormat: 'An API key from Anthropic starts with sk-ant-. Check that the whole key was pasted.',
  apiKey: 'API key', apiKeyPh: 'Enter your Claude (Anthropic) API key here', saveKey: 'Save the key', testKey: 'Test key', keyTesting: 'Testing…',
  keyOk: '✓ Key works', keyBad: 'The key does not work', keyNone: 'No key saved', keySaved: 'Key saved', keyRemove: 'Remove the key',
  keyNote: 'Stored encrypted on the phone, never in the app. Get a key at console.anthropic.com.', getKey: 'Open console.anthropic.com',
  savingSection: 'Saving', folder: 'Folder', folderSub: 'Download/ATS · the improved CV is always saved as a new file',
  folderNote: 'This is where the ATS app saves your improved CVs (Word and ODT). The original files are never changed.',
  showDemo: 'Show demo documents', showDemoSub: 'Three sample CVs to try the app with',
  updatesSection: 'Updates', aboutSection: 'About', manual: 'Manual', manualSub: 'How to use ATS',
  privacy: 'Privacy', privacySub: 'Text is only sent to the AI',
  privacyBody: [
    'ATS calculates the score on the phone. Nothing is sent anywhere for that.',
    'When you tap Get AI suggestions, the text of the CV, and the job ad if you have added one, is sent to Claude at Anthropic with your own API key. Nothing else is sent, and nothing is sent to the developer.',
    'The API key is stored encrypted on the phone.',
    'Documents are saved in Download/ATS on the phone. The original file is never changed.',
    'Looking for updates shows your IP address to the update server. It can be turned off under Updates.',
  ],

  update: 'Updates', updateSub: 'Looks for a new version of ATS', checkUpdate: 'Check for update', upToDate: 'You have the latest version',
  checking: 'Checking…', updateFail: 'Could not check right now.', noRelease: 'No version has been published yet.',
  updNewFound: 'New version {v} is out', updCheckedAt: 'Last checked {t}', updNeverChecked: 'Not checked yet',
  updNew: 'New version', updStable: 'Stable', updPrerelease: 'Pre-release', updYouHave: 'You have {v}', updReleased: 'released {d}',
  updWhatsNew: 'What’s new', updDownloadInstall: 'Download and install', updDownloadingPct: 'Downloading… {p} %',
  updVerified: 'Downloaded and checked (SHA-256)', updDownloaded: 'Downloaded and checked', updInstall: 'Install {v}',
  updInstallNote: 'The update is installed over the app. Everything of yours stays. Android asks whether you want to install, and ATS restarts by itself afterwards.',
  updAllow: 'Android first asks whether ATS may install apps. Turn on "Allow from this source", go back and tap Install again.',
  updOpenPage: 'Open the download page',
  updErrNetwork: 'The download failed. Check the connection and try again.',
  updErrChecksum: 'The file did not match the published checksum and was removed.',
  updErrPackage: 'The file is not an update of ATS.',
  updErrOlder: 'The file is not newer than the installed version.',
  updErrSignature: 'The new version is signed with another key and cannot be installed over this one. Uninstall ATS and install the new one from the download page.',
  updErrInstall: 'Could not open the installer. Open the download page instead.',
  updPrivacy: 'Looking shows your IP address to the update server. Turn off automatic looking if you do not want that.',
  updatedTitle: 'ATS is updated to {v}', updatedBody: 'Tap to open ATS.', updateChannel: 'ATS update',
  updateAutoLabel: 'Look for a new version automatically',
  updateHow: 'ATS looks at most every six hours when the app is opened. When there is a new version the gear glows. Tap Download and install and Android’s installer opens – tap Update there. Everything of yours stays.',

  chkNationalityOk: 'Nationality stated', chkNationalityBad: 'No nationality – expected in the Gulf',
  chkVisaOk: 'Visa status stated', chkVisaBad: 'No visa status (visa/Iqama/QID) – expected in the Gulf',
  chkAvailabilityOk: 'Availability stated', chkAvailabilityBad: 'No availability – recommended in the Gulf',

  formatSameShort: 'keeps the layout', formatConvertNote: 'The other format is rebuilt as a clean, ATS-safe document. Tables and boxes become paragraphs, images are dropped.',

  regionSection: 'Region', regionLabel: 'Where are you applying?', regionNote: 'Different countries expect different things in a CV. The choice steers how the score is counted.',
  regionEu: 'Sweden / Europe', regionEuSub: 'No photo, no personal details, 1–2 pages',
  regionGulf: 'The Gulf states', regionGulfSub: 'Qatar, Saudi Arabia, Oman, UAE, Kuwait, Bahrain',
  gulfHeading: 'What changes in Gulf mode',
  gulfPhoto: 'A photo is allowed – it does not cost points. Tables and boxes still do.',
  gulfPersonal: 'Personal details are checked: nationality, visa/Iqama/QID and availability.',
  gulfLength: 'Longer CVs are fine – accepted length up to about 1,400 words.',
  gulfArabic: 'Arabic headings are recognised (الملخص، الخبرة، التعليم، المهارات).',
  gulfAi: 'The AI tailors the text for a Gulf recruiter.',
  gulfHonesty: 'The honesty lock applies – only fill in details that are true.',

  protectSection: 'Protection',
  protectAuth: 'Authenticity check', protectAuthSub: 'The app starts only if it is signed with the developer’s key. A re-signed copy is stopped.',
  protectCode: 'The code is protected', protectCodeSub: 'Built with R8, which obfuscates the code so the app is hard to decompile.',
  protectKeys: 'Your keys stay put', protectKeysSub: 'The API key is stored only on the phone and is sent only to Anthropic.',
  notAuthenticTitle: 'This copy is not authentic', notAuthenticBody: 'ATS is signed with a key other than the developer’s. Install ATS from the real download page. Uninstall this copy first.',

  pickTitle: 'Choose CV', pickFolder: 'Download/ATS',
  pickAccessTitle: 'Show every CV in the folder', pickAccessBody: 'Give ATS access to Download/ATS once, so files you copy there from a computer or email are listed too.', pickGiveAccess: 'Give access',
  pickAll: 'All', pickOriginal: 'Original', pickImproved: 'Improved', pickCount: '{n} documents · newest first',
  improvedBy: 'Improved by ATS', pickBrowse: 'Browse the phone…', pickBrowseSub: 'For a CV in Drive, email or another folder', pickEmpty: 'No CVs in Download/ATS yet.',

  uninstallSection: 'Uninstall', uninstall: 'Uninstall ATS', uninstallSub: 'Back up first if you want',
  uninstallIntro: 'Before you uninstall, you can back up your settings, scores and saved CVs. The key is never copied.',
  backupNow: 'Back up to Download/ATS', backupMade: 'Backup saved: {name}', backupShare: 'Share the backup', backupFailed: 'Could not back up: {e}',
  keepFolderTitle: 'Keep the documents?', keepFolder: 'Keep Download/ATS (default)', keepFolderSub: 'Your saved CVs stay after uninstalling.',
  deleteAll: 'Delete everything in Download/ATS', deleteAllSub: 'Android asks you to confirm the deletion.',
  openUninstall: 'Open the uninstaller', restoreTitle: 'Restore from backup', restoreSub: 'Choose an ATS backup (.zip) to get settings and scores back.', restorePick: 'Choose backup', restoreDone: 'Restored from the backup.', restoreFailed: 'Could not restore: {e}',

  previewLabel: 'Preview', fieldNext: 'Next', fieldDone: 'Done',
};

export const dict: Record<Lang, Strings> = { sv: sv as Strings, en };

/** Fills in {n}, {p} … */
export const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k]) : m));
