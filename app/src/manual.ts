// The manual inside the app (Settings › Manual), in both languages. Update it for every change a user can see, and set
// the version to the app's version (the tests check that).
export const MANUAL_VERSION = '0.1.3';

export type ManualSection = { title: string; items: string[] };

const sv: ManualSection[] = [
  { title: 'Kom igång', items: [
    'Tryck på Utvärdera CV och välj ditt CV i Word (.docx) eller ODT (.odt).',
    'ATS läser hela dokumentet och ger det en ATS-poäng från 0 till 100, direkt på telefonen.',
    'Inget eget CV till hands? Under Dokument › Demo finns tre exempel-CV – ett svagt, ett medel och ett starkt – med matchande jobbannonser.',
  ] },
  { title: 'Poängen', items: [
    'Tryck på poängringen för att se vad poängen bygger på.',
    'Layout: tabeller, textrutor, bilder, flera spalter och text i sidhuvudet drar ner poängen, eftersom rekryteringssystem ofta läser dem fel.',
    'Rubriker: att Profil, Erfarenhet, Utbildning och Kompetenser finns. Kontakt: e-post, telefon och gärna LinkedIn i själva texten.',
    'Längd: ungefär 300–900 ord är lagom.',
    'Med en jobbannons räknas också hur många av annonsens viktiga ord som finns i CV:t, och de som saknas visas.',
  ] },
  { title: 'AI-förslag', items: [
    'Tryck på Få AI-förslag. Claude läser hela CV:t och ger ett till tre förslag för varje stycke som kan bli bättre.',
    'Tryck på ett förslag så ersätter det texten. Ångra – behåll original tar tillbaka din egen text.',
    'Använd alla första väljer det första förslaget i alla stycken på en gång.',
    'Flikarna Original och Förbättrad visar din text eller den nya texten.',
    'Stycken som redan är bra märks ATS-vänligt.',
    'AI-förslagen kräver en egen API-nyckel från Anthropic, som du lägger in under Inställningar › AI-förslag.',
  ] },
  { title: 'API-nyckel', items: [
    'API-nyckeln är ett slags lösenord som kopplar ATS till ditt konto hos Anthropic, företaget bakom Claude. Varje förslag kostar en liten summa som dras från ditt saldo där.',
    'Skaffa en: logga in på console.anthropic.com, fyll på saldo under Billing, gå till API Keys och tryck Create Key.',
    'Kopiera nyckeln (den börjar med sk-ant- och visas bara en gång), klistra in den under Inställningar › AI-förslag, tryck Spara nyckeln och sedan Testa nyckeln.',
    'Nyckeln sparas krypterat på telefonen och skickas bara till Anthropic när du trycker Få AI-förslag.',
  ] },
  { title: 'Ärlighetsspärr', items: [
    'Ärlighetsspärren är alltid på: AI:n lägger aldrig till erfarenheter, siffror, verktyg eller utbildningar som inte finns i ditt CV.',
    'Saknas en uppgift, till exempel ett antal, visas en streckad platshållare som [ANTAL]. Fyll i den själv innan du sparar.',
    'En siffra som AI:n skriver men som inte finns i ditt CV byts automatiskt mot en platshållare.',
  ] },
  { title: 'Jobbannons', items: [
    'Tryck på Jobbannons på startsidan och klistra in annonsens text.',
    'AI:n tar då med annonsens viktigaste ord i förslagen – men bara där ditt CV redan visar att du har den kunskapen.',
  ] },
  { title: 'Spara och jämföra', items: [
    'Tryck på Spara nytt, välj filnamn och tryck Spara. Det förbättrade CV:t sparas som en ny fil i samma format.',
    'Allt sparas i mappen Download/ATS, så du når filerna från Filer på telefonen eller från datorn. Originalet ändras aldrig.',
    'Se då och nu visar hela dokumentet före och efter. Markera ändrade stycken lyfter fram allt som AI:n har skrivit om.',
  ] },
  { title: 'Dokument', items: [
    'Under Dokument finns allt du har öppnat och sparat, och demo-CV:na.',
    'En grön ring i hörnet visar dokumentets senaste ATS-poäng. Ej testad betyder att det inte har kontrollerats än.',
    'Filtrera mellan Alla, Testade, Ej testade och Demo.',
  ] },
  { title: 'Tips för ett ATS-vänligt CV', items: [
    'Använd vanliga rubriker, inte egna påhittade namn.',
    'Skriv kontaktuppgifter i brödtexten, inte i sidhuvudet.',
    'Undvik tabeller och textrutor. Använd vanliga stycken och punktlistor.',
    'Skriv titel, företag och årtal på samma rad för varje anställning.',
  ] },
  { title: 'Inställningar', items: [
    'Tema: Mörk eller Beige, samma som i Alif. Språk: svenska eller engelska.',
    'AI: antal förslag per stycke, ton, Snabb (Haiku) eller Bäst (Sonnet), och din API-nyckel.',
    'Uppdateringar: ATS söker själv efter nya versioner, och kugghjulet lyser när en ny finns.',
  ] },
];

