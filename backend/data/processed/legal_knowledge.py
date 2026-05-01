"""
Curated legal knowledge base — high quality, hand-crafted facts.
These are ingested as high-priority chunks into FAISS.
Covers: RTI filing, online challans, case status, Delhi court contacts.
"""

KNOWLEDGE_BASE = [

    # ── RTI FILING ────────────────────────────────────────────────────────────
    {
        "text": """How to file an RTI application online in India:
Step 1: Visit the official RTI portal at https://rtionline.gov.in
Step 2: Click on 'Submit Request' and register/login with your details.
Step 3: Select the Ministry or Department you want information from.
Step 4: Write your request clearly — mention what specific information you need.
Step 5: Pay the application fee of Rs. 10 online via net banking, debit/credit card, or UPI.
Step 6: BPL (Below Poverty Line) card holders are completely exempt from paying the fee.
Step 7: Submit your application. You will receive an acknowledgement with a registration number.
Step 8: The public authority must respond within 30 days. If it involves life or liberty, response must come within 48 hours.
Step 9: If unsatisfied, file a First Appeal to the First Appellate Authority within 30 days.
Step 10: If still unsatisfied, file a Second Appeal to the Central/State Information Commission.
Important: RTI can also be filed offline by sending a written application to the Public Information Officer (PIO) of the concerned department with Rs. 10 fee via postal order or demand draft.""",
        "act_name": "Right to Information Act, 2005",
        "short_name": "RTI Act",
        "section": "RTI Filing Procedure",
        "source_url": "https://rtionline.gov.in",
        "year": 2005,
    },

    {
        "text": """RTI application fee structure and exemptions in India:
- Central Government departments: Rs. 10 per application
- For providing information: Rs. 2 per page (A4 or A3 size)
- For information in diskette or floppy: Rs. 50 per diskette
- For inspection of records: No fee for first hour; Rs. 5 for each subsequent hour
- BPL card holders: Completely exempt from all RTI fees
- State governments may have different fee structures — check your state RTI rules
- Payment modes accepted online: Net banking, UPI, debit card, credit card
- Payment modes for offline RTI: Indian Postal Order, Demand Draft, Banker's Cheque, or Cash
- No fee is charged for requests related to life and liberty of a person""",
        "act_name": "Right to Information Act, 2005",
        "short_name": "RTI Act",
        "section": "RTI Fee Structure",
        "source_url": "https://rtionline.gov.in",
        "year": 2005,
    },

    {
        "text": """RTI appeal process in India — what to do if your RTI is rejected or ignored:
First Appeal:
- If you do not receive a response within 30 days, or if you are unsatisfied with the response, file a First Appeal.
- File the First Appeal to the First Appellate Authority (FAA) of the same department.
- Must be filed within 30 days of receiving the response (or 30 days after deadline if no response).
- The FAA must decide within 30 days (maximum 45 days with reasons).

Second Appeal / Complaint:
- If still unsatisfied after First Appeal, file a Second Appeal to:
  Central Information Commission (CIC): https://cic.gov.in (for Central Government)
  State Information Commission: for State Government departments
- Can also file a complaint directly to CIC if PIO refused to accept RTI application.
- CIC can impose a penalty of Rs. 250 per day (up to Rs. 25,000) on erring PIO.
- CIC can also recommend disciplinary action against the PIO.""",
        "act_name": "Right to Information Act, 2005",
        "short_name": "RTI Act",
        "section": "RTI Appeal Procedure",
        "source_url": "https://cic.gov.in",
        "year": 2005,
    },

    # ── ONLINE CHALLAN ────────────────────────────────────────────────────────
    {
        "text": """How to pay a traffic challan online in Delhi and India:
Method 1 — Delhi Traffic Police Portal:
- Visit: https://www.delhitrafficpolice.nic.in
- Click on 'Pay Challan Online'
- Enter your vehicle number or challan number
- View pending challans and pay via net banking, UPI, debit/credit card

Method 2 — Parivahan Portal (National):
- Visit: https://echallan.parivahan.gov.in
- Click on 'Check Challan Status'
- Enter your vehicle number, challan number, or driving licence number
- Pay pending challans online

Method 3 — Via UPI Apps:
- Open any UPI app (Google Pay, PhonePe, Paytm)
- Search for 'Traffic Challan' under government services
- Enter vehicle or challan number and pay

Method 4 — Offline Payment:
- Visit your nearest traffic police office
- Carry vehicle registration documents and challan notice
- Pay by cash or demand draft

Important: Unpaid challans can result in vehicle registration renewal being blocked.
Check outstanding challans at: https://echallan.parivahan.gov.in/index/accused-challan""",
        "act_name": "Motor Vehicles Act, 1988",
        "short_name": "Traffic Law",
        "section": "Online Challan Payment Procedure",
        "source_url": "https://echallan.parivahan.gov.in",
        "year": 1988,
    },

    {
        "text": """Common traffic violations and fines in India under Motor Vehicles (Amendment) Act 2019:
- Driving without licence: Rs. 5,000 (first offence)
- Driving without helmet: Rs. 1,000 + 3 months licence suspension
- Driving without seatbelt: Rs. 1,000
- Using mobile phone while driving: Rs. 5,000
- Drunk driving: Rs. 10,000 and/or 6 months imprisonment (first offence)
- Jumping red light: Rs. 5,000
- Over-speeding (light motor vehicle): Rs. 1,000–2,000
- Driving without insurance: Rs. 2,000 (first offence), Rs. 4,000 (subsequent)
- Driving without RC (Registration Certificate): Rs. 5,000
- Dangerous driving: Rs. 5,000 (first offence)
- Not giving way to emergency vehicles: Rs. 10,000
- Overloading passengers (two-wheeler): Rs. 2,000 + licence suspended for 3 months
Note: Fines may vary by state. Delhi may have additional fines under local laws.""",
        "act_name": "Motor Vehicles Act, 1988",
        "short_name": "Traffic Law",
        "section": "Traffic Violation Fines",
        "source_url": "https://echallan.parivahan.gov.in",
        "year": 1988,
    },

    # ── CASE STATUS ───────────────────────────────────────────────────────────
    {
        "text": """How to check court case status online in India:
1. Supreme Court of India:
   - Website: https://www.sci.gov.in
   - Click on 'Case Status'
   - Search by case number, diary number, or party name
   - Also available on the eSCR portal: https://digiscr.sci.gov.in

2. Delhi High Court:
   - Website: https://delhihighcourt.nic.in
   - Click on 'Case Status' or 'Cause List'
   - Search by case number, CNR number, party name, or advocate name
   - Also check daily cause list at: https://delhihighcourt.nic.in/causelist

3. District Courts (All India — eCourts):
   - Website: https://services.ecourts.gov.in
   - Enter your CNR (Case Number Record) number
   - Or search by party name, advocate name, FIR number, or act
   - Available for all district and subordinate courts across India

4. National Consumer Disputes Redressal Commission (NCDRC):
   - Website: https://ncdrc.nic.in
   - Click on 'Case Status' to track consumer complaints

5. Check via SMS:
   - Send SMS to 9766899899: TYPE <CNR Number> and send
   - You will receive case status via SMS""",
        "act_name": "Court Procedures",
        "short_name": "Court Info",
        "section": "Case Status Online",
        "source_url": "https://services.ecourts.gov.in",
        "year": 2023,
    },

    {
        "text": """What is a CNR number and how to find it for your court case:
CNR stands for Case Number Record — it is a unique 16-digit number assigned to every case in Indian district and subordinate courts.
Format: STATE CODE + DISTRICT CODE + COURT CODE + CASE TYPE + NUMBER + YEAR
Example: DLCT010012342023

How to find your CNR number:
1. It is printed on every order/judgment copy issued by the court
2. Ask your advocate — they must have it
3. Check the eCourts portal: https://services.ecourts.gov.in and search by party name
4. Visit the court filing counter and ask for the CNR number of your case

Why CNR is important:
- Use it to track your case status 24/7 online
- Get hearing dates without visiting court
- Download orders and judgments
- Receive SMS alerts about your case

For Delhi District Courts specifically:
- Tis Hazari Court: https://tishazari.dcourts.gov.in
- Saket District Court: https://saket.dcourts.gov.in
- Rohini District Court: https://rohini.dcourts.gov.in
- Karkardooma Court: https://karkardooma.dcourts.gov.in
- Patiala House Court: https://patialahousecourt.dcourts.gov.in""",
        "act_name": "Court Procedures",
        "short_name": "Court Info",
        "section": "CNR Number Guide",
        "source_url": "https://services.ecourts.gov.in",
        "year": 2023,
    },

    # ── DELHI COURT CONTACTS ──────────────────────────────────────────────────
    {
        "text": """Official contact information for Delhi High Court:
Address: Delhi High Court, Sher Shah Road, New Delhi - 110003
Main Reception: +91-11-23384461 / 23074627
Website: https://delhihighcourt.nic.in
Email: registrar@delhihighcourt.nic.in

Important sections and contacts:
- Filing Counter: Visit in person, Ground Floor, Main Building
- Case Status Helpline: +91-11-23384473
- Legal Aid Services (DLSA): +91-11-23370002
- Delhi High Court Legal Services Committee: +91-11-23384551

Timing:
- Court working hours: 10:30 AM to 4:30 PM (Monday to Friday)
- Filing counter: 10:30 AM to 1:00 PM
- Closed on weekends and gazetted holidays

For urgent matters / emergency filing:
- Contact the Duty Registrar during court hours
- For urgent orders after hours, contact through advocates

Delhi High Court Bar Association: +91-11-23384544""",
        "act_name": "Court Procedures",
        "short_name": "Delhi Courts",
        "section": "Delhi High Court Contact",
        "source_url": "https://delhihighcourt.nic.in",
        "year": 2024,
    },

    {
        "text": """Contact information for major Delhi District Courts:
1. Tis Hazari Courts (Central District):
   Address: Tis Hazari, Delhi - 110054
   Phone: +91-11-23918804 / 23914073
   Website: https://tishazari.dcourts.gov.in
   Jurisdiction: Central Delhi cases

2. Saket District Court (South District):
   Address: Sheikh Sarai, Phase II, New Delhi - 110017
   Phone: +91-11-29565013
   Website: https://saket.dcourts.gov.in
   Jurisdiction: South Delhi cases

3. Rohini District Court (North-West District):
   Address: Sector 14, Rohini, Delhi - 110085
   Phone: +91-11-27555480
   Website: https://rohini.dcourts.gov.in
   Jurisdiction: North-West Delhi cases

4. Karkardooma Court (East District):
   Address: Karkardooma, Delhi - 110032
   Phone: +91-11-22372673
   Website: https://karkardooma.dcourts.gov.in
   Jurisdiction: East Delhi cases

5. Patiala House Courts (New Delhi District):
   Address: Tilak Marg, New Delhi - 110001
   Phone: +91-11-23386153
   Website: https://patialahousecourt.dcourts.gov.in
   Jurisdiction: New Delhi district cases

Delhi State Legal Services Authority (Free Legal Aid):
   Address: Delhi High Court Campus, New Delhi - 110003
   Phone: +91-11-23370002 / 23374870
   Website: https://dslsa.org
   Email: dslsa-dla@nic.in
   Helpline: 1516 (toll-free)""",
        "act_name": "Court Procedures",
        "short_name": "Delhi Courts",
        "section": "Delhi District Courts Contact",
        "source_url": "https://dcourts.gov.in",
        "year": 2024,
    },

    {
        "text": """Free legal aid in India — who is eligible and how to apply:
Under the Legal Services Authorities Act, 1987, free legal aid is available to:
- Women and children (regardless of income)
- SC/ST community members
- Victims of human trafficking or beggars
- Persons with disabilities
- Persons in custody
- Victims of mass disasters, ethnic violence, caste atrocities
- Industrial workmen
- Persons with annual income below Rs. 3 lakh (for Supreme Court)
- Persons with annual income below Rs. 1 lakh (for district courts, varies by state)

How to apply for free legal aid:
1. Visit your nearest District Legal Services Authority (DLSA) office
2. Or call the National Legal Services Authority (NALSA) helpline: 15100 (toll-free)
3. Online application: https://nalsa.gov.in
4. Delhi specifically: Call DSLSA at 1516 (toll-free) or visit Delhi High Court campus

Important contacts:
- NALSA (National): https://nalsa.gov.in | Helpline: 15100
- DSLSA (Delhi): https://dslsa.org | Phone: 1516 (toll-free)
- Central Authority: +91-11-23384458

Lok Adalat — settle disputes without going to court:
- Organized by NALSA and state authorities
- Decisions are final and binding — no appeal possible
- No court fees charged
- Covers: motor accident claims, labour disputes, matrimonial cases, land disputes
- Register at your nearest DLSA office""",
        "act_name": "Legal Services Authorities Act, 1987",
        "short_name": "Legal Aid",
        "section": "Free Legal Aid Eligibility",
        "source_url": "https://nalsa.gov.in",
        "year": 1987,
    },

    # ── CONSUMER COMPLAINTS ───────────────────────────────────────────────────
    {
        "text": """How to file a consumer complaint online in India:
Step 1: Visit the National Consumer Helpline: https://consumerhelpline.gov.in
Step 2: Register/login and click 'Register a Complaint'
Step 3: Fill in company name, product/service details, and your complaint
Step 4: Upload supporting documents (bills, receipts, emails, photos)
Step 5: Submit and note your complaint registration number
Step 6: The company is notified and given time to respond
Step 7: If unresolved, escalate to Consumer Forum

Consumer Forum jurisdiction based on claim amount:
- District Consumer Commission: Claims up to Rs. 50 lakh
- State Consumer Commission: Claims between Rs. 50 lakh and Rs. 2 crore
- National Consumer Commission (NCDRC): Claims above Rs. 2 crore

Filing fee:
- Up to Rs. 5 lakh claim: Rs. 200
- Rs. 5 lakh to Rs. 10 lakh: Rs. 400
- Rs. 10 lakh to Rs. 20 lakh: Rs. 500
- Higher amounts: proportionally higher fees

Complaint can be filed within 2 years of the cause of action.
National Consumer Helpline: 1800-11-4000 (toll-free) or 1915
Email: helpline@consumerhelpline.gov.in""",
        "act_name": "Consumer Protection Act, 2019",
        "short_name": "Consumer Act",
        "section": "Consumer Complaint Filing",
        "source_url": "https://consumerhelpline.gov.in",
        "year": 2019,
    },
]