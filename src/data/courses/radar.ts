import type { Course } from '@/lib/types'

export const radarCourse: Course = {
  id: 'radar-v1',
  slug: 'radar',
  title: 'RADAR',
  subtitle: 'Getting More Sellers',
  description:
    'Master the RADAR system to identify and engage early-stage sellers before your competitors ever know they exist. This is not about cold calling — it is about being the trusted advisor already in the conversation when sellers are ready to move.',
  coverColor: '#F97316',
  coverImage: '/images/main-radar-thumb.png',
  sections: [
    // ============================================================
    // SECTION 1: MINDSET
    // ============================================================
    {
      id: 'section-mindset',
      title: 'Section 1: Mindset',
      description:
        'The foundation everything else is built on. If the mindset is wrong, nothing else works. Complete all lessons before advancing to tactics.',
      lessons: [
        {
          id: 'lesson-0-intro',
          title: 'Meet Your Instructor',
          type: 'intro',
          durationMinutes: 2,
          image: '/images/barry-celebrate.png',
          content: {
            instructorName: 'Barry Jenkins',
            instructorTitle: 'Head Realtor in Residence, Ylopo  ·  CMO, Better Homes and Gardens NAGR',
            instructorImage: '/images/Barry1.jpg',
            bio: "Barry Jenkins is a real estate team leader at LPT Realty, real estate investor, and a national coach focused on building high-performance sales systems that convert. He also helps lead an 80-agent brokerage and has spent over a decade helping agents generate, nurture, and close business at scale. As the Head Realtor in Residence at Ylopo, he specializes in AI-driven lead conversion and database monetization. He is also the author of Too Nice for Sales which has remained a best seller for the last several years in a row, and a sought-after speaker on practical, results-driven growth.",
            credentials: [
              { value: '#9', label: 'Real Trends 1,000' },
              { value: '~900', label: 'Units Sold / Year' },
              { value: '3', label: 'Teams in Virginia' },
              { value: '20 yrs', label: 'In Real Estate' },
            ],
            book: {
              title: 'Too Nice for Sales',
              subtitle: 'A Practical Guide to Ethical Lead Conversion',
              coverImage: '/images/too-nice-for-sales.jpg',
            },
            ctaLabel: 'Begin Training',
          },
        },
        {
          id: 'lesson-1-1',
          title: 'The RADAR Mindset — From "Always Be Closing" to "Always Be Consulting"',
          type: 'video',
          durationMinutes: 5,
          image: '/images/mindset.png',
          content: {
            vimeoId: '1181193890',
            description:
              'The foundational mindset shift that separates top performers from everyone else. This single lesson will change how you approach every conversation with a potential seller.',
            keyPoints: [
              '"Always Be Consulting" replaces "Always Be Closing" — permanently',
              'Your job is to build relationships, not chase listings',
              'The agent who builds trust first wins the listing',
            ],
          },
        },
        {
          id: 'lesson-1-2',
          title: 'Winning Mindset Drills',
          type: 'flashcard',
          durationMinutes: 5,
          image: '/images/radar-flashcards-mindset.png',
          content: {
            intro:
              'Rapid-fire flashcards that train how you think, respond, and show up. Master the mindset that separates top performers from everyone else.',
            cards: [
              {
                id: 'fc-1',
                question: "In the RADAR program, what does the acronym 'ABC' stand for?",
                answer: 'Always Be Consulting.',
              },
              {
                id: 'fc-2',
                question:
                  "What is the primary psychological shift required when moving from a 'closing' mindset to a 'consulting' mindset?",
                answer:
                  'Focusing on building a relationship rather than pressuring for an immediate listing or sale.',
              },
              {
                id: 'fc-3',
                question:
                  'According to the RADAR Mastermind, the goal for every call should be to build a relationship with a _____.',
                answer: 'Human being.',
              },
              {
                id: 'fc-4',
                question:
                  "Why is the 'Consultant' role particularly effective for homeowners compared to stock portfolio owners?",
                answer:
                  'Most consumers lack a trusted tool or advisor to help them track the value of their largest asset — their home.',
              },
              {
                id: 'fc-5',
                question:
                  "What 'superpower' is recommended for agents to surface a lead's real story and motivation?",
                answer: 'Curiosity.',
              },
              {
                id: 'fc-6',
                question:
                  "Instead of trying to 'overcome' an objection, agents should seek to _____ it.",
                answer: 'Understand it.',
              },
              {
                id: 'fc-7',
                question: 'What is the three-step framework for handling resistance on a call?',
                answer: 'Affirm → Seek to Understand → Value-First Pivot.',
              },
              {
                id: 'fc-8',
                question: "What does 'Normalizing Not Ready' mean?",
                answer:
                  "Accepting that most leads won't be ready to sell immediately — to prevent the agent from entering fight-or-flight mode.",
              },
              {
                id: 'fc-9',
                question:
                  'A homeowner says, "We\'re probably about a year away from selling." What is the best next response based on the RADAR mindset?',
                answer:
                  '"Totally makes sense. Just curious — how did you decide on a year?"',
              },
              {
                id: 'fc-10',
                question: "When you argue with a lead, they _____.",
                answer: 'Defend.',
              },
            ],
          },
        },
        {
          id: 'lesson-1-mindset-videos',
          title: 'Mindset Short Videos',
          type: 'video-collection',
          durationMinutes: 25,
          content: {
            intro:
              "These are the golden nuggets — short clips pulled directly from Barry's Big Mastermind sessions. Watch each one, absorb the coaching, and carry it into your next call.",
            videos: [
              {
                title: 'ABC',
                vimeoId: '1177384833',
              },
              {
                title: 'Stop Being a Waiter',
                vimeoId: '1177385201',
              },
              {
                title: "When They Say I'm Not Ready",
                vimeoId: '1177385446',
              },
              {
                title: "Don't Take No Personally",
                vimeoId: '1177385010',
              },
              {
                title: 'The Neuroscience of Courage in Sales',
                vimeoId: '1177726386',
              },
              {
                title: 'Growth Lives in Hard Things',
                vimeoId: '1177743903',
              },
              {
                title: "Stop Worrying About Bothering People",
                vimeoId: '1177745274',
              },
            ],
          },
        },
        {
          id: 'lesson-1-quiz',
          title: 'Mindset Module Quiz',
          type: 'quiz',
          durationMinutes: 10,
          image: '/images/quiz.png',
          content: {
            intro:
              "Time to lock it in. This 10-question quiz covers everything from the RADAR mindset shift to objection handling, courage, and the consulting framework. You need 70% or better to complete the Mindset Module and advance to tactics.",
            passingScore: 70,
            questions: [
              {
                id: 'mq-1',
                question:
                  "What is the primary mindset shift proposed by the RADAR program to replace the traditional 'ABC' of sales?",
                options: [
                  'Always Be Collecting',
                  'Always Be Closing',
                  'Always Be Cold-calling',
                  'Always Be Consulting',
                ],
                correctIndex: 3,
                explanation:
                  'This shift emphasizes providing value as a trusted advisor and resource rather than pressuring the homeowner for an immediate sale.',
              },
              {
                id: 'mq-2',
                question:
                  "According to the source material, why might 'timid' agents actually outperform aggressive ones in this consultative model?",
                options: [
                  'They avoid uncomfortable conversations, which homeowners find more appealing.',
                  'They spend more time researching property data before making the first call.',
                  'They are naturally better at memorizing complex scripts for every scenario.',
                  'They are motivated by service and making people happy rather than personal gain.',
                ],
                correctIndex: 3,
                explanation:
                  "Once they overcome their need for personal acceptance, their natural inclination toward service allows them to build deeper trust with leads.",
              },
              {
                id: 'mq-3',
                question:
                  "In the 'Australia Shoes' story used in the Mastermind, what is the key takeaway regarding an agent's success?",
                options: [
                  'Lowering prices is necessary when a market lacks immediate demand.',
                  "Success is determined by the agent's perception of the opportunity.",
                  'Geographic location is the primary driver of high propensity sellers.',
                  'The quality of the leads is the only factor in determining a listing agreement.',
                ],
                correctIndex: 1,
                explanation:
                  "The story illustrates that two people can see the same lack of immediate results as either a disaster or the greatest opportunity ever.",
              },
              {
                id: 'mq-4',
                question:
                  "What is the psychological consequence of an agent attempting to 'argue' against a lead's objection?",
                options: [
                  "The agent will be perceived as a more authoritative 'closer.'",
                  'The lead will instinctively defend their original position.',
                  "The lead will acknowledge the agent's superior market knowledge.",
                  'The lead will feel pressured and immediately book an appointment.',
                ],
                correctIndex: 1,
                explanation:
                  "The training notes that when you argue, people defend — whereas when you affirm, you lower their resistance.",
              },
              {
                id: 'mq-5',
                question:
                  "How does the training define 'courage' for agents who are nervous about calling strangers?",
                options: [
                  'The ability to follow a script so perfectly that rejection becomes impossible.',
                  'The state of finally feeling no anxiety before starting a call block.',
                  'The confidence that comes from knowing every detail about a property.',
                  'The decision to take action while still feeling nervous or uncomfortable.',
                ],
                correctIndex: 3,
                explanation:
                  "The material emphasizes that it is normal to be scared and that courage is simply proceeding despite that feeling.",
              },
              {
                id: 'mq-6',
                question:
                  'According to the mindset module, what is the ultimate goal of every call with a homeowner?',
                options: [
                  'To build a relationship with a human being.',
                  'To obtain a signed listing agreement during the first conversation.',
                  'To prove that the AI assistant provided accurate information.',
                  "To convince the homeowner to move their timeline forward.",
                ],
                correctIndex: 0,
                explanation:
                  "Since most people are not ready to sell today, the immediate priority is establishing a long-term connection.",
              },
              {
                id: 'mq-7',
                question:
                  "What is the intended result of 'Normalizing Not Ready' during a conversation with a seller?",
                options: [
                  'It encourages the homeowner to list their home sooner than they intended.',
                  "It keeps the agent's nervous system calm and makes the homeowner feel safe.",
                  'It allows the agent to end the call quickly and move to more motivated leads.',
                  'It signals to the lead that the agent is not interested in their business yet.',
                ],
                correctIndex: 1,
                explanation:
                  "By accepting that the homeowner isn't ready, the agent avoids 'fight or flight' mode and keeps the conversation authentic.",
              },
              {
                id: 'mq-8',
                question:
                  "Barry Jenkins mentions that for most Americans, their home represents their largest net worth asset. What mindset should this trigger in the agent?",
                options: [
                  'They should pressure the homeowner to sell before their equity decreases.',
                  "They should provide a trusted tool to track that asset, similar to a stock portfolio.",
                  'They should remind the homeowner of the high risk of market crashes.',
                  "They should charge a fee for the 'free' consulting services provided.",
                ],
                correctIndex: 1,
                explanation:
                  "Agents provide value by becoming the consultant who helps the consumer monitor and manage their most significant financial asset.",
              },
              {
                id: 'mq-9',
                question:
                  "What does the 'Waiter/Waitress' analogy describe in the context of proactive lead conversion?",
                options: [
                  "Agents who only work with leads who are ready to list their home 'today.'",
                  "Agents who only wait to be told what the 'order' (the listing) is.",
                  'Agents who provide high-quality concierge service to their existing clients.',
                  'Agents who facilitate introductions between buyers and sellers in a neighborhood.',
                ],
                correctIndex: 1,
                explanation:
                  "Successful agents must create the need for their involvement by being curious and finding opportunities to add value.",
              },
              {
                id: 'mq-10',
                question:
                  "Why does the Mastermind suggest that agents should 'celebrate failure' within their teams?",
                options: [
                  'To reward agents who fail so they do not feel pressured to succeed.',
                  'To identify which agents are not following the provided scripts.',
                  'To document common homeowner objections for future marketing materials.',
                  'To hack the negative self-talk that prevents agents from trying new things.',
                ],
                correctIndex: 3,
                explanation:
                  "By changing the perspective on failure, agents avoid the shame that leads to quitting and instead focus on the 'reps' needed for growth.",
              },
            ],
          },
        },
      ],
    },

    // ============================================================
    // SECTION 2: TACTICAL
    // ============================================================
    {
      id: 'section-tactical',
      title: 'Section 2: Tactical',
      description:
        'What to say, how to say it, and how to handle real conversations. Each lesson pairs a short video with a mandatory Maverick practice call. You must score ≥ 8 to advance.',
      lessons: [
        {
          id: 'lesson-1-3',
          title: 'Live RADAR Roleplay Training',
          type: 'roleplay',
          durationMinutes: 10,
          image: '/images/ai-roleplay.png',
          content: {
            intro:
              'This is where everything comes together. Inside the RADAR Roleplay Lab, you\'ll practice real conversations with a live AI simulator that mirrors actual seller objections and scenarios. This is the closest thing to a real RADAR call — without the pressure. Your goal is simple: apply the "Always Be Consulting" mindset, stay calm and curious, and work your way to an 8 out of 10 or higher. Repeat until it feels natural — because this is where confidence is built.',
            script: `You're speaking with a homeowner who recently checked their home value online.

---

HOMEOWNER: "Hello?"

YOU: "Hi [Name] — this is [Your Name] with [Your Team]. I'm reaching out because you took a look at your home's value recently, and I just wanted to quickly introduce myself as your go-to resource for the market. Is this a good time for just two minutes?"

HOMEOWNER: "Sure, but I should let you know — we're not planning to sell anytime soon."

YOU: "That's completely fine — most people I connect with aren't. Honestly, that's not why I'm calling. I just want to make sure that when the time does come, you have someone who actually knows your neighborhood and isn't just guessing at numbers. When was the last time anyone gave you a real breakdown of what's happening with values in your area?"

HOMEOWNER: "Not recently... maybe a couple years ago."

YOU: "That's pretty common. The market has shifted quite a bit since then — some neighborhoods are up, some have softened. Either way, you deserve to know exactly where you stand. It's your biggest asset. Would it be okay if I put together a quick, no-pressure market snapshot for your home — just so you have it?"

HOMEOWNER: "I guess that would be fine."

YOU: "Perfect. I'll make it simple and useful — no fluff. And if things ever change on your end, you'll already know me and trust the information I'm bringing you. That's really all this is."

---

Goal: Keep the conversation low-pressure, curiosity-driven, and value-first. No pitch. No close. Just consulting.`,
            phoneNumber: '(555) 555-0100',
            callInstructions:
              'Call this number and you\'ll be connected to the RADAR Roleplay AI. Introduce yourself as an agent and the AI will respond as a homeowner. Work through the conversation using the script above as your guide. Stay curious, keep it low-pressure, and focus on being the consultant — not the salesperson. When the call ends, score yourself honestly below.',
            minimumScore: 8,
            remediation:
              'An 8 means the call felt smooth, natural, and genuinely consultant-like — not perfect, but solid. Review the script and pinpoint where you felt rushed or fell into closing mode. Call again and focus on that one moment. Most agents need 2–3 rounds before it clicks. That repetition is exactly the point.',
          },
        },
        {
          id: 'lesson-2-arcade-1',
          title: 'Walkthrough of the Ylopo Seller Report',
          type: 'embed',
          durationMinutes: 3,
          image: '/images/seller-report-walkthrough.png',
          content: {
            description:
              "An agent working RADAR leads is building a relationship with homeowners to earn that listing. A key part of that relationship is the YLOPO Seller Report — a powerful tool that keeps you top of mind and positions you as their trusted market advisor. Go through this three-minute interactive walkthrough so you understand the value of each section within the report.",
            embedHtml: `<div style="position: relative; padding-bottom: calc(45.2604% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/gzLHC8kQA5oMnu7blYRu?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Walkthrough of the Ylopo Seller Report" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;"></iframe></div>`,
            durationLabel: '2-3 minutes to complete',
          },
        },
        {
          id: 'lesson-2-arcade-2',
          title: 'Create a Seller Alert for a Lead in Stars',
          type: 'embed',
          durationMinutes: 2,
          image: '/images/creating-a-seller-report.png',
          content: {
            description:
              "Now that you know what the Seller Report delivers, here's how to set one up. This step-by-step walkthrough shows you exactly how to create a Seller Alert inside STARS. It takes about two minutes — follow each step so you can do this confidently for every RADAR lead you work.",
            embedHtml: `<div style="position: relative; padding-bottom: calc(48.6458% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/yXwzm80DHqKBacZdbwlX?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Create a Seller Alert for a Lead in Stars" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;"></iframe></div>`,
            durationLabel: '1 minute to complete',
          },
        },
        {
          id: 'lesson-2-1',
          title: 'The Opening Script',
          type: 'video',
          durationMinutes: 3,
          content: {
            vimeoId: '',
            description:
              "The first 15 seconds of every call determine everything. Here's the exact language that opens doors without triggering resistance.",
            keyPoints: [
              'Lead with curiosity — never pitch',
              'Name the system (RADAR) — it builds instant credibility',
              'Your tone matters more than your exact words',
            ],
          },
        },
        {
          id: 'lesson-2-2',
          title: 'Practice: The Opening Script',
          type: 'roleplay',
          durationMinutes: 10,
          content: {
            intro:
              "You've watched the script. Now you need to own it. The only way to own a script is to say it out loud — to a real system that gives you honest feedback. Call the Maverick practice line below.",
            script: `"Hi, is this [Name]?

Hey, this is [Your Name] — I work with a system called RADAR that identifies homeowners in [Area] who may be thinking about selling in the next few months.

I'm not calling to pressure you at all — I just wanted to reach out, introduce myself, and see if it would be valuable to keep you updated on what's happening with home values in your neighborhood.

Would a quarterly market update be useful to you?"`,
            phoneNumber: '(555) 000-MVRK',
            callInstructions:
              "Call the Maverick practice line. Run through the opening script exactly as written above. When you're done, score yourself honestly using the criteria on the right. Be tough — an 8 means it was genuinely smooth and natural.",
            minimumScore: 8,
            remediation:
              'If you scored below 8, re-watch the video lesson, then call again. Most agents need 2–3 attempts before it feels natural. That is completely normal.',
          },
        },
        {
          id: 'lesson-2-3',
          title: "Handling \"I'm Not Ready\" and \"I'm Not Interested\"",
          type: 'video',
          durationMinutes: 3,
          content: {
            vimeoId: '',
            description:
              "These are the two most common responses. They are not rejections — they are invitations. Here's exactly how to respond without pressure, without argument, and without losing the relationship.",
            keyPoints: [
              '"Not interested" means they don\'t know you yet — that\'s fixable',
              '"Not ready" means you have time to build trust — that\'s the opportunity',
              'Never argue. Affirm and redirect.',
            ],
          },
        },
        {
          id: 'lesson-2-4',
          title: 'Practice: Handling Resistance',
          type: 'roleplay',
          durationMinutes: 10,
          content: {
            intro:
              "Practice responding to resistance using the framework below. A Maverick coach will play the role of a hesitant homeowner.",
            script: `LEAD: "I'm not really interested" / "I'm not ready to sell yet."

YOU: "Oh, completely — I totally get that. Can I ask, when you say not ready, what does your timeline actually look like? Just curious."

[LEAD responds with their timeline]

YOU: "That makes total sense. Honestly, planning ahead is the smartest thing you can do — most people wait too long and then feel rushed.

I'm not here to push anything at all. I work with a lot of homeowners who are 6–12 months out and just want to stay informed on what their home is worth. Would it be okay if I sent you a quick market update every quarter? No calls, no pressure — just the data."`,
            phoneNumber: '(555) 000-MVRK',
            callInstructions:
              'Call the Maverick line. Practice the full resistance framework. Score yourself: did you affirm without sounding fake? Did you ask a genuine question? Did you pivot to value without any pressure?',
            minimumScore: 8,
            remediation:
              "The most common mistake: arguing or over-explaining. If you scored below 8, you likely pushed too hard. Watch the video again and focus on what 'affirm' really means.",
          },
        },
        {
          id: 'lesson-2-5',
          title: 'The 3-Step Resistance Framework',
          type: 'video',
          durationMinutes: 3,
          content: {
            vimeoId: '',
            description:
              'Affirm. Seek to Understand. Value-First Pivot. Three steps. Every time. No exceptions. This framework works on every objection you will ever encounter.',
            keyPoints: [
              'Step 1 — Affirm: validate their position without agreeing to go away',
              "Step 2 — Seek to Understand: ask a genuine question about their situation",
              'Step 3 — Value-First Pivot: offer something useful with zero strings attached',
            ],
          },
        },
        {
          id: 'lesson-2-6',
          title: 'Practice: Full Conversation',
          type: 'roleplay',
          durationMinutes: 15,
          content: {
            intro:
              "This is your capstone tactical call. You'll run a complete conversation from first hello to a reason to follow up. Hit all five beats to pass.",
            script: `FULL CONVERSATION — 5 BEATS TO HIT:

1. OPEN WITH CURIOSITY
   Introduce yourself + RADAR. Ask if staying informed on values would be useful.

2. HANDLE RESISTANCE (if it comes)
   Affirm → Seek to Understand → Value-First Pivot

3. SURFACE THEIR REAL TIMELINE
   "Can I ask — do you have any sense of when you'd want to make a move, even loosely?"

4. CLASSIFY THEM (internal — don't say this out loud)
   0–3 months = Hot | 3–9 months = Warm | 9+ months = Cold

5. BOOK A REASON TO FOLLOW UP
   "I'll shoot you over a market update for [Area] this week — what's the best email for you?"`,
            phoneNumber: '(555) 000-MVRK',
            callInstructions:
              "Run a complete conversation. Hit all 5 beats. Score yourself at the end. You must score ≥ 8 to unlock Section 3. If you miss any beat, that's your gap — drill it.",
            minimumScore: 8,
            remediation:
              "If you're under 8, identify which beat you missed. Go back to that specific lesson, re-watch, and call again targeting that one thing. Precision over volume.",
          },
        },
      ],
    },

    // ============================================================
    // SECTION 3: NURTURE & OPERATIONS
    // ============================================================
    {
      id: 'section-nurture',
      title: 'Section 3: Nurture & Operations',
      description:
        "What happens after the first conversation? This is where most agents drop the ball. You won't.",
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'Lead Classification: Hot, Warm, and Cold',
          type: 'video',
          durationMinutes: 3,
          content: {
            vimeoId: '',
            description:
              'Not every lead is created equal. How you classify them in the first conversation determines your entire follow-up strategy. Getting this wrong wastes time and burns relationships.',
            keyPoints: [
              'Hot: 0–3 months out, motivated, engaged — weekly contact',
              'Warm: 3–9 months out, open, building trust — bi-weekly touchpoints',
              'Cold: 9+ months or vague timeline — monthly, low-friction nurture',
            ],
          },
        },
        {
          id: 'lesson-3-2',
          title: 'Lead Classification Quiz',
          type: 'quiz',
          durationMinutes: 5,
          content: {
            intro:
              "Classify each scenario as Hot, Warm, or Cold. You need 70% or better to pass. Think about how you'd actually respond — not just what the 'right' answer sounds like.",
            passingScore: 70,
            questions: [
              {
                id: 'q-1',
                question:
                  "A seller says: \"We're thinking about listing in the spring, probably April or May.\" It's currently January.",
                options: [
                  'Hot — follow up weekly',
                  'Warm — consistent touchpoints every 2–3 weeks',
                  'Cold — monthly nurture only',
                  'Disqualify — too far out',
                ],
                correctIndex: 1,
                explanation:
                  "April/May from January is 3–4 months out. That's Warm — engaged but not urgent. Bi-weekly value touchpoints.",
              },
              {
                id: 'q-2',
                question:
                  "A seller says: \"We need to sell before school starts.\" It's currently June.",
                options: [
                  'Hot — follow up weekly',
                  'Warm — bi-weekly',
                  'Cold — monthly nurture',
                  'Disqualify',
                ],
                correctIndex: 0,
                explanation:
                  "School starts in 6–8 weeks. This is Hot — hard deadline, real urgency. Weekly contact minimum.",
              },
              {
                id: 'q-3',
                question:
                  "A seller says: \"We've thought about it but nothing's decided yet. Maybe next year sometime.\"",
                options: [
                  'Hot',
                  'Warm',
                  'Cold — long-term nurture',
                  'Disqualify',
                ],
                correctIndex: 2,
                explanation:
                  "\"Maybe next year sometime\" = 12+ months and vague. Cold. Stay in the rotation — don't abandon them, but don't over-invest either.",
              },
              {
                id: 'q-4',
                question:
                  "A seller says: \"We're actively interviewing agents right now.\"",
                options: [
                  'Hot — immediate action required',
                  'Warm',
                  'Cold',
                  'Already lost — move on',
                ],
                correctIndex: 0,
                explanation:
                  "Interviewing agents = listing is imminent. This is Hot. Act today, not tomorrow.",
              },
              {
                id: 'q-5',
                question: "A seller says they're 6 months out from selling.",
                options: ['Hot', 'Warm', 'Cold', 'Need more info'],
                correctIndex: 1,
                explanation:
                  "6 months = Warm. Consistent touchpoints every 2–3 weeks to build the relationship before they're ready.",
              },
              {
                id: 'q-6',
                question:
                  "A seller says: \"Our youngest just graduated. We're ready to downsize — just haven't pulled the trigger yet.\"",
                options: [
                  'Hot — they are emotionally ready',
                  'Warm',
                  'Cold',
                  'Disqualify — no hard timeline',
                ],
                correctIndex: 0,
                explanation:
                  "Life event has happened, emotional trigger is live. \"Haven't pulled the trigger\" often means they need clarity, not months. Treat as Hot.",
              },
              {
                id: 'q-7',
                question:
                  "A seller says: \"We refinanced 18 months ago at a great rate. We're not going anywhere for at least 2 years.\"",
                options: [
                  'Hot',
                  'Warm',
                  'Cold — long-term nurture',
                  'Disqualify — never selling',
                ],
                correctIndex: 2,
                explanation:
                  "Rate lock + 2-year horizon = Cold. Don't abandon — stay in their orbit. Circumstances change.",
              },
              {
                id: 'q-8',
                question: 'Which follow-up frequency is correct for a Hot lead?',
                options: ['Monthly', 'Every 2–3 weeks', 'Weekly', 'Only when they reach out'],
                correctIndex: 2,
                explanation:
                  "Hot leads need weekly contact. They're close to decision — visibility matters. Being absent = being forgotten.",
              },
              {
                id: 'q-9',
                question:
                  'A seller is Warm. Which follow-up approach is most appropriate?',
                options: [
                  'High-pressure weekly calls',
                  'Consistent value-add touchpoints every 2–3 weeks',
                  'Monthly newsletter only',
                  'Wait for them to reach out',
                ],
                correctIndex: 1,
                explanation:
                  "Warm leads need consistent value — not pressure. Show up with useful info every 2–3 weeks. Build trust before they need you.",
              },
              {
                id: 'q-10',
                question: 'What is the danger of treating a Cold lead like a Hot lead?',
                options: [
                  "You'll miss other opportunities",
                  "You'll burn the relationship with pressure",
                  "You'll spend too much on marketing",
                  'All of the above',
                ],
                correctIndex: 1,
                explanation:
                  "Pressure on a Cold lead breaks trust. They'll avoid you when they're actually ready to move. Patience is the strategy.",
              },
            ],
          },
        },
        {
          id: 'lesson-3-3',
          title: 'The Follow-Up Cadence That Wins Listings',
          type: 'video',
          durationMinutes: 3,
          content: {
            vimeoId: '',
            description:
              "Most agents follow up twice and give up. Winners are still in the conversation 90 days later — with value, not pressure. Here's the exact cadence that works.",
            keyPoints: [
              'Hot: weekly, high-touch, stay visible and available',
              'Warm: bi-weekly, value-add — market updates, neighborhood data',
              'Cold: monthly, low friction — stay relevant without being annoying',
            ],
          },
        },
      ],
    },

    // ============================================================
    // SECTION 4: SCRIPTS
    // ============================================================
    {
      id: 'section-scripts',
      title: 'Section 4: Scripts',
      description:
        'The complete call from first word to next step. These lessons give you the exact language, the scenarios, and the reps to deliver every RaiDAR call with confidence and zero pressure.',
      lessons: [
        {
          id: 'lesson-4-1',
          title: 'The Purpose and Vibe of the RaiDAR Call',
          type: 'flashcard',
          durationMinutes: 7,
          content: {
            intro:
              'Before you touch a script, you need to own the mindset behind it. These cards cover what the RaiDAR call is actually trying to accomplish — and what it is not. Get this foundation right and the words will land naturally.',
            cards: [
              {
                id: 'sc-1',
                question: 'What is the primary purpose of the RaiDAR follow-up call?',
                answer:
                  'To continue the conversation the AI assistant started over text — casually and without pressure. Not to pitch or close.',
              },
              {
                id: 'sc-2',
                question: 'What three things should a RaiDAR call accomplish if done well?',
                answer:
                  'Press into curiosity, normalize "not ready," and ask thoughtful questions that help the homeowner avoid bad decisions.',
              },
              {
                id: 'sc-3',
                question: 'If the call is done right, what happens naturally at the end?',
                answer:
                  "Trust builds and next steps happen on their own — the agent doesn't have to force them.",
              },
              {
                id: 'sc-4',
                question: 'How should the vibe of a RaiDAR call feel to the homeowner?',
                answer:
                  'Casual and unexpected — like a natural continuation of a conversation, not a sales call.',
              },
              {
                id: 'sc-5',
                question: 'What is "success" on a RaiDAR call? (It is not always an appointment.)',
                answer:
                  'Clear timeline understanding + clear motivation + trust built + continued engagement. An appointment is a bonus, not the goal.',
              },
              {
                id: 'sc-6',
                question: 'Why does normalizing "not ready" benefit the agent, not just the homeowner?',
                answer:
                  "It keeps the agent's nervous system calm, prevents fight-or-flight mode, and makes the conversation feel authentic rather than desperate.",
              },
              {
                id: 'sc-7',
                question:
                  'True or false: The goal of a RaiDAR call is to convince the homeowner to move their timeline forward.',
                answer:
                  'False. The goal is to understand where they are and stay in their orbit as a trusted resource — not to push them faster than they\'re ready.',
              },
            ],
          },
        },
        {
          id: 'lesson-4-2',
          title: 'Opening the Call and Disarming the Lead',
          type: 'flashcard',
          durationMinutes: 8,
          content: {
            intro:
              'The first 15 seconds determine everything. These cards drill the exact opening language — and the disarming frame that immediately lowers resistance. Commit these to memory.',
            cards: [
              {
                id: 'sc-8',
                question: 'What is the correct opening line for a RaiDAR call?',
                answer:
                  '"Hey [First Name], this is [Agent Name]. I saw my assistant was texting with you about some information on your home, so I wanted to continue that conversation for a minute." [Pause]',
              },
              {
                id: 'sc-9',
                question: 'What are two things the agent must NOT do at the opening of a RaiDAR call?',
                answer: 'Do NOT apologize. Do NOT ask permission to sell.',
              },
              {
                id: 'sc-10',
                question:
                  'What should the agent anchor to at the top of the call instead of leading with a pitch?',
                answer:
                  'The text conversation that already happened — this creates continuity and legitimacy rather than a cold start.',
              },
              {
                id: 'sc-11',
                question: 'If the homeowner sounds hesitant after the opening, what is the correct response?',
                answer: '"Totally fine, I\'ll keep this short." — Acknowledge it, don\'t push through it.',
              },
              {
                id: 'sc-12',
                question: 'What is the "disarming frame" line used after the opening?',
                answer:
                  '"I\'m sure you aren\'t ready to sell any time soon, but have you thought at all about moving in the next year or so?"',
              },
              {
                id: 'sc-13',
                question: 'Why does the disarming frame work psychologically?',
                answer:
                  'It assumes "not ready" as the default, making it safe for the homeowner to say either yes or no. It invites honesty rather than triggering defensiveness.',
              },
              {
                id: 'sc-14',
                question:
                  'Why does the disarming frame invite more candid responses than asking "Are you thinking about selling?"',
                answer:
                  "Because it removes the implied pressure to say yes. The homeowner doesn't feel like they're being recruited — they feel like they're being consulted.",
              },
              {
                id: 'sc-15',
                question:
                  'After delivering the disarming frame question, what should the agent do?',
                answer: 'Pause. Let the question land. Do not fill the silence.',
              },
            ],
          },
        },
        {
          id: 'lesson-4-3',
          title: 'Reading the Text Response — 4 Scenarios',
          type: 'flashcard',
          durationMinutes: 10,
          content: {
            intro:
              "Every RaiDAR call starts from a specific text exchange. The lead already said something — your job is to pick up exactly where that thread left off. These 4 scenarios cover every major entry point. Know which one you're in before you dial.",
            cards: [
              {
                id: 'sc-16',
                question:
                  'The lead responded to a pricing or home value text. What is the correct connector question?',
                answer:
                  '"I saw my assistant sent you some pricing information. What stood out to you when you looked at that?"',
              },
              {
                id: 'sc-17',
                question:
                  'The lead responded to the pricing text and said the price seemed high. What is a strong follow-up?',
                answer:
                  '"How did you decide that felt high?" — Don\'t argue. Get curious about how they landed on that assessment.',
              },
              {
                id: 'sc-18',
                question:
                  'The lead responded to a pricing text and seemed interested. What is a strong follow-up to deepen the conversation?',
                answer: '"Tell me more about that." — Then stop talking. Let them fill the silence.',
              },
              {
                id: 'sc-19',
                question:
                  'The lead responded to an agent comparison text. What is the correct connector question?',
                answer:
                  '"I saw you were open to information about local agents. What made you curious about that specifically?"',
              },
              {
                id: 'sc-20',
                question:
                  "After a lead responds to the agent comparison text, how do you determine if they're researching or actively deciding?",
                answer:
                  '"Are you comparing options, or just educating yourself right now?" — This separates browsers from buyers without pressure.',
              },
              {
                id: 'sc-21',
                question:
                  'The lead responded "maybe" or "just looking." What question do you use to unpack what that actually means?',
                answer:
                  '"When you say \'just looking,\' what does that actually mean for you right now?"',
              },
              {
                id: 'sc-22',
                question:
                  'A lead in the "just looking" scenario seems uncertain. What question distinguishes timing uncertainty from market uncertainty?',
                answer:
                  '"Is that more about timing, or uncertainty about the market?" — Then follow wherever their answer leads.',
              },
              {
                id: 'sc-23',
                question:
                  'A "just looking" lead needs a push toward imagining a real future. What question creates that?',
                answer:
                  '"What would need to change for this to feel more real?" — It invites them to define their own trigger, not yours.',
              },
              {
                id: 'sc-24',
                question:
                  'The lead responded to a "home valuer" text mentioning a price that would make moving worth it. What is the correct connector question?',
                answer:
                  '"You mentioned a price that would make moving worth it. How did you land on that number?"',
              },
              {
                id: 'sc-25',
                question:
                  "For the home valuer scenario, how do you determine if the lead's magic number is based on lifestyle or market data?",
                answer:
                  '"Is that based on lifestyle goals or what you\'ve seen in the market?" — This reveals whether they have a real anchor or an emotional one.',
              },
              {
                id: 'sc-26',
                question:
                  'After establishing the lead\'s magic number in the home valuer scenario, what is the best forward-looking question?',
                answer:
                  '"If the market supported that number, what would you want to do next?" — It moves them from aspiration to action without pressure.',
              },
            ],
          },
        },
        {
          id: 'lesson-4-4',
          title: 'Power Phrases, Normalizing, and Value Statement',
          type: 'flashcard',
          durationMinutes: 6,
          content: {
            intro:
              'Three short sections that do heavy lifting in the middle of every call: the power phrases that keep conversations open, the normalizing language that builds trust, and the value statement that positions you as a resource rather than a salesperson.',
            cards: [
              {
                id: 'sc-27',
                question:
                  'What are the three core power phrases used to keep a conversation going without pushing?',
                answer:
                  '"Tell me more about that." / "How did you decide that was the right timing?" / "What makes that important to you?"',
              },
              {
                id: 'sc-28',
                question: "After asking a power phrase question, what is the agent's only job?",
                answer:
                  "Stop talking. Find their story. The silence belongs to the homeowner.",
              },
              {
                id: 'sc-29',
                question: 'What is the exact "normalizing not ready" line used mid-call?',
                answer:
                  '"I\'m actually glad to hear you\'re not ready to sell yet. I specialize in helping people who aren\'t ready. Most people I work with just want clarity before they make any decisions." [Pause. Let that land.]',
              },
              {
                id: 'sc-30',
                question:
                  'Why does saying "I\'m glad you\'re not ready" create more trust than trying to move the lead forward?',
                answer:
                  'It signals that the agent is not threatened by their timeline and has no agenda to push — which makes the homeowner more willing to open up.',
              },
              {
                id: 'sc-31',
                question:
                  'What is the value statement script used to explain what the agent does — without pitching a listing?',
                answer:
                  '"What I normally do is a walkthrough of a client\'s home, in person or virtual, and look at it the way a buyer would. The goal is to help you avoid spending money on repairs or upgrades that won\'t give you a return."',
              },
              {
                id: 'sc-32',
                question:
                  'What is the value statement framed around — and what is it explicitly NOT framed around?',
                answer:
                  'Framed around preventing wasted money. NOT framed around pushing a sale or getting a listing.',
              },
              {
                id: 'sc-33',
                question: 'What outcome does the walkthrough value statement offer the homeowner?',
                answer:
                  "Clarity and protection — knowing which repairs to skip so they don't waste money when the time comes.",
              },
            ],
          },
        },
        {
          id: 'lesson-4-5',
          title: 'Transition, Close, and the 8-Day Drip',
          type: 'flashcard',
          durationMinutes: 8,
          content: {
            intro:
              'How to move from a good conversation to a clear next step — and what happens after the call ends. These cards cover the transition to next steps, the call close, and every day of the 8-day text drip sequence.',
            cards: [
              {
                id: 'sc-34',
                question: 'What is the transition script used to propose next steps without pressure?',
                answer:
                  '"If it would be helpful, the next step for most people at your stage is just a quick walkthrough to get clarity. No pressure, no listing conversation. Would that actually be useful for you, or not yet?"',
              },
              {
                id: 'sc-35',
                question: 'What is the correct response if the homeowner says no to the walkthrough?',
                answer:
                  '"That\'s totally fine. Then staying informed is probably the smartest move right now." — Accept it gracefully and reframe it as a win.',
              },
              {
                id: 'sc-36',
                question: 'What is the closing script for the call?',
                answer:
                  '"It sounds like you\'re still figuring things out, which is totally normal. What I usually do at this stage is a quick walkthrough, in person or virtual, where I look at the home the way a buyer would and point out repairs or upgrades you don\'t need to do so you don\'t waste money when the time comes. Is there usually a better day of the week for that?"',
              },
              {
                id: 'sc-37',
                question:
                  'What are the three things the closing script assumes and avoids to keep it low-pressure?',
                answer:
                  'Assumes "not ready," frames the walkthrough as preventing wasted money, and never mentions listing.',
              },
              {
                id: 'sc-38',
                question: 'What does the close ask for instead of "Can I book an appointment?"',
                answer:
                  '"Is there usually a better day of the week for that?" — It assumes a yes softly, and asks about preference rather than commitment.',
              },
              {
                id: 'sc-39',
                question: 'Day 1 of the 8-day text drip — what does it say?',
                answer:
                  '"Hey! [First Name], I saw you were curious about selling. What\'s your ideal timeline? (Just exploring, next few months, or ASAP?)"',
              },
              {
                id: 'sc-40',
                question: 'Day 2 of the 8-day text drip — what does it say?',
                answer:
                  '"Just wanted to check in and include your custom market valuation report. [custom_ylopo_seller_report]"',
              },
              {
                id: 'sc-41',
                question: 'Day 3 of the 8-day text drip — what does it say?',
                answer:
                  '"The sellers report I sent you yesterday can be a great starting point. I\'d be happy to spend ten minutes reviewing with you. Is this afternoon a good time?"',
              },
              {
                id: 'sc-42',
                question: 'Day 4 of the 8-day text drip — what does it say?',
                answer:
                  '"I can also send you a prep list with the top 3 things that would give you the biggest return. Want me to send that?"',
              },
              {
                id: 'sc-43',
                question: 'Day 5 of the 8-day text drip — what does it say?',
                answer:
                  '"If you had a magic-number price that would make moving worth it... what would it be?"',
              },
              {
                id: 'sc-44',
                question: 'Day 6 of the 8-day text drip — what does it say?',
                answer:
                  '"Happy to do a quick walkthrough (in person or virtual) just to give you clarity and options — zero pressure. Want to find a time?"',
              },
              {
                id: 'sc-45',
                question: 'Day 7 of the 8-day text drip — what does it say?',
                answer:
                  '"Still here if you need anything. I noticed some shifting in the market trends this week, would you like to discuss?"',
              },
              {
                id: 'sc-46',
                question: 'Day 8 of the 8-day text drip — what does it say?',
                answer:
                  '"I took the liberty of setting up a home search in your area for you. Check it out here: [link]. Let me know if you see anything that catches your eye!"',
              },
              {
                id: 'sc-47',
                question:
                  'What is the strategic purpose of Day 8 — sending a home search to a potential seller?',
                answer:
                  "It shows the seller what buyers in their price range are actively looking at, which makes their own move feel more concrete and keeps the agent relevant without pressure.",
              },
            ],
          },
        },
        {
          id: 'lesson-4-6',
          title: 'Scripts Comprehension Quiz',
          type: 'quiz',
          durationMinutes: 10,
          content: {
            intro:
              'This 12-question quiz covers every major concept from the RaiDAR scriptbook — call purpose, opening language, scenario routing, power phrases, the value statement, and the drip sequence. You need 70% or better to advance to the practice call.',
            passingScore: 70,
            questions: [
              {
                id: 'sq-1',
                question: 'What is the primary purpose of a RaiDAR follow-up call?',
                options: [
                  'To pitch the homeowner on listing their home as soon as possible',
                  'To continue the AI text conversation and build trust through curiosity',
                  'To qualify the lead and determine if they are hot, warm, or cold',
                  'To conduct a comparative market analysis over the phone',
                ],
                correctIndex: 1,
                explanation:
                  "The RaiDAR call is not a pitch — it's a continuation of the trust the AI already started building over text. The job is curiosity, not conversion.",
              },
              {
                id: 'sq-2',
                question: 'Which two things should the agent never do at the start of a RaiDAR call?',
                options: [
                  'Use the homeowner\'s first name and mention RADAR',
                  'Apologize for calling and ask permission to sell',
                  'Reference the text conversation and pause after opening',
                  'Mention the home\'s value and ask about their timeline',
                ],
                correctIndex: 1,
                explanation:
                  'Apologizing gives away your authority and asking permission to sell frames the call wrong from the start. Anchor to the text, state your name, and let them respond.',
              },
              {
                id: 'sq-3',
                question:
                  'Why does the disarming frame ("I\'m sure you aren\'t ready to sell any time soon...") work so effectively?',
                options: [
                  'It creates urgency by implying the market may not support their home value later',
                  'It assumes not ready as the default, making it safe to answer honestly either way',
                  'It qualifies the lead quickly so the agent can decide whether to continue',
                  'It lets the agent skip the opener and go straight to next steps',
                ],
                correctIndex: 1,
                explanation:
                  "By leading with the assumption they're not ready, you remove the threat. The homeowner doesn't feel they have to defend themselves, which makes them more likely to tell you the truth.",
              },
              {
                id: 'sq-4',
                question:
                  'A lead responded to a home valuation text. Which connector question is correct?',
                options: [
                  'Would you be open to listing your home this spring?',
                  'I saw my assistant sent you some pricing information. What stood out to you when you looked at that?',
                  'I noticed you checked your value — are you thinking about selling soon?',
                  'I saw you were open to information about local agents. What made you curious about that?',
                ],
                correctIndex: 1,
                explanation:
                  'Option D is the Scenario B connector (agent comparison text). The correct opener for a pricing/value text response picks up exactly what the AI sent and asks an open-ended question about their reaction.',
              },
              {
                id: 'sq-5',
                question:
                  'A lead says they\'re "just looking." Which question best unpacks what that actually means for them?',
                options: [
                  'Are you comparing options, or just educating yourself right now?',
                  'What would it take to make you ready today?',
                  'When you say "just looking," what does that actually mean for you right now?',
                  'How did you land on that number?',
                ],
                correctIndex: 2,
                explanation:
                  'The "just looking" scenario requires direct, curious clarification. "When you say..." opens the door without challenging them. Option A is the Scenario B follow-up. Option D is the home valuer scenario.',
              },
              {
                id: 'sq-6',
                question:
                  'After asking a power phrase question like "Tell me more about that," what should the agent do?',
                options: [
                  'Immediately follow up with a second question to keep the momentum going',
                  'Summarize what the homeowner said and offer a solution',
                  'Stop talking and let the homeowner fill the silence',
                  'Transition to the value statement before they can object',
                ],
                correctIndex: 2,
                explanation:
                  'Power phrases only work if the agent gets out of the way afterward. The silence belongs to the homeowner. Filling it breaks the dynamic.',
              },
              {
                id: 'sq-7',
                question:
                  'What is the correct response when a homeowner says they are not ready to sell yet?',
                options: [
                  "That's understandable — what if we just set a quick appointment to review options?",
                  "I'm actually glad to hear that. I specialize in helping people who aren't ready. Most people I work with just want clarity before they make any decisions.",
                  "No problem — I'll put you in our database and someone will reach out in six months.",
                  "Okay, but the market is shifting — you may want to reconsider your timeline.",
                ],
                correctIndex: 1,
                explanation:
                  'This is the "normalizing not ready" line verbatim. It flips the expected script entirely: instead of pushing, you affirm. This builds more trust in one sentence than anything else on the call.',
              },
              {
                id: 'sq-8',
                question:
                  'How is the walkthrough value statement framed — and what does it deliberately avoid mentioning?',
                options: [
                  'Framed as a free consultation; avoids mentioning commission',
                  'Framed as market research; avoids mentioning price',
                  'Framed as preventing wasted money on unnecessary repairs; avoids any mention of listing',
                  "Framed as buyer readiness; avoids mentioning the agent's fee",
                ],
                correctIndex: 2,
                explanation:
                  "The walkthrough is positioned as a protective service — saving the homeowner from spending money on repairs that won't give a return. The word \"listing\" never appears.",
              },
              {
                id: 'sq-9',
                question:
                  'The transition to next steps ends with: "Would that actually be useful for you, ___?"',
                options: [
                  '...or would you prefer to wait?',
                  '...or not yet?',
                  '...or should we schedule something now?',
                  '...or are you still figuring things out?',
                ],
                correctIndex: 1,
                explanation:
                  '"Or not yet?" is the exact language. It gives permission to say no without it feeling like a rejection. It implies they might be ready soon — which is different from implying they might never be.',
              },
              {
                id: 'sq-10',
                question: 'The closing script softly moves toward scheduling by asking:',
                options: [
                  'What day works best for you this week?',
                  'Can I block some time on your calendar?',
                  'Is there usually a better day of the week for that?',
                  'Would next Tuesday or Wednesday work for you?',
                ],
                correctIndex: 2,
                explanation:
                  'The exact language is "Is there usually a better day of the week for that?" It assumes forward motion without demanding a commitment. "Usually" implies this is routine and low-stakes.',
              },
              {
                id: 'sq-11',
                question:
                  'On which day of the 8-day drip does the agent ask: "If you had a magic-number price that would make moving worth it... what would it be?"',
                options: ['Day 2', 'Day 4', 'Day 5', 'Day 7'],
                correctIndex: 2,
                explanation:
                  'Day 5 is the magic-number question. By that point, the agent has already sent a market report (Day 2), offered to review it (Day 3), and offered a prep list (Day 4). Day 5 uses that momentum to invite the homeowner to anchor on a price.',
              },
              {
                id: 'sq-12',
                question:
                  'What is the strategic purpose of Day 8 in the drip — setting up a home search for a potential seller?',
                options: [
                  'To upsell the homeowner on buyer representation if they need to find a new home first',
                  "To show the seller what buyers in their price range are competing for, making their own move feel more concrete",
                  'To transition the lead from the seller pipeline into the buyer pipeline',
                  "To demonstrate the agent's technology capabilities and differentiate from competitors",
                ],
                correctIndex: 1,
                explanation:
                  "Seeing what buyers are actively searching for in their price range helps sellers visualize demand and makes the idea of selling feel more real and timely — without any direct pressure from the agent.",
              },
            ],
          },
        },
        {
          id: 'lesson-4-7',
          title: 'Full RaiDAR Call Practice',
          type: 'roleplay',
          durationMinutes: 15,
          image: '/images/ai-roleplay.png',
          content: {
            intro:
              'This is the capstone practice call for Section 4. You will run a complete RaiDAR call from open to close — anchoring to a text conversation, delivering the disarming frame, reading the scenario, using power phrases, normalizing not ready, delivering the value statement, and transitioning to next steps. There are no shortcuts. Every beat matters. Score yourself honestly — an 8 means it felt natural, consultant-like, and low-pressure throughout.',
            script: `FULL RaiDAR CALL — 7 BEATS TO HIT

CONTEXT: The homeowner responded to a home valuation text sent by your AI assistant.

---

BEAT 1 — OPEN (anchor to the text, no apology, no permission-asking)
YOU: "Hey [Name], this is [Your Name]. I saw my assistant was texting with you about some information on your home, so I wanted to continue that conversation for a minute." [Pause]
HOMEOWNER: "Oh, sure... I guess."

---

BEAT 2 — DISARMING FRAME (assume not ready, invite honesty)
YOU: "I'm sure you aren't ready to sell any time soon, but have you thought at all about moving in the next year or so?"
HOMEOWNER: "Not really. We've talked about it but nothing serious."

---

BEAT 3 — SCENARIO CONNECTOR (home valuer — connect to what they responded to)
YOU: "That makes sense. I saw my assistant sent you some pricing information. What stood out to you when you looked at that?"
HOMEOWNER: "Honestly I was kind of surprised at the number. Seemed higher than I expected."

---

BEAT 4 — POWER PHRASES (dig deeper, stop talking)
YOU: "How did you decide that felt high?"
HOMEOWNER: [Responds with context]
YOU: "Tell me more about that." [Stop. Let them talk.]

---

BEAT 5 — NORMALIZE NOT READY
YOU: "I'm actually glad to hear you're not ready to sell yet. I specialize in helping people who aren't ready. Most people I work with just want clarity before they make any decisions." [Pause. Let that land.]
HOMEOWNER: "Yeah that's kind of where we are."

---

BEAT 6 — VALUE STATEMENT (no pitch, no listing talk)
YOU: "What I normally do is a walkthrough of a client's home — in person or virtual — and look at it the way a buyer would. The goal is to help you avoid spending money on repairs or upgrades that won't give you a return."

---

BEAT 7 — TRANSITION AND CLOSE
YOU: "If it would be helpful, the next step for most people at your stage is just a quick walkthrough to get clarity. No pressure, no listing conversation. Would that actually be useful for you, or not yet?"
[If yes → "Is there usually a better day of the week for that?"]
[If no → "That's totally fine. Then staying informed is probably the smartest move right now."]

---

SCORING GUIDE:
8 = All 7 beats hit, no pressure felt, transitions smooth
7 = 6 beats hit, one moment that felt salesy or rushed
6 = 5 beats hit, clear gaps in normalizing or value statement
< 6 = Call felt like a pitch — start over, review the script`,
            phoneNumber: '(555) 555-0100',
            callInstructions:
              "Call the practice line. Introduce yourself as an agent and the AI will respond as a homeowner who reacted to a home valuation text. Work through all 7 beats in order. Stay curious, stay low-pressure, and let pauses breathe. When the call ends, score yourself using the guide above.",
            minimumScore: 8,
            remediation:
              'If you scored below 8, identify which beat broke down. The most common failures are: (1) rushing past the pause after the opener, (2) skipping the disarming frame and jumping to the scenario connector, and (3) letting the value statement sound like a pitch. Review those three moments specifically, then call again targeting just that one beat. Most agents need 2–3 rounds before the full call flows.',
          },
        },
        {
          id: 'lesson-4-graduation',
          title: 'Graduation: Your RADAR Game Plan',
          type: 'reflection',
          durationMinutes: 10,
          content: {
            intro:
              "You've completed all four sections of RADAR training. Before you graduate, commit to your plan in writing. Specificity is the difference between a plan and a wish.",
            questions: [
              {
                id: 'grad-1',
                question: 'How many RADAR conversations will you commit to having per week?',
                type: 'text',
              },
              {
                id: 'grad-2',
                question:
                  'What is your 90-day goal? (e.g., number of new relationships, number of listings)',
                type: 'text',
              },
              {
                id: 'grad-3',
                question:
                  'Compared to when you started, how comfortable are you now with calling early-stage sellers?',
                type: 'scale',
                scaleMin: 1,
                scaleMax: 10,
                scaleMinLabel: 'Still nervous',
                scaleMaxLabel: 'Fully confident',
              },
              {
                id: 'grad-4',
                question:
                  'What is the one thing from this course that changed how you think about seller outreach?',
                type: 'text',
              },
            ],
            outro:
              'Congratulations. You have completed all four sections of RADAR certification — mindset, tactics, nurture, and scripts. The system works when you do. Now go build some relationships.',
          },
        },
      ],
    },
  ],
}
