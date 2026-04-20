import type { Course } from '@/lib/types'

export const radarCourse: Course = {
  id: 'radar-v1',
  slug: 'radar',
  title: 'RaiDAR',
  subtitle: 'Getting More Sellers',
  description:
    'Master the RaiDAR system to identify and engage early-stage sellers before your competitors ever know they exist. This is not about cold calling — it is about being the trusted advisor already in the conversation when sellers are ready to move.',
  coverColor: '#7BC109',
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
          title: 'The RaiDAR Mindset — From "Always Be Closing" to "Always Be Consulting"',
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
                question: "In the RaiDAR program, what does the acronym 'ABC' stand for?",
                answer: 'Always Be Consulting.',
                clarification: "The traditional sales ABC — Always Be Closing — puts the agent's needs (getting a signed listing) ahead of the homeowner's. Flipping it to Always Be Consulting shifts the focus to the homeowner's situation and timeline. This reframe isn't just philosophical — it changes how leads respond to you in real time, because people can feel the difference between someone trying to extract value and someone genuinely trying to help.",
              },
              {
                id: 'fc-2',
                question:
                  "What is the primary psychological shift required when moving from a 'closing' mindset to a 'consulting' mindset?",
                answer:
                  'Focusing on building a relationship rather than pressuring for an immediate listing or sale.',
                clarification: "When you lead with 'how can I help you think through this?' instead of 'are you ready to list?', you trigger an entirely different response in the homeowner. Pressure activates defensiveness. Service activates trust. Agents who shift to a consulting mindset don't just get more listings eventually — they get better conversations immediately, because leads stop hiding their real situation.",
              },
              {
                id: 'fc-3',
                question:
                  'According to the RaiDAR Mastermind, the goal for every call should be to build a relationship with a _____.',
                answer: 'Human being.',
                clarification: "This sounds obvious, but most agents treat calls as transactions — they're trying to get a lead to 'convert.' The Mastermind frames it differently: every person on the other end of that call has a life, a situation, and a timeline that has nothing to do with your pipeline. When you approach them as a human being first, you ask better questions, you listen more carefully, and you become the kind of advisor people actually want to call back.",
              },
              {
                id: 'fc-4',
                question:
                  "Why is the 'Consultant' role particularly effective for homeowners compared to stock portfolio owners?",
                answer:
                  'Most consumers lack a trusted tool or advisor to help them track the value of their largest asset — their home.',
                clarification: "Stock investors have apps, advisors, and daily price updates. Homeowners have almost nothing. They check Zillow occasionally and guess. This creates a genuine gap that an agent can fill — not by pitching a listing, but by positioning themselves as the go-to resource for understanding home value over time. When you fill that gap, you earn trust before the homeowner ever needs to sell.",
              },
              {
                id: 'fc-5',
                question:
                  "What 'superpower' is recommended for agents to surface a lead's real story and motivation?",
                answer: 'Curiosity.',
                clarification: "Curiosity is not just a personality trait — it's a tactical tool. When you ask a genuine, curious follow-up question instead of pushing toward a close, you give the homeowner room to share their real situation. Most agents never hear the real story because they stop listening the moment they sense the answer isn't 'yes, I want to list.' Curiosity keeps you in the conversation long enough to find out what's actually going on.",
              },
              {
                id: 'fc-6',
                question:
                  "Instead of trying to 'overcome' an objection, agents should seek to _____ it.",
                answer: 'Understand it.',
                clarification: "Every objection is information. When a homeowner says 'we're not ready' or 'we'll wait until spring,' they're telling you something about their situation, their fears, or their constraints. Agents who try to overcome that objection are arguing with the person's reality. Agents who seek to understand it ask 'what's driving that timing for you?' — and often discover a situation they can actually help with.",
              },
              {
                id: 'fc-7',
                question: 'What is the three-step framework for handling resistance on a call?',
                answer: 'Affirm → Seek to Understand → Value-First Pivot.',
                clarification: "This sequence works because each step earns the right to the next one. Affirming first ('totally makes sense') lowers the homeowner's guard. Seeking to understand ('what's your thinking on that?') gets you real information. The value-first pivot ('here's something that might actually help you right now') positions you as useful before they need you. Skip any step and the whole thing collapses.",
              },
              {
                id: 'fc-8',
                question: "What does 'Normalizing Not Ready' mean?",
                answer:
                  "Accepting that most leads won't be ready to sell immediately — to prevent the agent from entering fight-or-flight mode.",
                clarification: "When agents expect every lead to convert on the first call, they become desperate — and leads can feel it. That desperation triggers a defensive response in the homeowner and a fight-or-flight response in the agent. Normalizing not ready is a mental reset: it means you go into every call expecting that most people aren't ready, so you stay calm, curious, and genuinely helpful regardless of where they are in their timeline.",
              },
              {
                id: 'fc-9',
                question:
                  'A homeowner says, "We\'re probably about a year away from selling." What is the best next response based on the RaiDAR mindset?',
                answer:
                  '"Totally makes sense. Just curious — how did you decide on a year?"',
                clarification: "This response does three things at once: it affirms their timeline without arguing, it stays curious instead of closing, and it opens a door to learn what's actually driving that decision. 'How did you decide on a year?' often surfaces things like a child's graduation, a financial milestone, or just vague uncertainty — all of which are opportunities to add value. The wrong response is 'well, the market is hot right now...' — that's arguing, not consulting.",
              },
              {
                id: 'fc-10',
                question: "When you argue with a lead, they _____.",
                answer: 'Defend.',
                clarification: "This is rooted in basic human psychology: when someone challenges our position, we instinctively dig in to defend it. The more forcefully an agent pushes back on a homeowner's objection, the more committed the homeowner becomes to that position. The opposite is also true — when you affirm and get curious, the homeowner often talks themselves into a more open stance without you having to do anything.",
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
              "Time to lock it in. This 10-question quiz covers everything from the RaiDAR mindset shift to objection handling, courage, and the consulting framework. You need 70% or better to complete the Mindset Module and advance to tactics.",
            passingScore: 70,
            questions: [
              {
                id: 'mq-1',
                question:
                  "What is the primary mindset shift proposed by the RaiDAR program to replace the traditional 'ABC' of sales?",
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
          title: 'Live RaiDAR Roleplay Training',
          type: 'roleplay',
          durationMinutes: 10,
          image: '/images/ai-roleplay.png',
          content: {
            intro:
              'This is where everything comes together. Inside the RaiDAR Roleplay Lab, you\'ll practice real conversations with a live AI simulator that mirrors actual seller objections and scenarios. This is the closest thing to a real RaiDAR call — without the pressure. Your goal is simple: apply the "Always Be Consulting" mindset, stay calm and curious, and work your way to an 8 out of 10 or higher. Repeat until it feels natural — because this is where confidence is built.',
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
            phoneNumber: '(332) 378-5521',
            callInstructions:
              'Call (332) 378-5521 right now to begin your roleplay. The AI will respond as a homeowner — use the script above as your guide. Stay curious, keep it low-pressure, and focus on being the consultant. When the call ends, you\'ll automatically receive a report card via text message on the phone you called from. Once you score 8 or better, take a screenshot of that report card and upload it below to continue.',
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
              "An agent working RaiDAR leads is building a relationship with homeowners to earn that listing. A key part of that relationship is the YLOPO Seller Report — a powerful tool that keeps you top of mind and positions you as their trusted market advisor. Go through this three-minute interactive walkthrough so you understand the value of each section within the report.",
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
              "Now that you know what the Seller Report delivers, here's how to set one up. This step-by-step walkthrough shows you exactly how to create a Seller Alert inside STARS. It takes about two minutes — follow each step so you can do this confidently for every RaiDAR lead you work.",
            embedHtml: `<div style="position: relative; padding-bottom: calc(48.6458% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/yXwzm80DHqKBacZdbwlX?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Create a Seller Alert for a Lead in Stars" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;"></iframe></div>`,
            durationLabel: '1 minute to complete',
          },
        },
      ],
    },

    // ============================================================
    // SECTION 3: SCRIPTING FOR SUCCESS
    // ============================================================
    {
      id: 'section-scripts',
      title: 'Section 3: Scripting for Success',
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
                clarification: "The AI already started a rapport-building exchange with this homeowner. When you call, you're not a stranger — you're continuing something that already exists. Framing it as 'continuing the conversation' rather than 'I'm calling to tell you about my services' completely changes how the homeowner hears those first seconds. The goal is continuation, not conversion.",
              },
              {
                id: 'sc-2',
                question: 'What three things should a RaiDAR call accomplish if done well?',
                answer:
                  'Press into curiosity, normalize "not ready," and ask thoughtful questions that help the homeowner avoid bad decisions.',
                clarification: "These three things aren't tactics — they're a way of showing up. Pressing into curiosity means you actually want to understand their situation, not just qualify them. Normalizing not ready signals that you're not desperate, which builds trust. Asking questions that help them avoid bad decisions (like selling without understanding their options) positions you as an advisor, not a closer. Do all three and the homeowner starts to trust you before the call is even over.",
              },
              {
                id: 'sc-3',
                question: 'If the call is done right, what happens naturally at the end?',
                answer:
                  "Trust builds and next steps happen on their own — the agent doesn't have to force them.",
                clarification: "Most agents try to engineer a next step ('can I schedule a time to meet?') as a tactic. In the RaiDAR framework, next steps emerge from trust — because the homeowner wants to keep talking to someone who made them feel understood, not sold. When you do the call right, the homeowner often suggests the next step themselves, or eagerly accepts one because they've already decided you're worth their time.",
              },
              {
                id: 'sc-4',
                question: 'How should the vibe of a RaiDAR call feel to the homeowner?',
                answer:
                  'Casual and unexpected — like a natural continuation of a conversation, not a sales call.',
                clarification: "The AI-to-phone handoff is designed to feel seamless, not like an escalation. If the homeowner suddenly feels like they're being 'worked,' they'll shut down. The casual tone is not accidental — it's the mechanism that keeps the conversation open. A homeowner who feels like they're chatting will share more than one who feels like they're being pitched.",
              },
              {
                id: 'sc-5',
                question: 'What is "success" on a RaiDAR call? (It is not always an appointment.)',
                answer:
                  'Clear timeline understanding + clear motivation + trust built + continued engagement. An appointment is a bonus, not the goal.',
                clarification: "Redefining success is one of the most important mental shifts in this entire framework. When agents chase appointments, they push too hard and lose the relationship. When they chase understanding — timeline, motivation, trust — they often end up with better appointments anyway, because the homeowner actually wants to meet. Measure success by what you learned, not what you got.",
              },
              {
                id: 'sc-6',
                question: 'Why does normalizing "not ready" benefit the agent, not just the homeowner?',
                answer:
                  "It keeps the agent's nervous system calm, prevents fight-or-flight mode, and makes the conversation feel authentic rather than desperate.",
                clarification: "This is about neuroscience as much as sales strategy. When you expect rejection, your body braces for it — your voice gets tighter, your questions get shorter, and you start rushing. Normalizing not ready is the reset that keeps you relaxed and present. A calm agent sounds like a trusted advisor. A desperate agent sounds like someone trying to make their quota.",
              },
              {
                id: 'sc-7',
                question:
                  'True or false: The goal of a RaiDAR call is to convince the homeowner to move their timeline forward.',
                answer:
                  'False. The goal is to understand where they are and stay in their orbit as a trusted resource — not to push them faster than they\'re ready.',
                clarification: "Trying to accelerate a homeowner's timeline is one of the most common and damaging mistakes agents make. It signals that you care more about your schedule than their situation. The RaiDAR model flips this: your job is to be so useful and trustworthy that when their timeline naturally moves forward, you're the first person they call. Patience is the competitive advantage.",
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
                clarification: "Every word in this opener is deliberate. 'My assistant was texting with you' is true — an AI system did reach out — and it immediately provides context without requiring the homeowner to place you. 'Continue that conversation' reframes the call as an extension of something they already participated in, not a cold outreach. The pause at the end is critical: it invites them to respond instead of rolling you into a scripted sales call.",
              },
              {
                id: 'sc-9',
                question: 'What are two things the agent must NOT do at the opening of a RaiDAR call?',
                answer: 'Do NOT apologize. Do NOT ask permission to sell.',
                clarification: "Apologizing ('sorry to bother you') immediately signals low status and puts the homeowner in the role of deciding whether to tolerate the call. Asking permission to sell ('would you be open to...?') frames the call as a sales attempt before you've established any value. Both mistakes tell the homeowner you believe the call is an imposition — which is exactly the opposite of how a trusted advisor shows up.",
              },
              {
                id: 'sc-10',
                question:
                  'What should the agent anchor to at the top of the call instead of leading with a pitch?',
                answer:
                  'The text conversation that already happened — this creates continuity and legitimacy rather than a cold start.',
                clarification: "The text exchange is the most powerful asset you have at the start of this call. The homeowner already responded to the AI, which means they already showed some level of curiosity. By anchoring to that exchange, you remind them of their own action — and use it to justify the call. You're not a stranger calling out of nowhere; you're the human behind the conversation they started.",
              },
              {
                id: 'sc-11',
                question: 'If the homeowner sounds hesitant after the opening, what is the correct response?',
                answer: '"Totally fine, I\'ll keep this short." — Acknowledge it, don\'t push through it.',
                clarification: "Hesitation is a signal, not a rejection. Acknowledging it ('totally fine, I'll keep this short') does two things: it validates their response, which lowers defenses, and it demonstrates that you're not going to pressure them. Agents who push through hesitation lose the call right there. Agents who acknowledge it often find the homeowner relaxes within the next two sentences.",
              },
              {
                id: 'sc-12',
                question: 'What is the "disarming frame" line used after the opening?',
                answer:
                  '"I\'m sure you aren\'t ready to sell any time soon, but have you thought at all about moving in the next year or so?"',
                clarification: "This single line is arguably the most important in the entire script. It works because it assumes the answer the homeowner is afraid to give — 'not ready' — and says it first. When you say it for them, you remove the social awkwardness of having to disappoint you, and they feel safe being honest. The follow-up question is open enough that both 'yes' and 'not really' lead somewhere useful.",
              },
              {
                id: 'sc-13',
                question: 'Why does the disarming frame work psychologically?',
                answer:
                  'It assumes "not ready" as the default, making it safe for the homeowner to say either yes or no. It invites honesty rather than triggering defensiveness.',
                clarification: "Most sales scripts create a binary situation for the homeowner: either agree with the agent, or resist them. The disarming frame eliminates that dynamic by making 'not ready' the expected and accepted answer. When there's nothing to push against, there's nothing to resist. The homeowner can answer honestly — and honest answers are the only ones you can actually work with.",
              },
              {
                id: 'sc-14',
                question:
                  'Why does the disarming frame invite more candid responses than asking "Are you thinking about selling?"',
                answer:
                  "Because it removes the implied pressure to say yes. The homeowner doesn't feel like they're being recruited — they feel like they're being consulted.",
                clarification: "'Are you thinking about selling?' is a yes/no question with social stakes — saying yes feels like agreeing to be sold to. The disarming frame reframes the entire conversation as a low-stakes check-in. The homeowner doesn't feel like they're making a commitment by answering; they feel like they're just having a conversation. That's the environment where real information gets shared.",
              },
              {
                id: 'sc-15',
                question:
                  'After delivering the disarming frame question, what should the agent do?',
                answer: 'Pause. Let the question land. Do not fill the silence.',
                clarification: "Silence after a question is one of the most powerful tools in a conversation — and one of the hardest things for most agents to do. When you fill the silence, you rescue the homeowner from having to answer, which means you lose the information their answer would have given you. The pause is doing work: it signals confidence, gives the homeowner time to formulate a real response, and prevents you from accidentally talking over the most important part of the call.",
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
                clarification: "This question does two things: it references the specific text they got (continuity), and it asks an open-ended question about their reaction rather than their intentions. 'What stood out to you?' is powerful because it has no right or wrong answer — the homeowner can say 'the price seemed high,' 'I was surprised it was that much,' or 'not much, just curious' — and all of those responses give you something real to work with.",
              },
              {
                id: 'sc-17',
                question:
                  'The lead responded to the pricing text and said the price seemed high. What is a strong follow-up?',
                answer:
                  '"How did you decide that felt high?" — Don\'t argue. Get curious about how they landed on that assessment.',
                clarification: "The instinct for most agents is to defend the number: 'Actually, comparable homes in your area sold for...' That's the wrong move. The homeowner's perception of 'high' is based on something — their own mortgage, a neighbor's sale, what they paid, wishful thinking. Asking 'how did you decide that felt high?' uncovers the real anchor. Once you know the anchor, you can have a useful conversation. Until then, you're arguing with a feeling.",
              },
              {
                id: 'sc-18',
                question:
                  'The lead responded to a pricing text and seemed interested. What is a strong follow-up to deepen the conversation?',
                answer: '"Tell me more about that." — Then stop talking. Let them fill the silence.',
                clarification: "Three words and a pause is one of the most powerful tools in any conversation. 'Tell me more about that' is non-directional — it doesn't push the homeowner toward any particular answer, it just gives them permission to keep talking. Most people will. And what they say next usually contains something much more valuable than whatever they said first — the real motivation, the real concern, the real timeline.",
              },
              {
                id: 'sc-19',
                question:
                  'The lead responded to an agent comparison text. What is the correct connector question?',
                answer:
                  '"I saw you were open to information about local agents. What made you curious about that specifically?"',
                clarification: "'What made you curious about that specifically?' is the key phrase here. It implies that their curiosity is meaningful and worth understanding, and it opens the door for them to reveal the real reason they engaged with the text — which might be 'we've been thinking about interviewing agents,' 'our neighbor just sold and we're wondering about our home,' or 'I was just clicking around.' Each answer tells you a completely different thing about where they are.",
              },
              {
                id: 'sc-20',
                question:
                  "After a lead responds to the agent comparison text, how do you determine if they're researching or actively deciding?",
                answer:
                  '"Are you comparing options, or just educating yourself right now?" — This separates browsers from buyers without pressure.',
                clarification: "This question does the work of a qualification question without sounding like one. 'Comparing options' signals they're actively in a decision process. 'Just educating myself' tells you they're earlier in the journey. Both are valuable — but they lead to very different conversations. And because you've given them both options with no judgment attached, they'll tell you the truth.",
              },
              {
                id: 'sc-21',
                question:
                  'The lead responded "maybe" or "just looking." What question do you use to unpack what that actually means?',
                answer:
                  '"When you say \'just looking,\' what does that actually mean for you right now?"',
                clarification: "'Just looking' is a defense mechanism — it's how people protect themselves from being sold to before they're ready. But it almost never means nothing. Asking 'what does that actually mean for you right now?' strips away the vagueness and invites them to be specific. The word 'actually' is doing subtle but important work here: it signals that you're genuinely curious, not just moving through a script.",
              },
              {
                id: 'sc-22',
                question:
                  'A lead in the "just looking" scenario seems uncertain. What question distinguishes timing uncertainty from market uncertainty?',
                answer:
                  '"Is that more about timing, or uncertainty about the market?" — Then follow wherever their answer leads.',
                clarification: "Uncertainty comes from different places — and the source matters for how you respond. Timing uncertainty ('we don't know when we want to move') calls for a follow-up about what would clarify the timing. Market uncertainty ('we're not sure if now is a good time to sell') opens a door to market data and education. By naming both possibilities, you make it easy for the homeowner to identify which one is true — and both lead somewhere useful.",
              },
              {
                id: 'sc-23',
                question:
                  'A "just looking" lead needs a push toward imagining a real future. What question creates that?',
                answer:
                  '"What would need to change for this to feel more real?" — It invites them to define their own trigger, not yours.',
                clarification: "This question is subtle but powerful. It doesn't push the homeowner to move faster — it asks them to articulate what their own tipping point looks like. When they answer, they're essentially telling you what to watch for and what to bring them when it happens. That information is your entire follow-up strategy. And because they defined it themselves, it doesn't feel like pressure when you reference it later.",
              },
              {
                id: 'sc-24',
                question:
                  'The lead responded to a "home valuer" text mentioning a price that would make moving worth it. What is the correct connector question?',
                answer:
                  '"You mentioned a price that would make moving worth it. How did you land on that number?"',
                clarification: "The homeowner has already done the work of anchoring to a number — your job is to understand that anchor. 'How did you land on that number?' gets at whether it's a real financial calculation (based on their remaining mortgage, a target net proceeds number, or a replacement home cost) or an intuitive gut feel. Understanding that distinction determines whether you can actually help them get there or whether you need to gently recalibrate expectations.",
              },
              {
                id: 'sc-25',
                question:
                  "For the home valuer scenario, how do you determine if the lead's magic number is based on lifestyle or market data?",
                answer:
                  '"Is that based on lifestyle goals or what you\'ve seen in the market?" — This reveals whether they have a real anchor or an emotional one.',
                clarification: "Lifestyle-based numbers ('we need enough to buy the lake house we want') are real and workable — they tell you exactly what the homeowner needs from the sale. Market-based numbers ('I saw a house down the street sell for X') are often misapplied — the homeowner may be anchoring on a different home size, condition, or market moment. Knowing which type you're dealing with tells you whether to affirm the number or gently educate.",
              },
              {
                id: 'sc-26',
                question:
                  'After establishing the lead\'s magic number in the home valuer scenario, what is the best forward-looking question?',
                answer:
                  '"If the market supported that number, what would you want to do next?" — It moves them from aspiration to action without pressure.',
                clarification: "This question works because it's conditional — 'if the market supported that number' — which means you're not asking them to commit to anything. You're simply asking them to imagine a scenario where their conditions are met. What they say next ('we'd probably start looking at places in Phoenix' or 'we'd want to be out before winter') is a roadmap. It also reveals urgency: if they have a clear answer, they're further along than 'just looking' suggests.",
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
                clarification: "Each of these phrases is deliberately non-directional. They don't push the homeowner toward any particular answer — they just create space for them to keep talking. 'Tell me more' is pure invitation. 'How did you decide' uncovers the reasoning behind a position. 'What makes that important' surfaces values and motivations that are often more powerful than any sales point you could offer. Use them whenever you want to go deeper without steering.",
              },
              {
                id: 'sc-28',
                question: "After asking a power phrase question, what is the agent's only job?",
                answer:
                  "Stop talking. Find their story. The silence belongs to the homeowner.",
                clarification: "A power phrase question only works if you actually let the homeowner answer it. The instinct to fill silence with more questions, reassurances, or follow-ups is what kills the moment. The homeowner needs time to formulate a real answer — especially to 'what makes that important to you?' which requires some reflection. The agent who stays quiet after asking a good question always learns more than the agent who rushes to the next point.",
              },
              {
                id: 'sc-29',
                question: 'What is the exact "normalizing not ready" line used mid-call?',
                answer:
                  '"I\'m actually glad to hear you\'re not ready to sell yet. I specialize in helping people who aren\'t ready. Most people I work with just want clarity before they make any decisions." [Pause. Let that land.]',
                clarification: "This is one of the most counterintuitive lines in the script — and one of the most effective. Every other agent the homeowner has talked to has tried to move them along. When you say 'I'm glad you're not ready,' you completely flip the dynamic. You become the only person in their life who isn't pushing them, which instantly makes you the most trustworthy person in the room. The pause after this line is critical — let it land before you say anything else.",
              },
              {
                id: 'sc-30',
                question:
                  'Why does saying "I\'m glad you\'re not ready" create more trust than trying to move the lead forward?',
                answer:
                  'It signals that the agent is not threatened by their timeline and has no agenda to push — which makes the homeowner more willing to open up.',
                clarification: "Homeowners are conditioned to expect agents to push. When you signal that you have no agenda — that you're genuinely fine with wherever they are — it removes the social pressure that's been keeping them guarded. They stop trying to manage you and start telling you what's actually going on. That information is worth far more than any closing technique, because it tells you exactly how and when to be useful.",
              },
              {
                id: 'sc-31',
                question:
                  'What is the value statement script used to explain what the agent does — without pitching a listing?',
                answer:
                  '"What I normally do is a walkthrough of a client\'s home, in person or virtual, and look at it the way a buyer would. The goal is to help you avoid spending money on repairs or upgrades that won\'t give you a return."',
                clarification: "The walkthrough is the Trojan horse of this system. It provides genuine value (homeowners really do waste money on the wrong improvements), but it also gets you in the home in a non-threatening context. By positioning it as protection — 'so you don't waste money' — you align your interests with theirs. There's no listing agenda visible. And yet once you're in that home, you've already done more than every agent who sent a postcard.",
              },
              {
                id: 'sc-32',
                question:
                  'What is the value statement framed around — and what is it explicitly NOT framed around?',
                answer:
                  'Framed around preventing wasted money. NOT framed around pushing a sale or getting a listing.',
                clarification: "The framing is everything. 'Would you like to meet to discuss listing your home?' triggers resistance. 'Would it help to know which repairs to skip so you don't waste money?' triggers gratitude. The outcome is the same visit — but the homeowner's emotional response to each invitation is completely different. This framing works because it solves a problem they already have, whether they're selling next month or in three years.",
              },
              {
                id: 'sc-33',
                question: 'What outcome does the walkthrough value statement offer the homeowner?',
                answer:
                  "Clarity and protection — knowing which repairs to skip so they don't waste money when the time comes.",
                clarification: "Clarity and protection are two of the most valuable things you can offer a pre-seller. Clarity because most homeowners genuinely don't know what their home is worth or what it would cost to get it ready. Protection because the fear of 'doing it wrong' is a real barrier to moving forward. By offering both in a single visit, you solve the two biggest emotional obstacles to the listing conversation — before the listing conversation ever begins.",
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
                clarification: "'If it would be helpful' and 'most people at your stage' are both doing important work. The first phrase makes the next step optional and positions you as responsive to their needs rather than your agenda. The second normalizes the walkthrough as a standard step — 'most people' do this, so it's not weird or committal. The closing question ('would that actually be useful, or not yet?') gives them an easy out, which paradoxically makes them more likely to say yes.",
              },
              {
                id: 'sc-35',
                question: 'What is the correct response if the homeowner says no to the walkthrough?',
                answer:
                  '"That\'s totally fine. Then staying informed is probably the smartest move right now." — Accept it gracefully and reframe it as a win.',
                clarification: "Accepting a 'no' gracefully is one of the most powerful things you can do. It confirms that you meant it when you said 'no pressure.' It also keeps the conversation open — the homeowner doesn't have to escape or get off the phone, because you've made it clear that no is a fine answer. 'Staying informed is probably the smartest move' gives them a positive action to take (receiving your market updates) rather than ending the interaction.",
              },
              {
                id: 'sc-36',
                question: 'What is the closing script for the call?',
                answer:
                  '"It sounds like you\'re still figuring things out, which is totally normal. What I usually do at this stage is a quick walkthrough, in person or virtual, where I look at the home the way a buyer would and point out repairs or upgrades you don\'t need to do so you don\'t waste money when the time comes. Is there usually a better day of the week for that?"',
                clarification: "Every phrase in this close is load-bearing. 'Still figuring things out, which is totally normal' is a final normalization before the ask. 'What I usually do at this stage' frames the walkthrough as standard practice, not a special request. 'Point out repairs you don't need to do' is protection framing — you're saving them from themselves. And 'is there usually a better day of the week' assumes agreement softly while asking about preference, not permission.",
              },
              {
                id: 'sc-37',
                question:
                  'What are the three things the closing script assumes and avoids to keep it low-pressure?',
                answer:
                  'Assumes "not ready," frames the walkthrough as preventing wasted money, and never mentions listing.',
                clarification: "Each of these three elements neutralizes a different source of resistance. Assuming not ready removes the pressure to be at a certain stage. Framing around wasted money aligns your interests with theirs (both of you benefit from them not overspending on improvements). Never mentioning listing removes the subtext that's making the homeowner guard themselves — they can relax because there's no ask coming that they're not ready for.",
              },
              {
                id: 'sc-38',
                question: 'What does the close ask for instead of "Can I book an appointment?"',
                answer:
                  '"Is there usually a better day of the week for that?" — It assumes a yes softly, and asks about preference rather than commitment.',
                clarification: "'Can I book an appointment?' requires a yes-or-no decision with social stakes. 'Is there usually a better day of the week?' assumes the meeting is happening and simply asks about logistics. The word 'usually' is especially clever — it implies this is a recurring thing in their life, making the question feel casual rather than consequential. When people answer a logistics question, they've implicitly agreed to the thing behind it.",
              },
              {
                id: 'sc-39',
                question: 'Day 1 of the 8-day text drip — what does it say?',
                answer:
                  '"Hey! [First Name], I saw you were curious about selling. What\'s your ideal timeline? (Just exploring, next few months, or ASAP?)"',
                clarification: "Day 1 opens with curiosity, not information. By asking about their timeline immediately, you signal that your communication is going to be personalized — not a generic drip. The three options in parentheses ('just exploring, next few months, or ASAP?') give them easy ways to respond that don't require them to compose a full reply. Any answer they give is the foundation for everything that follows.",
              },
              {
                id: 'sc-40',
                question: 'Day 2 of the 8-day text drip — what does it say?',
                answer:
                  '"Just wanted to check in and include your custom market valuation report. [custom_ylopo_seller_report]"',
                clarification: "Day 2 delivers concrete value: their home's market data, personalized to their address. 'Custom market valuation report' feels specific and personal, not like a generic newsletter. This is the first touchpoint where the homeowner gets something they can actually use, which shifts the relationship from 'agent contacting me' to 'person providing me with useful information.' That shift matters for every subsequent message.",
              },
              {
                id: 'sc-41',
                question: 'Day 3 of the 8-day text drip — what does it say?',
                answer:
                  '"The sellers report I sent you yesterday can be a great starting point. I\'d be happy to spend ten minutes reviewing with you. Is this afternoon a good time?"',
                clarification: "Day 3 builds on Day 2's value delivery by offering to make it even more useful. 'Ten minutes' is important — it's specific enough to feel non-threatening and low-commitment. Referencing what you sent yesterday creates continuity and shows you're paying attention to the sequence. The question 'is this afternoon a good time?' is casual and specific, which makes it easier to answer than 'would you like to schedule a call?'",
              },
              {
                id: 'sc-42',
                question: 'Day 4 of the 8-day text drip — what does it say?',
                answer:
                  '"I can also send you a prep list with the top 3 things that would give you the biggest return. Want me to send that?"',
                clarification: "Day 4 introduces a new piece of value: actionable prep guidance. Framing it as 'the top 3 things' rather than a comprehensive list makes it feel manageable and not overwhelming. 'That would give you the biggest return' keeps the framing around their financial benefit. And 'want me to send that?' is an easy yes — it requires no commitment beyond receiving information, which makes the yes rate very high.",
              },
              {
                id: 'sc-43',
                question: 'Day 5 of the 8-day text drip — what does it say?',
                answer:
                  '"If you had a magic-number price that would make moving worth it... what would it be?"',
                clarification: "Day 5 is a pivot from information delivery to emotional engagement. 'Magic-number price' is a deliberately casual, non-threatening way to ask about motivation — it sounds like a fun hypothetical rather than a qualification question. By this point in the drip, the homeowner has received enough value that they're more likely to engage authentically. Whatever number they name becomes your most important data point for the rest of the relationship.",
              },
              {
                id: 'sc-44',
                question: 'Day 6 of the 8-day text drip — what does it say?',
                answer:
                  '"Happy to do a quick walkthrough (in person or virtual) just to give you clarity and options — zero pressure. Want to find a time?"',
                clarification: "Day 6 reintroduces the walkthrough offer, but now it lands differently than it would have on Day 1. By this point, the homeowner has received market data, a prep list, and a value-focused message. 'Zero pressure' is stated explicitly because it needs to be believed, not just implied. The offer of 'in person or virtual' removes a logistical barrier — it signals flexibility and makes the yes easier.",
              },
              {
                id: 'sc-45',
                question: 'Day 7 of the 8-day text drip — what does it say?',
                answer:
                  '"Still here if you need anything. I noticed some shifting in the market trends this week, would you like to discuss?"',
                clarification: "Day 7 is a soft presence touchpoint — it reminds the homeowner you exist without asking for anything. 'Still here if you need anything' is service-oriented, not sales-oriented. The market trend hook gives them something specific to respond to if they want to engage, without requiring them to. This type of low-friction touchpoint is what keeps you top of mind for homeowners who are 6-12 months out without wearing them down.",
              },
              {
                id: 'sc-46',
                question: 'Day 8 of the 8-day text drip — what does it say?',
                answer:
                  '"I took the liberty of setting up a home search in your area for you. Check it out here: [link]. Let me know if you see anything that catches your eye!"',
                clarification: "Day 8 is the most counterintuitive message in the sequence — you're sending a seller a buyer search. But this is intentional: seeing what buyers in their price range are actively looking at creates a visceral sense of demand. It also signals that you have access to market data they can't get elsewhere. 'I took the liberty' frames it as a proactive gift, not a sales push. If they click the link and browse, they're thinking like a seller — which is exactly what you want.",
              },
              {
                id: 'sc-47',
                question:
                  'What is the strategic purpose of Day 8 — sending a home search to a potential seller?',
                answer:
                  "It shows the seller what buyers in their price range are actively looking at, which makes their own move feel more concrete and keeps the agent relevant without pressure.",
                clarification: "The psychology here is based on market concreteness. Abstract knowledge ('the market is good') doesn't move people. But seeing real buyers actively searching for homes like theirs makes the demand feel real and specific. It closes the mental gap between 'thinking about selling someday' and 'understanding what selling actually looks like.' The agent stays relevant because they're the one providing this window into buyer behavior — a view no one else is offering.",
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
                  'Use the homeowner\'s first name and mention RaiDAR',
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
            phoneNumber: '(332) 378-5521',
            callInstructions:
              'Call (332) 378-5521 right now to begin your roleplay. The AI will respond as a homeowner who reacted to a home valuation text. Work through all 7 beats in order — stay curious, stay low-pressure, and let pauses breathe. When the call ends, you\'ll automatically receive a report card via text message on the phone you called from. Once you score 8 or better, take a screenshot of that report card and upload it below to continue.',
            minimumScore: 8,
            remediation:
              'If you scored below 8, identify which beat broke down. The most common failures are: (1) rushing past the pause after the opener, (2) skipping the disarming frame and jumping to the scenario connector, and (3) letting the value statement sound like a pitch. Review those three moments specifically, then call again targeting just that one beat. Most agents need 2–3 rounds before the full call flows.',
          },
        },
        {
          id: 'lesson-4-certificate',
          title: 'RaiDAR Certification',
          type: 'certificate',
          durationMinutes: 2,
          content: {
            courseName: 'RaiDAR',
            courseSubtitle: 'Getting More Sellers',
            modules: ['Mindset', 'Tactical', 'Scripting for Success'],
            instructorName: 'Barry Jenkins',
            instructorTitle: 'Head Realtor in Residence, Ylopo',
          },
        },
      ],
    },
  ],
}
