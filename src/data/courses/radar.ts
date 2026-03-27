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
          id: 'lesson-1-1',
          title: 'The RADAR Mindset — From "Always Be Closing" to "Always Be Consulting"',
          type: 'video',
          durationMinutes: 5,
          image: '/images/mindset.png',
          content: {
            vimeoId: '1177058510',
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
                  'How should an agent respond to a homeowner who says they are 12 months away from selling?',
                answer:
                  "Affirm the decision (e.g., 'Planning early is smart') and express curiosity about how they landed on that timeline.",
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
          id: 'lesson-1-4',
          title: 'Why "Not Ready" Is the Opportunity',
          type: 'video',
          durationMinutes: 4,
          content: {
            vimeoId: '',
            description:
              "Most agents hang up when a seller says they're 6 months out. RADAR agents lean in. This lesson teaches you to see 'not ready' as the beginning — not the end.",
            keyPoints: [
              '"Not ready" means you have a window competitors don\'t know about',
              'Early relationships compound — trust builds over time',
              'Be the agent they already know when they\'re ready to move',
            ],
          },
        },
        {
          id: 'lesson-1-5',
          title: 'Self-Assessment: Where Are You Starting From?',
          type: 'reflection',
          durationMinutes: 5,
          content: {
            intro:
              "Before we go tactical, calibrate where you are right now. These questions have no wrong answers — they're about building self-awareness so you know exactly what you're working on. You'll revisit them at graduation.",
            questions: [
              {
                id: 'rq-1',
                question: 'On a scale of 1–10, how comfortable are you calling strangers right now?',
                type: 'scale',
                scaleMin: 1,
                scaleMax: 10,
                scaleMinLabel: 'Very uncomfortable',
                scaleMaxLabel: 'Completely comfortable',
              },
              {
                id: 'rq-2',
                question: "Do you ever feel like you're bothering people when you call?",
                type: 'scale',
                scaleMin: 1,
                scaleMax: 10,
                scaleMinLabel: 'Never',
                scaleMaxLabel: 'Almost always',
              },
              {
                id: 'rq-3',
                question:
                  'How committed are you to doing 60–90 days of consistent work on this system?',
                type: 'scale',
                scaleMin: 1,
                scaleMax: 10,
                scaleMinLabel: 'Not sure yet',
                scaleMaxLabel: 'Fully committed',
              },
              {
                id: 'rq-4',
                question: 'In your own words, what does "Always Be Consulting" mean to you?',
                type: 'text',
              },
            ],
            outro:
              "There are no wrong answers here. Save your responses — you'll revisit them at graduation to see how far you've come.",
          },
        },
        {
          id: 'lesson-1-6',
          title: "Becoming the Trusted Advisor — Your New Identity",
          type: 'video',
          durationMinutes: 5,
          content: {
            vimeoId: '',
            description:
              "A stockbroker doesn't wait for you to call them before a crash — they call you. That's your model. This lesson shows you how to position yourself as the homeowner's advisor before they ever think to call another agent.",
            keyPoints: [
              "Homeowners need someone tracking the value of their largest asset",
              'You are that person — and most of them don\'t have one yet',
              'The trusted advisor gets the call when it\'s time to sell',
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
        {
          id: 'lesson-3-4',
          title: 'Graduation: Your RADAR Game Plan',
          type: 'reflection',
          durationMinutes: 10,
          content: {
            intro:
              "You've completed the RADAR training. Before you graduate, commit to your plan in writing. Specificity is the difference between a plan and a wish.",
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
              "Congratulations. You have earned your RADAR certification. The system works when you do. Now go build some relationships.",
          },
        },
      ],
    },
  ],
}
