# -*- coding: utf-8 -*-
from docx import Document
from docx.shared import Pt, RGBColor

def style_headings(doc):
    for lvl, size in (('Title', 20), ('Heading 1', 20), ('Heading 2', 11)):
        try:
            st = doc.styles[lvl]; st.font.size = Pt(size); st.font.bold = True
            st.font.color.rgb = RGBColor(0x17, 0x49, 0x4F)
        except KeyError:
            pass

def name(doc, text, role):
    doc.add_heading(text, level=0)
    p = doc.add_paragraph(); r = p.add_run(role); r.bold = True
    r.font.size = Pt(11); r.font.color.rgb = RGBColor(0xB0, 0x84, 0x2C)

def head(doc, t): doc.add_heading(t, level=2)
def para(doc, t): doc.add_paragraph(t)
def bullet(doc, t): doc.add_paragraph('• ' + t)
def jobline(doc, t):
    p = doc.add_paragraph(); p.add_run(t).bold = True

# ---------------- Elin Ek (SE) ----------------
d = Document(); style_headings(d)
name(d, 'Elin Ek', 'Projektledare inom logistik')
para(d, 'elin.ek@exempelmail.se · 070-123 45 67 · Västerås')
head(d, 'PROFIL')
para(d, 'Projektledare med åtta års erfarenhet av lager och transport. Jag leder team på upp till femton personer, planerar införanden av nya system och följer upp leveranser mot budget och tidplan. Jag trivs där struktur, samarbete och tydlig kommunikation gör skillnad, och jag drivs av att omvandla komplexa flöden till enkla rutiner som håller i vardagen. Jag arbetar nära inköp, IT och drift och översätter verksamhetens behov till tydliga krav, tidplaner och uppföljning. Min styrka är att skapa lugn och framdrift även när många intressenter drar åt olika håll, och att få ett team att känna sig delaktigt i målet.')
head(d, 'ARBETSLIVSERFARENHET')
jobline(d, 'Projektledare, Nordlager AB, Västerås · 2021–2026')
bullet(d, 'Ledde införandet av ett nytt lagersystem på tre lager, i tid och inom budget.')
bullet(d, 'Planerade och följde upp projekt med tio till femton deltagare från inköp, IT och drift.')
bullet(d, 'Tog fram rutiner för avvikelser som halverade antalet felplock under ett år.')
bullet(d, 'Rapporterade status, kostnad och risker till ledningsgruppen varje månad.')
jobline(d, 'Teamledare lager, Mälartransport AB, Eskilstuna · 2018–2021')
bullet(d, 'Ansvarade för schema, introduktion och arbetsmiljö för tolv medarbetare.')
bullet(d, 'Förbättrade flödet vid inleverans tillsammans med leverantörer och minskade väntetider.')
bullet(d, 'Utbildade nya kollegor i truck, säkerhet och lagersystem.')
jobline(d, 'Lagermedarbetare, Mälartransport AB, Eskilstuna · 2016–2018')
bullet(d, 'Plock, pack och inventering med fokus på kvalitet och säkerhet.')
bullet(d, 'Deltog i införandet av streckkoder och bidrog till färre felleveranser.')
head(d, 'UTBILDNING')
jobline(d, 'Logistik och ledarskap, Yrkeshögskolan Västerås · 2014–2016')
jobline(d, 'Certifierad projektledare, Projektledarakademin · 2020')
head(d, 'KOMPETENSER')
para(d, 'Projektledning · Logistik · Lagersystem (WMS) · Budget och uppföljning · Förändringsledning · Leverantörskontakt · Excel · Arbetsmiljö · Agila metoder · Riskanalys \u00b7 Lean \u00b7 Kaizen \u00b7 Ledarskap \u00b7 Kommunikation \u00b7 Kvalitetsarbete')
head(d, 'SPRÅK OCH ÖVRIGT')
para(d, 'Svenska (modersmål) · Engelska (flytande) · B-körkort · Truckkort A och B')
para(d, 'Exempelmall från ATS-appen. Personen är påhittad.')
d.save('assets/demo/Demo_Elin_Ek_Mall.docx')

# ---------------- Omar Haddad (Gulf, EN) ----------------
d = Document(); style_headings(d)
name(d, 'Omar Haddad', 'Mechanical Engineer · Oil and Gas')
para(d, 'omar.haddad@examplemail.com · +974 5012 3456 · Doha, Qatar')
para(d, 'Nationality: Jordanian · Visa status: Transferable QID (work visa) · Available to join: immediately · Date of birth: 14 Mar 1990 · Marital status: Married')
head(d, 'PROFILE')
para(d, 'Mechanical engineer with nine years in oil and gas across Qatar and the UAE. I lead maintenance and shutdown projects on rotating equipment, manage teams of up to twenty, and deliver work on budget and to HSE standards. Fluent in English and Arabic, with a track record of reducing downtime through better preventive maintenance and close coordination with operations and vendors. I am comfortable planning turnarounds, managing spare-part strategies and reporting cost and risk to management. I take pride in building teams that work safely and to a clear plan, and in solving the root cause of recurring equipment problems rather than the symptoms.')
head(d, 'EXPERIENCE')
jobline(d, 'Senior Mechanical Engineer, Gulf Energy Services, Doha · 2021–2026')
bullet(d, 'Led planned shutdowns on compressors and pumps across three plants, completed on schedule.')
bullet(d, 'Managed a team of twenty technicians and external contractors.')
bullet(d, 'Cut unplanned downtime by eighteen percent through a new preventive-maintenance plan.')
bullet(d, 'Reported progress, cost and risk to management each month.')
jobline(d, 'Mechanical Engineer, Al Masa Industrial, Abu Dhabi · 2017–2021')
bullet(d, 'Maintained rotating equipment and coordinated with vendors on spare parts.')
bullet(d, 'Carried out root-cause analysis on failures and trained junior engineers.')
bullet(d, 'Supported HSE audits and improved permit-to-work compliance across the site.')
head(d, 'EDUCATION')
jobline(d, 'BSc Mechanical Engineering, University of Jordan · 2008–2012')
head(d, 'SKILLS')
para(d, 'Maintenance · Shutdown planning · Rotating equipment · HSE · Project management · Root-cause analysis · SAP PM · Vendor management · Team leadership · Turnaround planning')
head(d, 'LANGUAGES AND OTHER')
para(d, 'Arabic (native) · English (fluent) · Qatar driving licence')
para(d, 'Example template from the ATS app. The person is fictional. A photo can be added for the Gulf market.')
d.save('assets/demo/Demo_Omar_Haddad_Mall_Gulf.docx')
print('generated')
