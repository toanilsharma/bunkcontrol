import React from 'react';
import { ChartBarIcon, CalculatorIcon, BookIcon, BrainIcon, TargetIcon, ShieldCheckIcon, UserGroupIcon } from '../components/icons';

export interface ArticleSection {
    title?: string;
    content: string | string[]; // Paragraphs or List Items
    type: 'text' | 'list' | 'callout-warning' | 'callout-tip' | 'callout-info' | 'code';
}

export interface Article {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    readTime: string;
    author: string;
    category: 'Guide' | 'Academic' | 'Tips' | 'Rules';
    icon: React.FC<{ className?: string }>;
    color: string;
    content: ArticleSection[];
}

export const articles: Article[] = [
    {
        id: 'calculate-attendance-manually',
        title: 'The Ultimate Guide to Calculating Attendance Manually',
        subtitle: 'Stop guessing. Use these advanced formulas to handle medical leaves, cancelled classes, and "Safe Bunk" projections like a pro.',
        date: 'July 28, 2024',
        readTime: '12 min read',
        author: 'A Sharma',
        category: 'Guide',
        icon: CalculatorIcon,
        color: 'from-blue-500 to-cyan-500',
        content: [
            {
                type: 'text',
                content: [
                    "We've all been there. It's 11 PM, finals are a month away, and the college ERP portal is down (again). Or worse, you're too scared to log in because you know the numbers are going to be ugly. You need to know exactly where you stand, but the math feels fuzzy. Does that one mass bunk count? What about the class the professor cancelled?",
                    "While Bunk Control calculates this for you automatically, understanding the raw math gives you a different kind of confidence. It allows you to audit your college's official numbers and catch mistakes (yes, they happen often).",
                    "This guide covers everything from the basic percentage formula to advanced 'Recovery Math' for when you are deep in the danger zone."
                ]
            },
            {
                type: 'text',
                title: 'Part 1: The Foundation',
                content: "The formula for attendance is deceptively simple, yet students often get the variables wrong. The most common mistake? Counting 'Total Classes' incorrectly."
            },
            {
                type: 'callout-info',
                content: "Core Formula: Percentage = (Total Classes Attended / Total Classes Held) × 100"
            },
            {
                type: 'text',
                content: [
                    "Let's break down the variables:",
                    "**Total Classes Held:** This is the denominator. It ONLY includes classes that actually happened. If a professor cancels a class, or if it's a national holiday, this number does NOT increase. This is crucial because a smaller denominator helps you recover percentage faster.",
                    "**Total Classes Attended:** This is simple. The number of times you were physically present (or got a proxy).",
                    "**Example:** Suppose your Data Structures course has had 40 lectures scheduled so far. However, the professor was sick for 2 of them. The 'Total Classes Held' is 38, not 40. If you attended 28 classes, your percentage is (28/38)*100 = 73.68%."
                ]
            },
            {
                type: 'text',
                title: 'Part 2: The "Safe Bunk" Formula',
                content: "This is the most popular calculation. You are currently safe (say, 85%), and you want to know how many classes you can sleep through before hitting the danger line (75%)."
            },
            {
                type: 'code',
                content: "Safe Bunks = (Attended - (Target% * Total)) / Target%"
            },
            {
                type: 'text',
                content: [
                    "Let's try a real scenario. You have attended **35 out of 40** classes. That is **87.5%**. Your college requires **75%** (0.75).",
                    "Bunks = (35 - (0.75 * 40)) / 0.75",
                    "Bunks = (35 - 30) / 0.75",
                    "Bunks = 5 / 0.75 = 6.66"
                ]
            },
            {
                type: 'callout-tip',
                content: "Pro Tip: Always round DOWN your safe bunks. The math says 6.66, which mathematically rounds to 7. But if you bunk 7 classes, you will drop BELOW 75%. Therefore, the answer is 6."
            },
            {
                type: 'text',
                title: 'Part 3: The Recovery Formula (The "X" Factor)',
                content: [
                    "This is the formula for the 'Academic Victims'. You are currently at 60%. You need to get to 75%. How many classes do you need to attend consecutively without missing a single one?",
                    "Let 'X' be the number of future classes you must attend.",
                    "The logic is: (Current Attended + X) / (Current Total + X) = Target %"
                ]
            },
            {
                type: 'code',
                content: "X = (Target% * Total - Attended) / (1 - Target%)"
            },
            {
                type: 'text',
                content: [
                    "**Scenario:** You have attended **20 out of 40** classes (50%). You need **75%** (0.75).",
                    "X = (0.75 * 40 - 20) / (1 - 0.75)",
                    "X = (30 - 20) / 0.25",
                    "X = 10 / 0.25 = 40 classes."
                ]
            },
            {
                type: 'callout-warning',
                content: "Reality Check: In this example, you need to attend the next 40 classes straight to reach 75%. If your semester only has 30 classes left, it is mathematically impossible to reach 75% through attendance alone. This is when you need to switch strategies (Medical Certificates or talking to the Dean)."
            },
            {
                type: 'text',
                title: 'Part 4: Handling Labs vs. Theory',
                content: "Students often conflate Lab attendance with Theory attendance. This is a fatal error. Labs usually happen once a week, while theory happens 3-4 times. This means missing ONE lab drops your percentage significantly more than missing one lecture."
            },
            {
                type: 'list',
                content: [
                    "Theory: 40 classes total. 1 miss = 2.5% drop.",
                    "Lab: 12 classes total. 1 miss = 8.3% drop.",
                    "Conclusion: You can afford to miss theory classes. You generally cannot afford to miss labs."
                ]
            },
            {
                type: 'text',
                title: 'Part 5: The "Medical Leave" Adjustment',
                content: [
                    "Most colleges have a clause: 75% mandatory, but condonable up to 65% with a medical certificate. When calculating your 'Safety', you should actually calculate two numbers:",
                    "1. The 75% Safe Zone (No paperwork needed).",
                    "2. The 65% Danger Zone (Requires fake/real medical certs + fine).",
                    "If you are aiming for the 65% target, simply replace 0.75 with 0.65 in all the formulas above. Be warned: relying on the medical margin is stressful. Professors can reject certificates if they feel you are faking it (which, let's be honest, 90% of students are)."
                ]
            },
            {
                type: 'text',
                title: 'Summary',
                content: "Don't trust your intuition. Our brains are bad at calculating percentages on the fly. We often think 'I've gone to class all week, I can skip today,' not realizing that 'all week' was only 3 classes, and we skipped 5 last week. Always run the numbers."
            }
        ]
    },
    {
        id: '75-percent-rule-explained',
        title: 'The 75% Attendance Rule: Myths, Loopholes, and Reality',
        subtitle: 'Why do colleges obsess over 75%? Is it a law? Can you get around it? We expose the truth behind the university system.',
        date: 'July 28, 2024',
        readTime: '15 min read',
        author: 'Team Bunk Control',
        category: 'Rules',
        icon: ShieldCheckIcon,
        color: 'from-red-500 to-pink-500',
        content: [
            {
                type: 'text',
                content: [
                    "It is the number that haunts every college student's dreams. The 75% Rule. It doesn't matter if you ace every exam, submit every assignment, and build the next Facebook in your dorm room—if that attendance meter hits 74.9%, the system flags you.",
                    "But why 75%? Is it arbitrary? Is it actually a law? And most importantly, how rigid is it really? In this deep dive, we explore the origins of the rule, the tiers of enforcement, and the strategies students use to navigate it."
                ]
            },
            {
                type: 'text',
                title: 'Where does it come from?',
                content: "In India, the University Grants Commission (UGC) mandates this rule. Similar bodies exist in the US and UK. The academic philosophy is that 'contact hours' are essential for learning. They believe that if you aren't in class, you aren't learning, regardless of your exam scores."
            },
            {
                type: 'callout-info',
                content: "The Tier System: Not all colleges enforce this equally. Identify which tier your college belongs to immediately."
            },
            {
                type: 'text',
                title: 'Tier 1: The "Digital Jail" (IITs, NITs, Top Private Unis)',
                content: [
                    "**Mechanism:** Biometric scanners, facial recognition, or app-based GPS attendance.",
                    "**Leniency:** Zero.",
                    "**The Reality:** In these colleges, the professor has no power. The attendance data goes directly to a central server. If the computer says you are detained, you are detained. There is no 'talking to the professor' because they cannot edit the database even if they wanted to.",
                    "**Strategy:** You must maintain the number mathematically. Medical certificates are verified strictly by the college hospital."
                ]
            },
            {
                type: 'text',
                title: 'Tier 2: The "Bureaucratic Maze" (State Universities)',
                content: [
                    "**Mechanism:** Physical registers or manual digital entry by profs.",
                    "**Leniency:** Moderate (with a price).",
                    "**The Reality:** These colleges often have a 'Condonation Fee'. If you are between 65% and 75%, you can pay a fine (often ranging from ₹500 to ₹5000 per subject) to sit for exams. It is essentially an official bribe.",
                    "**Strategy:** Aim for 65%. Save money for the fines. Build a rapport with the HOD (Head of Department) because they sign the condonation forms."
                ]
            },
            {
                type: 'text',
                title: 'Tier 3: The "Wild West" (Local Colleges)',
                content: [
                    "**Mechanism:** Purely manual registers.",
                    "**Leniency:** High.",
                    "**The Reality:** Attendance is a negotiation. If you are a 'good student' (submit assignments on time, don't cause trouble), the professor will likely just mark you present even if you weren't there. The '75%' is a threat, not a rule.",
                    "**Strategy:** Be visible. Sit in the front row when you DO go. Ask questions. Make the professor feel like you are regular, even if you attend 40%."
                ]
            },
            {
                type: 'text',
                title: 'The "Debarred" List Nightmare',
                content: "Being debarred (or detained) is the worst-case scenario. It means you are not issued an Admit Card for the final exam. This results in an automatic 'F' grade. You have to repeat the course, usually a year later or in a 'Summer Semester'. This destroys your CGPA and can delay your degree."
            },
            {
                type: 'text',
                title: 'The Loophole: "On Duty" (OD) Leave',
                content: "This is the single most effective legal way to bypass attendance. OD leave is granted when you represent the college. It counts as 'Present' even if you aren't in class."
            },
            {
                type: 'list',
                content: [
                    "**Sports:** Even if you aren't an athlete, join the organizing committee for sports fests.",
                    "**Cultural Fests:** Being a volunteer often gets you 3-5 days of attendance.",
                    "**Technical Symposiums:** Organizing hackathons or workshops.",
                    "**Placements:** If you are sitting for an interview, that is automatic OD.",
                    "**Blood Donation:** Some colleges give 1 day of attendance for donating blood."
                ]
            },
            {
                type: 'callout-warning',
                content: "Warning regarding Proxies: In Tier 1 colleges, getting caught giving a proxy (marking attendance for an absent friend) is often punished MORE severely than low attendance. You can be suspended. Know the risks."
            },
            {
                type: 'text',
                title: 'Conclusion',
                content: "The 75% rule is a game. Tier 1 requires math and discipline. Tier 2 requires money (for fines). Tier 3 requires social skills. Figure out which game you are playing and adjust your strategy accordingly."
            }
        ]
    },
    {
        id: 'engineering-attendance-tips',
        title: 'The Engineering Student\'s Survival Guide to Attendance',
        subtitle: 'Surviving 8 AM lectures, 4-hour labs, and the infinite loop of assignments without losing your mind.',
        date: 'July 29, 2024',
        readTime: '10 min read',
        author: 'Engg. Survivor',
        category: 'Academic',
        icon: BrainIcon,
        color: 'from-orange-500 to-yellow-500',
        content: [
            {
                type: 'text',
                content: "Engineering is a marathon of endurance. Between record-writing, assignments, vivas, projects, and actual exams, attending every single theory lecture is physically and mentally impossible. To survive, you don't need to work harder, you need to bunk smarter."
            },
            {
                type: 'text',
                title: '1. The "First 2 Weeks" Rule',
                content: "This is psychology 101. Never skip classes in the first two weeks of the semester. Why? Because professors are memorizing faces. If you are a ghost early on, you are a target later. Establish a presence. Answer one question. Sit in the front row once. Once they know your face and name, you can strategically disappear to the back bench or skip entirely. They will 'feel' like they have seen you recently."
            },
            {
                type: 'text',
                title: '2. The Lab Hierarchy',
                content: "All attendance is equal, but some attendance is more equal than others. Never, ever bunk a Lab. Here is why:"
            },
            {
                type: 'list',
                content: [
                    "**Credit Weightage:** Labs are high credit for fewer hours.",
                    "**Visibility:** In a lecture of 60 students, you are a statistic. In a lab of 20, your absence is a spotlight.",
                    "**The Makeup Nightmare:** If you miss a theory class, you borrow notes. If you miss a lab, you have to request a 'Repeat Lab'. The lab assistant will hate you, the professor will grill you, and you might have to come on a Saturday."
                ]
            },
            {
                type: 'callout-info',
                content: "Calculation: A 2-hour lab missed is often counted as 2 missed slots. That hurts your percentage double the amount of a standard lecture."
            },
            {
                type: 'text',
                title: '3. The Proxy Network',
                content: "Don't rely on one best friend. If that friend gets sick, you are doomed. You need a decentralized proxy network."
            },
            {
                type: 'text',
                content: [
                    "**The Pact:** Form a group of 3-4 people who sit in different 'zones' of the classroom (Front-Left, Middle-Right, Back).",
                    "**Rotation:** Never let the same person call out your roll number twice in a row. Professors recognize voices.",
                    "**Timing:** The proxy should not be instant. Wait 1 second after the name is called. Natural human delay is key."
                ]
            },
            {
                type: 'text',
                title: '4. The Art of the Mass Bunk',
                content: "Mass bunks are a union negotiation. If the entire class (100% strength) agrees to skip, the professor often cancels the class rather than marking everyone absent. It preserves their ego."
            },
            {
                type: 'callout-warning',
                content: "The Snake Threat: A mass bunk fails if even ONE person shows up (The Snake). If 59 people are absent and 1 is present, the professor is obligated to take class and mark 59 absents. Peer pressure is essential here."
            },
            {
                type: 'text',
                title: '5. Strategic Sleeping',
                content: "If you have to choose between sleep and an 8 AM lecture where the prof just reads slides... choose sleep. Use Bunk Control to calculate if you can afford it. A well-rested study session is worth more than a zombie lecture attendance where you absorb nothing. Engineering is about efficiency, not blind compliance."
            }
        ]
    },
    {
        id: 'labs-vs-lectures',
        title: 'Labs vs Lectures: The Attendance Risk Analysis',
        subtitle: 'They are not created equal. Why missing a lab is a fatal error compared to a lecture.',
        date: 'July 30, 2024',
        readTime: '8 min read',
        author: 'A Sharma',
        category: 'Guide',
        icon: ChartBarIcon,
        color: 'from-purple-500 to-indigo-500',
        content: [
            {
                type: 'text',
                content: "Most students treat all attendance numbers the same. 75% in Math (Lecture) is viewed the same as 75% in Physics Lab. This is a rookie mistake that leads to detention. Understanding the mathematical and social differences between these two formats is key to survival."
            },
            {
                type: 'text',
                title: 'The Mathematical Disparity',
                content: "Labs are 'High Risk, High Reward'. Let's look at the numbers for a standard 15-week semester."
            },
            {
                type: 'code',
                content: "Total Lectures = 4 per week * 15 weeks = 60 classes\nTotal Labs = 1 per week * 15 weeks = 15 classes"
            },
            {
                type: 'text',
                content: [
                    "**Scenario A (Miss 3 Lectures):**",
                    "Attendance = 57 / 60 = **95%**. Result: Safe. No one cares.",
                    "**Scenario B (Miss 3 Labs):**",
                    "Attendance = 12 / 15 = **80%**. Result: Danger. You are one sick day away from the 75% cutoff."
                ]
            },
            {
                type: 'callout-info',
                content: "Insight: One lab absence does the same damage to your percentage as FOUR lecture absences. "
            },
            {
                type: 'text',
                title: 'The Internal Assessment Factor',
                content: "Theory classes usually have mid-terms and finals. Labs have 'Continuous Assessment'. This means you are graded *every single week*."
            },
            {
                type: 'list',
                content: [
                    "**Observation Notebook:** Needs to be signed same-day.",
                    "**Viva Voce:** The external examiner asks questions during the lab.",
                    "**Execution:** Did the code run? Did the chemical turn pink?"
                ]
            },
            {
                type: 'text',
                content: "If you miss a lab, you get a ZERO for that week's internal marks. Even if you attend the makeup lab later, you often lose the marks for 'Timeliness' or 'Record maintenance'. This directly lowers your grade point."
            },
            {
                type: 'text',
                title: 'Recovery Difficulty',
                content: "Recovering a missed lecture is effortless: ask a friend for notes, take a photo of the board, or watch a YouTube video on the topic (which is probably better than the lecture anyway). Recovering a missed lab involves bureaucracy."
            },
            {
                type: 'text',
                content: "You have to write a letter. You have to chase the professor for a signature. You have to find a free slot when the lab is open. You have to convince the lab assistant to issue you the equipment again. It is a logistical nightmare designed to punish you."
            },
            {
                type: 'callout-tip',
                content: "Golden Rule: Treat Lab attendance as mandatory (Target 100%). Use your 'bunks' exclusively for theory lectures where you can self-study."
            }
        ]
    },
    {
        id: 'talk-to-professors',
        title: 'The Art of Negotiation: Talking Your Way Out of Low Attendance',
        subtitle: 'How to ask for forgiveness without sounding entitled. Scripts included.',
        date: 'July 30, 2024',
        readTime: '11 min read',
        author: 'Faculty Insider',
        category: 'Tips',
        icon: UserGroupIcon,
        color: 'from-green-500 to-emerald-500',
        content: [
            {
                type: 'text',
                content: "You are at 68%. You need 75%. You have a medical certificate, but it's not enough. You need the professor to grant you attendance for classes you missed. This is a high-stakes negotiation. If you go in demanding rights, you will fail. If you go in begging, you might fail. You need a strategy."
            },
            {
                type: 'text',
                title: 'Rule #1: The Timing',
                content: "Never approach a professor immediately after class when they are surrounded by other students or rushing to the next lecture. Go to their office hours (cabin). If you catch them when they are relaxed and drinking tea, your chances of success double."
            },
            {
                type: 'text',
                title: 'Rule #2: Do Not Start with Entitlement',
                content: "Never say: 'I need attendance' or 'Why did you mark me absent?'\nAlways say: 'I am worried about my academic standing' or 'I want to ensure I don't miss out on learning.' Make it about the subject, not the metric."
            },
            {
                type: 'text',
                title: 'The "Extra Credit" Strategy',
                content: "Professors hate giving free handouts. It feels unethical to them. However, they love 'Academic Rigor'. Instead of asking for free attendance, ask for work."
            },
            {
                type: 'callout-tip',
                content: "The Ask: 'Professor, I know I missed those 3 classes due to [Reason]. I don't want to fall behind. Is there an extra assignment, a case study summary, or a presentation I can submit to demonstrate that I have caught up with the material?'"
            },
            {
                type: 'text',
                content: "This works because it gives them a valid excuse to mark you present. They can justify it as 'Compensatory Work'. Most of the time, they won't even make you do the work; they will appreciate the attitude and just fix the attendance."
            },
            {
                type: 'text',
                title: 'Script 1: The Office Visit',
                content: [
                    "**You:** Good Morning Sir/Ma'am. Do you have a moment?",
                    "**Prof:** Yes?",
                    "**You:** I wanted to discuss the last chapter on Thermodynamics. I was reviewing the notes from the classes I missed last week due to fever, and I had a specific doubt about Entropy...",
                    "*(Discuss the topic for 2 mins. Show you studied.)*",
                    "**You:** Thank you, that clears it up. Also, Sir, because I missed those classes, my attendance has dipped to the borderline. Since I have covered the topics, is it possible to consider my medical note for those dates? I really don't want to be detained in a subject I enjoy."
                ]
            },
            {
                type: 'text',
                title: 'Script 2: The Email (Formal)',
                content: "If you cannot meet in person, use this template. Keep it short, polite, and attach proof."
            },
            {
                type: 'code',
                content: `Subject: Request regarding attendance shortage in [Subject Code] - [Your Name]

Dear Professor [Name],

I hope you are having a good week.

I am writing to sincerely apologize for my recent absences in your class. Due to [Valid Reason: Health / Family Emergency / Competition], I was unable to attend from [Date] to [Date].

I have collected the notes from my peers and have completed the recent tutorial sheet to ensure I am up to speed.

I noticed my attendance is currently at 68%. I value your course and want to ensure I am eligible for the finals. I have attached my medical certificate here. Is there any remedial assignment I can undertake to make up for the missed hours?

Sincerely,
[Your Name]
[Roll Number]`
            },
            {
                type: 'text',
                title: 'Handling Rejection',
                content: "If they say no, accept it gracefully. 'I understand, Sir. I will make sure to be regular from now on.' Do not argue. An arguing student gets remembered for the wrong reasons. A polite student might get a 'grace' boost at the end of the semester when the prof is finalizing the list."
            }
        ]
    },
    {
        id: 'credits-and-weightage',
        title: 'GPA Hacking: Understanding Credits & Attendance Weightage',
        subtitle: 'Not all subjects affect your CGPA equally. Learn to prioritize your bunks for maximum grade protection.',
        date: 'July 31, 2024',
        readTime: '9 min read',
        author: 'A Sharma',
        category: 'Academic',
        icon: BookIcon,
        color: 'from-blue-600 to-indigo-600',
        content: [
            {
                type: 'text',
                content: "Attendance is often linked to grades. In some colleges, 90%+ attendance gets you 5 bonus marks. In others, it's just an eligibility criterion. But beyond attendance, you need to understand CREDITS to protect your CGPA."
            },
            {
                type: 'text',
                title: 'Credit Hours Explained',
                content: "A 4-credit course usually meets 4 times a week. A 2-credit course meets twice. Your CGPA is weighted by credits. Getting an 'A' grade in a 4-credit Math course boosts your GPA twice as much as an 'A' in a 2-credit English course."
            },
            {
                type: 'callout-info',
                content: "The Strategy: If you MUST skip a class to study for another, skip the LOW-credit course. The damage to your GPA if you fail a high-credit course due to attendance debarment is catastrophic."
            },
            {
                type: 'text',
                title: 'The Risk Hierarchy',
                content: "When you wake up late and have to decide which class to miss, use this hierarchy:"
            },
            {
                type: 'list',
                content: [
                    "**Tier 1 (Critical): 4-Credit Labs.** High failure risk, high GPA impact. NEVER MISS.",
                    "**Tier 2 (High): 4-Credit Core Subjects.** These are the 'Gatekeeper' courses (Maths, Data Structures, Circuits). If you get debarred here, you extend your degree.",
                    "**Tier 3 (Medium): 3-Credit Electives.** Important, but often easier to pass.",
                    "**Tier 4 (Low): 1-Credit Seminars/Humanities.** Low impact on GPA. These are your 'Buffer' bunks."
                ]
            },
            {
                type: 'text',
                title: 'The Attendance-Grade Correlation',
                content: "Data shows that students with >90% attendance get 80% of the 'A' grades. Why? It is not because they are smarter. It is because professors drop hints."
            },
            {
                type: 'text',
                content: "Professors often say things like: 'This concept is important' or 'I like this problem.' This translates to: 'This is question #3 on the final exam.' If you bunk, you miss the hint. You study the whole chapter, while the attendee studies just that one problem."
            },
            {
                type: 'text',
                title: 'When is it smart to sacrifice attendance?',
                content: "Attendance is a currency. Spend it wisely. Do not spend it on sleeping or scrolling Instagram. Spend it on High-ROI (Return on Investment) activities:"
            },
            {
                type: 'list',
                content: [
                    "**Internships:** Real-world experience > Classroom theory.",
                    "**Hackathons/Competitions:** Building a portfolio.",
                    "**Entrance Exams:** Preparing for GRE/CAT/GATE often requires skipping semester classes. This is a calculated risk."
                ]
            },
            {
                type: 'callout-warning',
                content: "The Trap: Don't skip class to 'study for that class'. It is inefficient. You will spend 4 hours self-studying what the professor explained in 1 hour."
            }
        ]
    },
    {
        id: 'safely-skip-guide',
        title: 'The Cheat Sheet: How Many Classes You Can Safely Skip',
        subtitle: 'The ultimate lookup table for skipping without anxiety. Based on standard semester structures.',
        date: 'Aug 01, 2024',
        readTime: '6 min read',
        author: 'Team Bunk Control',
        category: 'Guide',
        icon: TargetIcon,
        color: 'from-teal-500 to-cyan-500',
        content: [
            {
                type: 'text',
                content: "Don't want to do the math? We have done it for you. Below are cheat sheets for different university standards. These assume a standard semester of 40-50 lectures per subject. Use this to quickly check your safety margin before you turn off your alarm clock."
            },
            {
                type: 'text',
                title: 'Scenario 1: The 75% Rule (Standard)',
                content: "This is the most common requirement. You need 75% to sit for exams."
            },
            {
                type: 'list',
                content: [
                    "**Total 10 Classes Held:** You can miss MAX 2. (Attendance: 80%)",
                    "**Total 20 Classes Held:** You can miss MAX 5. (Attendance: 75%)",
                    "**Total 30 Classes Held:** You can miss MAX 7. (Attendance: 76.6%)",
                    "**Total 40 Classes Held:** You can miss MAX 10. (Attendance: 75%)",
                    "**Total 50 Classes Held:** You can miss MAX 12. (Attendance: 76%)",
                    "**Total 60 Classes Held:** You can miss MAX 15. (Attendance: 75%)"
                ]
            },
            {
                type: 'callout-warning',
                content: "Danger Zone: Once you miss 25% of classes (e.g., 10 out of 40), every single additional miss requires 3 consecutive attendances to recover just 1%."
            },
            {
                type: 'text',
                title: 'Scenario 2: The 80% Rule (Strict Colleges)',
                content: "Some nursing schools and strict engineering colleges demand 80%."
            },
            {
                type: 'list',
                content: [
                    "**Total 20 Classes:** You can miss MAX 4.",
                    "**Total 40 Classes:** You can miss MAX 8.",
                    "**Total 50 Classes:** You can miss MAX 10."
                ]
            },
            {
                type: 'text',
                title: 'Scenario 3: The 60% Rule (Relaxed / Medical)',
                content: "If you have a medical certificate, the requirement often drops to 60%."
            },
            {
                type: 'list',
                content: [
                    "**Total 20 Classes:** You can miss MAX 8.",
                    "**Total 40 Classes:** You can miss MAX 16.",
                    "**Total 50 Classes:** You can miss MAX 20."
                ]
            },
            {
                type: 'text',
                title: 'The "Buffer" Strategy',
                content: "Never aim for exactly 75%. That is living on the edge. One flat tire or one fever will detain you. Always aim for a **Safety Buffer of 5%** (Aim for 80%)."
            },
            {
                type: 'text',
                content: "This buffer is your insurance policy. It allows you to skip classes when you *really* need to—like for a family wedding or a severe burnout day—without panic."
            },
            {
                type: 'callout-tip',
                content: "Use the Bunk Control Dashboard. It calculates this dynamically for every subject every day, so you never have to use these tables manually. The 'Safe to Bunk' indicator will turn green when you have a buffer."
            }
        ]
    }
];