const en: ManualSection[] = [
  { title: 'Getting started', items: [
    'Tap Evaluate CV and choose your CV in Word (.docx) or ODT (.odt).',
    'ATS reads the whole document and gives it an ATS score from 0 to 100, right on the phone.',
    'No CV of your own at hand? Under Documents › Demo there are three sample CVs – weak, medium and strong – with matching job ads.',
  ] },
  { title: 'The score', items: [
    'Tap the score ring to see what the score is based on.',
    'Layout: tables, text boxes, images, several columns and text in the header lower the score, because recruiting systems often read them wrong.',
    'Headings: that Profile, Experience, Education and Skills are present. Contact: email, phone and ideally LinkedIn in the body text.',
    'Length: about 300–900 words is right.',
    'With a job ad, the score also counts how many of the ad’s important words are in the CV, and the missing ones are shown.',
  ] },
  { title: 'AI suggestions', items: [
    'Tap Get AI suggestions. Claude reads the whole CV and gives one to three suggestions for every paragraph that can be improved.',
    'Tap a suggestion to replace the text. Undo – keep original brings back your own text.',
    'Use all first picks the first suggestion in every paragraph at once.',
    'The Original and Improved tabs show your text or the new text.',
    'Paragraphs that are already good are marked ATS-friendly.',
    'AI suggestions need your own API key from Anthropic, which you add under Settings › AI suggestions.',
  ] },
  { title: 'API key', items: [
    'The API key is a kind of password that connects ATS to your account at Anthropic, the company behind Claude. Each suggestion costs a small amount, taken from your balance there.',
    'Get one: sign in at console.anthropic.com, add credit under Billing, go to API Keys and tap Create Key.',
    'Copy the key (it starts with sk-ant- and is only shown once), paste it under Settings › AI suggestions, tap Save the key and then Test key.',
    'The key is stored encrypted on the phone and only sent to Anthropic when you tap Get AI suggestions.',
  ] },
  { title: 'Honesty lock', items: [
    'The honesty lock is always on: the AI never adds experience, numbers, tools or education that are not in your CV.',
    'If a detail is missing, such as a number, a dashed placeholder like [NUMBER] appears. Fill it in yourself before you save.',
    'A number the AI writes that is not in your CV is replaced by a placeholder automatically.',
  ] },
  { title: 'Job ad', items: [
    'Tap Job ad on the home screen and paste the text of the ad.',
    'The AI then works the ad’s most important words into its suggestions – but only where your CV already shows that you have that skill.',
  ] },
  { title: 'Saving and comparing', items: [
    'Tap Save new, choose a file name and tap Save. The improved CV is saved as a new file in the same format.',
    'Everything is saved in the Download/ATS folder, so you can reach the files from Files on the phone or from a computer. The original is never changed.',
    'See before and after shows the whole document before and after. Highlight changed paragraphs marks everything the AI rewrote.',
  ] },
  { title: 'Documents', items: [
    'Documents holds everything you have opened and saved, and the demo CVs.',
    'A green ring in the corner shows the document’s latest ATS score. Not tested means it has not been checked yet.',
    'Filter between All, Tested, Not tested and Demo.',
  ] },
  { title: 'Tips for an ATS-friendly CV', items: [
    'Use standard headings, not names of your own.',
    'Put contact details in the body text, not in the header.',
    'Avoid tables and text boxes. Use plain paragraphs and bullet lists.',
    'Write title, company and years on the same line for each job.',
  ] },
  { title: 'Settings', items: [
    'Theme: Dark or Beige, the same as in Alif. Language: Swedish or English.',
    'AI: suggestions per paragraph, tone, Fast (Haiku) or Best (Sonnet), and your API key.',
    'Updates: ATS looks for new versions by itself, and the gear glows when there is one.',
  ] },
];

export const MANUAL = { sv, en };
