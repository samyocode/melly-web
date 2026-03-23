// lib/quiz-data.ts
//
// Quiz data for the 6 featured web quizzes.
// Extracted from the Supabase quiz table.
// Add more quizzes here as you expand the web funnel.

export interface QuizOption {
  text: string;
  value: number;
}
export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}
export interface QuizResult {
  code: string;
  name: string;
  traits: string[];
  tagline: string;
  description: string;
}
export interface QuizData {
  title: string;
  description: string;
  cover_image_key: string;
  questions: QuizQuestion[];
  results: QuizResult[];
}

export const QUIZ_REGISTRY: Record<string, QuizData> = {
  // ─── 1. CLINGY OR COOL? ──────────────────────────────────────────────────
  "clingy-or-cool": {
    title: "Clingy or Cool?",
    description:
      "Discover your unique way of connecting in relationships. This quiz, based on Attachment Theory, reveals how you bond with partners.",
    cover_image_key: "clingy_vs_cool",
    questions: [
      {
        id: "q1",
        text: "Your partner seems a little distant lately. Your first internal reaction is to:",
        options: [
          {
            text: "Feel a wave of anxiety and wonder if I did something wrong.",
            value: 0,
          },
          {
            text: "Assume they're just busy or stressed and give them space.",
            value: 1,
          },
          {
            text: "Note it, but feel secure enough to bring it up calmly when the time is right.",
            value: 2,
          },
          {
            text: "Feel a mix of wanting to get closer and wanting to pull away myself.",
            value: 3,
          },
        ],
      },
      {
        id: "q2",
        text: "Your deepest fear in a relationship is:",
        options: [
          {
            text: "My partner not loving me as much as I love them, or abandoning me.",
            value: 0,
          },
          {
            text: "Losing my independence and being suffocated by the relationship.",
            value: 1,
          },
          {
            text: "I don't have deep fears about it; relationships are a source of comfort.",
            value: 2,
          },
          { text: "Getting too close and inevitably getting hurt.", value: 3 },
        ],
      },
      {
        id: "q3",
        text: 'What does "independence" in a relationship mean to you?',
        options: [
          {
            text: "It's okay, but I feel happiest when we are very intertwined and connected.",
            value: 0,
          },
          {
            text: "It is absolutely essential. I need to feel like my own person at all times.",
            value: 1,
          },
          {
            text: "It's a healthy balance. We are two whole people who choose to be a team.",
            value: 2,
          },
          {
            text: "It's a way to keep myself safe from being too dependent on someone.",
            value: 3,
          },
        ],
      },
      {
        id: "q4",
        text: "When things start getting serious and intimate, you tend to:",
        options: [
          {
            text: "Go all-in, sometimes worrying if I'm 'too much' for them.",
            value: 0,
          },
          {
            text: "Feel an unconscious urge to pull back and find flaws in the other person.",
            value: 1,
          },
          {
            text: "Enjoy the growing closeness and feel excited for the future.",
            value: 2,
          },
          {
            text: "Feel both excited by the intimacy and terrified of it at the same time.",
            value: 3,
          },
        ],
      },
      {
        id: "q5",
        text: "How often do you need reassurance that your partner loves you?",
        options: [
          {
            text: "Fairly often. I feel best when I'm getting regular validation.",
            value: 0,
          },
          {
            text: "Very rarely. I'm not focused on it and assume everything is fine.",
            value: 1,
          },
          {
            text: "I appreciate it when it's given, but I don't feel a constant need for it.",
            value: 2,
          },
          {
            text: "I crave it, but I'm often too scared to ask for it.",
            value: 3,
          },
        ],
      },
      {
        id: "q6",
        text: "After a conflict, your primary need is:",
        options: [
          {
            text: "To reconnect as quickly as possible to make sure we're okay.",
            value: 0,
          },
          {
            text: "To have some time alone to cool off and reset myself.",
            value: 1,
          },
          {
            text: "To find a solution together, trusting that the conflict won't break us.",
            value: 2,
          },
          {
            text: "To feel safe, which can be a confusing mix of wanting space and wanting closeness.",
            value: 3,
          },
        ],
      },
      {
        id: "q7",
        text: "An ideal partner is someone who...",
        options: [
          {
            text: "Is very expressive with their affection and offers a lot of reassurance.",
            value: 0,
          },
          {
            text: "Is independent, self-sufficient, and doesn't make a lot of demands on me.",
            value: 1,
          },
          {
            text: "Is a reliable and consistent presence in my life, through good times and bad.",
            value: 2,
          },
          {
            text: "Is patient and allows me to move at my own pace.",
            value: 3,
          },
        ],
      },
    ],
    results: [
      {
        code: "anxious_heart",
        name: "The Anxious Heart",
        traits: [
          "Craves Closeness",
          "Expressive",
          "Reassurance-Seeking",
          "Vigilant",
        ],
        tagline: "You love deeply and need reassurance to feel secure.",
        description:
          "You thrive on intimacy and can feel anxious when you sense distance. You love deeply and seek a partner who can offer consistent reassurance and connection.",
      },
      {
        code: "self_reliant",
        name: "The Self-Reliant",
        traits: ["Independent", "Values Space", "Private", "Task-Focused"],
        tagline:
          "Independence is non-negotiable — you handle emotions privately.",
        description:
          "You are highly independent and self-sufficient. You value your freedom and prefer to handle your emotions privately, seeking a partner who respects your need for autonomy.",
      },
      {
        code: "secure_anchor",
        name: "The Secure Anchor",
        traits: ["Trusting", "Connected", "Resilient", "Reliable"],
        tagline: "You trust easily and navigate intimacy with a steady heart.",
        description:
          "You find it relatively easy to get close to others and are comfortable with both intimacy and independence. You navigate relationships with a steady and trusting heart.",
      },
      {
        code: "cautious_skeptic",
        name: "The Cautious Skeptic",
        traits: [
          "Wants Connection & Fears It",
          "Cautious",
          "Unpredictable",
          "Observant",
        ],
        tagline: "You want closeness but protect yourself from getting hurt.",
        description:
          "You deeply desire closeness but worry about getting hurt. You can be hesitant to trust, moving between a desire for intimacy and a need to protect yourself.",
      },
    ],
  },

  // ─── 2. YOUR BRAIN ON LOVE ────────────────────────────────────────────────
  "your-brain-on-love": {
    title: "Your Brain on Love",
    description:
      "Based on the research of Dr. Helen Fisher, this quiz uncovers your biological temperament and what you naturally seek in a partner.",
    cover_image_key: "brain_on_love",
    questions: [
      {
        id: "q1",
        text: "Which first date sounds most appealing to you?",
        options: [
          {
            text: "Trying a brand new, experimental restaurant or going spontaneously urban exploring.",
            value: 0,
          },
          {
            text: "Dinner at a beloved, classic spot with a great reputation, followed by a walk in a familiar park.",
            value: 1,
          },
          {
            text: "Attending a fascinating lecture, a political debate, or a competitive trivia night.",
            value: 2,
          },
          {
            text: "A long, deep conversation at a quiet, cozy wine bar where you can truly connect.",
            value: 3,
          },
        ],
      },
      {
        id: "q2",
        text: "When solving a complex problem, you are most likely to:",
        options: [
          {
            text: "Brainstorm a wide range of creative, out-of-the-box solutions.",
            value: 0,
          },
          {
            text: "Follow a proven plan or look at what has worked for others in the past.",
            value: 1,
          },
          {
            text: "Break it down into a logical system of pros and cons, focusing on the most efficient solution.",
            value: 2,
          },
          {
            text: "Talk it through with others to understand how everyone feels about the potential outcomes.",
            value: 3,
          },
        ],
      },
      {
        id: "q3",
        text: "What are you most instinctively drawn to in a potential partner?",
        options: [
          {
            text: "Their spontaneous energy and boundless curiosity about the world.",
            value: 0,
          },
          {
            text: "Their loyalty, their strong moral character, and their dependable nature.",
            value: 1,
          },
          {
            text: "Their sharp wit, their intelligence, and their logical way of thinking.",
            value: 2,
          },
          {
            text: "Their kindness, their emotional intelligence, and their ability to empathize.",
            value: 3,
          },
        ],
      },
      {
        id: "q4",
        text: "On a free Saturday, you would feel most recharged by:",
        options: [
          {
            text: "Taking a last-minute road trip or trying a new, thrill-seeking hobby.",
            value: 0,
          },
          {
            text: "Working on a home project, spending time with family, or attending a community event.",
            value: 1,
          },
          {
            text: "Reading a non-fiction book, watching a documentary, or mastering a complex skill.",
            value: 2,
          },
          {
            text: "Having a long, meaningful brunch with a close friend to catch up on life.",
            value: 3,
          },
        ],
      },
      {
        id: "q5",
        text: "In a group conversation, you are typically the one who:",
        options: [
          {
            text: "Energizes the group with new ideas and amusing stories.",
            value: 0,
          },
          {
            text: "Upholds tradition and shares concrete facts and details.",
            value: 1,
          },
          {
            text: "Takes a direct stance, challenges ideas, and enjoys a good debate.",
            value: 2,
          },
          {
            text: "Makes sure everyone feels included and synthesizes different viewpoints.",
            value: 3,
          },
        ],
      },
      {
        id: "q6",
        text: "Which negative trait in a partner is the most difficult for you to handle?",
        options: [
          {
            text: "A rigid, unchanging routine and a lack of curiosity.",
            value: 0,
          },
          {
            text: "Someone who is unreliable or breaks social rules.",
            value: 1,
          },
          { text: "Someone who is indecisive or overly emotional.", value: 2 },
          {
            text: "Someone who is blunt, analytical, and seems unkind.",
            value: 3,
          },
        ],
      },
      {
        id: "q7",
        text: "Your ideal partnership is one where you...",
        options: [
          {
            text: "Explore the world and grow together through shared adventures.",
            value: 0,
          },
          {
            text: "Build a secure and predictable life with a loyal teammate.",
            value: 1,
          },
          {
            text: "Challenge each other intellectually and achieve goals as a team.",
            value: 2,
          },
          {
            text: "Share your deepest feelings and build an unbreakable soulmate connection.",
            value: 3,
          },
        ],
      },
    ],
    results: [
      {
        code: "explorer",
        name: "The Explorer",
        traits: ["Adventurous", "Creative", "Spontaneous", "Dopamine-System"],
        tagline: "You crave novelty and a partner who's up for anything.",
        description:
          "You are curious, creative, and thrive on novelty and adventure. You are drawn to people who can be your partner in exploration.",
      },
      {
        code: "builder",
        name: "The Builder",
        traits: ["Loyal", "Traditional", "Calm", "Serotonin-System"],
        tagline: "Loyalty and stability are your foundation for love.",
        description:
          "You are calm, social, and a guardian of tradition. You value stability and are drawn to create a secure home and community with a reliable partner.",
      },
      {
        code: "director",
        name: "The Director",
        traits: ["Analytical", "Decisive", "Direct", "Testosterone-System"],
        tagline: "You need an intellectual equal who can keep up.",
        description:
          "You are direct, decisive, and logical. You excel at rule-based systems and are drawn to partners who can be your intellectual equal.",
      },
      {
        code: "negotiator",
        name: "The Negotiator",
        traits: ["Empathetic", "Intuitive", "Holistic", "Estrogen-System"],
        tagline: "Deep emotional bonds are what make your world go round.",
        description:
          "You are intuitive, empathetic, and see the big picture. You excel at connecting with people and are drawn to partners with whom you can share a deep emotional bond.",
      },
    ],
  },

  // ─── 3. IS IT CHEATING? ───────────────────────────────────────────────────
  "is-it-cheating": {
    title: "Is It Cheating?",
    description:
      "Liking an ex's photo at 2 AM? Keeping a 'work spouse' secret? This quiz explores the grey areas of modern relationships to find your personal boundaries.",
    cover_image_key: "cheating",
    questions: [
      {
        id: "q1",
        text: "Your partner is still friends with their ex and texts them occasionally. Is it cheating?",
        options: [
          {
            text: "Yes, any communication with an ex is a red flag.",
            value: 0,
          },
          {
            text: "It depends. If it's out in the open, it's fine. Secrecy is the problem.",
            value: 1,
          },
          {
            text: "It's not cheating, but it would make me feel insecure.",
            value: 2,
          },
          {
            text: "No, it's mature to be on good terms with a past partner.",
            value: 3,
          },
        ],
      },
      {
        id: "q2",
        text: "Your partner has a 'work spouse' they have inside jokes with and complain to about their job. Is it cheating?",
        options: [
          {
            text: "Yes, that's an emotional affair, plain and simple.",
            value: 0,
          },
          { text: "Only if they hide the friendship from me.", value: 1 },
          {
            text: "It depends on the content. Work complaints are fine, relationship complaints are not.",
            value: 2,
          },
          {
            text: "No, it's a normal and healthy part of having a social life at work.",
            value: 3,
          },
        ],
      },
      {
        id: "q3",
        text: "Your partner regularly likes the Instagram stories and photos of an attractive influencer they don't know. Is it cheating?",
        options: [
          {
            text: "Yes, it's a public act of disrespect to our relationship.",
            value: 0,
          },
          {
            text: "It's not cheating, but it's definitely in poor taste.",
            value: 1,
          },
          {
            text: "It's a little weird, but I wouldn't call it 'cheating.'",
            value: 2,
          },
          {
            text: "No, it's just harmless scrolling and has no meaning.",
            value: 3,
          },
        ],
      },
      {
        id: "q4",
        text: "Your partner goes out for a one-on-one dinner with a friend of the gender they're attracted to, and doesn't tell you beforehand. Is it cheating?",
        options: [
          { text: "Yes, the act and the secrecy are both cheating.", value: 0 },
          {
            text: "The dinner isn't cheating, but hiding it is a major breach of trust.",
            value: 1,
          },
          {
            text: "It's not cheating, but I'd be hurt they didn't feel they could tell me.",
            value: 2,
          },
          {
            text: "No, they are allowed to have private friendships.",
            value: 3,
          },
        ],
      },
      {
        id: "q5",
        text: "Your partner has a secret financial account (savings, credit card) that you don't know about. Is it cheating?",
        options: [
          {
            text: "Yes, financial infidelity is as bad as physical infidelity.",
            value: 0,
          },
          {
            text: "It depends on the reason. Hiding debt is a problem, saving for a surprise isn't.",
            value: 1,
          },
          {
            text: "It makes me uneasy. We should be transparent about money.",
            value: 2,
          },
          {
            text: "No, everyone is entitled to their own financial privacy.",
            value: 3,
          },
        ],
      },
      {
        id: "q6",
        text: "Your partner keeps their phone locked and angled away from you when they're texting. Is it cheating?",
        options: [
          {
            text: "Yes, that's classic hiding behavior and a huge red flag.",
            value: 0,
          },
          {
            text: "It's not proof of cheating, but it's definitely a sign that trust is broken.",
            value: 1,
          },
          {
            text: "It makes me suspicious, but it could just be a habit.",
            value: 2,
          },
          {
            text: "No, everyone deserves privacy with their personal conversations.",
            value: 3,
          },
        ],
      },
      {
        id: "q7",
        text: "Your partner 'forgets' to mention they ran into their attractive ex at the coffee shop. Is it cheating?",
        options: [
          { text: "Yes, lying by omission is still a betrayal.", value: 0 },
          {
            text: "It depends. If it was just a quick 'hello,' it's not a big deal.",
            value: 1,
          },
          {
            text: "It's not cheating, but the lack of transparency is the real issue.",
            value: 2,
          },
          {
            text: "No, it was probably a meaningless interaction not worth mentioning.",
            value: 3,
          },
        ],
      },
    ],
    results: [
      {
        code: "hardliner",
        name: "The Hardliner",
        traits: [
          "Clear Boundaries",
          "Traditionalist",
          "Principled",
          "Unambiguous",
        ],
        tagline: "You have clear lines that should never be crossed.",
        description:
          "You have a very clear and traditional definition of fidelity. For you, trust is built on unambiguous lines that should not be crossed.",
      },
      {
        code: "transparency_proponent",
        name: "The Transparency Proponent",
        traits: [
          "Honesty-Focused",
          "Contextual",
          "Trusting-but-Vigilant",
          "Open",
        ],
        tagline: "The crime is the cover-up — honesty fixes everything.",
        description:
          "For you, the crime is the cover-up. You believe most actions are okay as long as they are done with complete honesty and transparency.",
      },
      {
        code: "nuance_navigator",
        name: "The Nuance Navigator",
        traits: ["Flexible", "Intent-Focused", "Modern", "Communicative"],
        tagline: "Context and intent matter more than rigid rules.",
        description:
          "You see the grey areas. Your judgment depends on the context and intent behind an action, and you believe most issues can be solved with a good conversation.",
      },
      {
        code: "high_trust_liberal",
        name: "The High-Trust Liberal",
        traits: ["Relaxed", "Privacy-Focused", "Independent", "Unconcerned"],
        tagline: "You give freedom and trust until proven otherwise.",
        description:
          "You believe in giving your partner a high degree of trust and freedom. You value privacy and autonomy, and you're not easily made jealous.",
      },
    ],
  },

  // ─── 4. COMEDY LOVE LANGUAGE ──────────────────────────────────────────────
  "comedy-love-language": {
    title: "Comedy Love Language",
    description:
      "What makes you laugh out loud? Discover your unique comedic voice and who you'll share the best inside jokes with.",
    cover_image_key: "comedy",
    questions: [
      {
        id: "q1",
        text: "What's your go-to way to make a friend laugh?",
        options: [
          {
            text: "A clever, sarcastic comment about the situation.",
            value: 0,
          },
          { text: "A truly terrible pun or a silly face.", value: 1 },
          {
            text: "Recounting a funny, absurd thing that happened to me recently.",
            value: 2,
          },
          {
            text: "A playful, teasing jab at them that they know comes from a place of love.",
            value: 3,
          },
        ],
      },
      {
        id: "q2",
        text: "Which type of comedy show are you most likely to watch?",
        options: [
          {
            text: "A witty British panel show with lots of quick-fire wordplay.",
            value: 0,
          },
          {
            text: "An absurd sketch comedy show where anything can happen.",
            value: 1,
          },
          {
            text: "A stand-up special based on relatable, everyday observations.",
            value: 2,
          },
          {
            text: "A celebrity roast where no one is safe from the jokes.",
            value: 3,
          },
        ],
      },
      {
        id: "q3",
        text: "A friend trips on the sidewalk in a harmless but funny way. Your first reaction is to:",
        options: [
          { text: "Say dryly, 'Impressive dance moves.'", value: 0 },
          {
            text: "Exaggerate a trip and fall yourself in solidarity.",
            value: 1,
          },
          {
            text: "Laugh and say, 'Oh man, that reminds me of the time when...'",
            value: 2,
          },
          {
            text: "Laugh, help them up, and say 'Looks like the pavement had it out for you.'",
            value: 3,
          },
        ],
      },
      {
        id: "q4",
        text: "Your favorite kind of meme usually involves:",
        options: [
          {
            text: "A clever, multi-layered text caption that makes you think.",
            value: 0,
          },
          {
            text: "A completely absurd or nonsensical image that makes no sense.",
            value: 1,
          },
          {
            text: "Something highly relatable with a caption like 'When you accidentally...'",
            value: 2,
          },
          {
            text: "Something with a dark or edgy twist that pushes the envelope.",
            value: 3,
          },
        ],
      },
      {
        id: "q5",
        text: "When you're trying to be flirty, your humor is most likely to be:",
        options: [
          { text: "Quick, witty banter and clever compliments.", value: 0 },
          {
            text: "Endearingly awkward or silly jokes to break the ice.",
            value: 1,
          },
          {
            text: "Sharing funny, personal stories to build a real connection.",
            value: 2,
          },
          { text: "Playful teasing and a bit of a challenge.", value: 3 },
        ],
      },
      {
        id: "q6",
        text: "Someone tells a joke that's objectively terrible. You:",
        options: [
          {
            text: "Point out the logical flaw in the joke's premise with a smile.",
            value: 0,
          },
          {
            text: "Laugh anyway, because the badness of the joke is the funniest part.",
            value: 1,
          },
          {
            text: "Give a polite smile and hope the conversation moves on.",
            value: 2,
          },
          { text: "Tell an even worse joke on purpose to be funny.", value: 3 },
        ],
      },
      {
        id: "q7",
        text: "The funniest people are those who are:",
        options: [
          { text: "Exceptionally clever and quick-witted.", value: 0 },
          { text: "Unafraid to be completely silly and absurd.", value: 1 },
          {
            text: "Great observers of the little absurdities of everyday life.",
            value: 2,
          },
          { text: "Bold and willing to joke about almost anything.", value: 3 },
        ],
      },
    ],
    results: [
      {
        code: "wit",
        name: "The Wit",
        traits: ["Sarcastic", "Clever", "Dry", "Wordplay"],
        tagline: "Your humor is your intelligence at play — sharp and clever.",
        description:
          "Your humor is your intelligence at play. You love clever wordplay, dry sarcasm, and a perfectly timed witty observation.",
      },
      {
        code: "goofball",
        name: "The Goofball",
        traits: ["Silly", "Playful", "Absurdist", "Lighthearted"],
        tagline: "You'll do anything for a laugh, and that's your superpower.",
        description:
          "You love to laugh and aren't afraid to be silly. Your humor is playful, absurd, and finds joy in puns, goofy faces, and lighthearted fun.",
      },
      {
        code: "storyteller",
        name: "The Storyteller",
        traits: ["Relatable", "Observational", "Anecdotal", "Charming"],
        tagline: "You find comedy in everyday life — relatable and charming.",
        description:
          "You find humor in the everyday. You're a master of the funny anecdote and the relatable observation that makes everyone say, 'That's so true!'",
      },
      {
        code: "provocateur",
        name: "The Provocateur",
        traits: ["Edgy", "Teasing", "Banter-loving", "Bold"],
        tagline: "Your humor has an edge — you love banter and bold jokes.",
        description:
          "Your humor has a bit of an edge. You love playful teasing, pushing boundaries, and a bit of dark humor, all in the name of a good laugh.",
      },
    ],
  },

  // ─── 5. THE ICK DETECTOR ──────────────────────────────────────────────────
  "the-ick-detector": {
    title: "The Ick Detector",
    description:
      "What do you notice first on a dating profile? This quiz, inspired by the social media trend, reveals if you're looking for red flags, green flags, or those quirky 'beige' flags.",
    cover_image_key: "ick",
    questions: [
      {
        id: "q1",
        text: "You see a dating profile where every single photo is a group shot. You think:",
        options: [
          {
            text: "'Major red flag. They're probably hiding what they look like.'",
            value: 0,
          },
          {
            text: "'Green flag! They have a great social life and lots of friends.'",
            value: 1,
          },
          {
            text: "'Beige flag. Time to play \"Where's Waldo?\" to figure out who they are.'",
            value: 2,
          },
          {
            text: "'I don't overthink it. A picture is just a picture.'",
            value: 3,
          },
        ],
      },
      {
        id: "q2",
        text: "A match's bio says, 'Looking for someone who doesn't take themselves too seriously.' This is a:",
        options: [
          {
            text: "Red flag. It often means they won't take my feelings seriously either.",
            value: 0,
          },
          {
            text: "Green flag. It suggests they are fun-loving and easygoing.",
            value: 1,
          },
          {
            text: "Beige flag. It's a super generic line that tells me almost nothing.",
            value: 2,
          },
          {
            text: "A good sign. It shows a desire for a low-drama connection.",
            value: 3,
          },
        ],
      },
      {
        id: "q3",
        text: "On a first date, they are exceptionally polite to the waitstaff. You see this as:",
        options: [
          {
            text: "The bare minimum. Noticing it feels weird because it should be standard.",
            value: 0,
          },
          {
            text: "A massive green flag. It's a true sign of good character.",
            value: 1,
          },
          {
            text: "A nice detail to add to my overall impression of them.",
            value: 2,
          },
          {
            text: "Just normal behavior. It doesn't tell me much either way.",
            value: 3,
          },
        ],
      },
      {
        id: "q4",
        text: "Their profile mentions they put pineapple on pizza. For you, this is a:",
        options: [
          { text: "Red flag. We are fundamentally incompatible.", value: 0 },
          {
            text: "Green flag. They're not afraid of a little controversy.",
            value: 1,
          },
          {
            text: "Beige flag. It's a quirky detail that's kind of amusing.",
            value: 2,
          },
          {
            text: "Non-issue. I truly do not care about their pizza toppings.",
            value: 3,
          },
        ],
      },
      {
        id: "q5",
        text: "A match mentions their ex in a negative way on the first date. You think:",
        options: [
          {
            text: "Red flag. They're clearly not over their past relationship.",
            value: 0,
          },
          {
            text: "Green flag. It shows they're being open and honest with me from the start.",
            value: 1,
          },
          {
            text: "Beige flag. It's a bit awkward, but everyone has baggage.",
            value: 2,
          },
          {
            text: "I'd listen to the story before making a judgment.",
            value: 3,
          },
        ],
      },
      {
        id: "q6",
        text: "Their profile says 'Fluent in sarcasm.' This is a:",
        options: [
          {
            text: "Red flag. This often masks genuine negativity or meanness.",
            value: 0,
          },
          {
            text: "Green flag. I love witty banter and a sharp sense of humor.",
            value: 1,
          },
          {
            text: "Beige flag. It's another one of those lines everyone uses.",
            value: 2,
          },
          {
            text: "A sign that we'll probably have a similar sense of humor.",
            value: 3,
          },
        ],
      },
      {
        id: "q7",
        text: "When you're getting to know someone, your 'radar' is most attuned to:",
        options: [
          {
            text: "Signs of inconsistency or potential problems down the road.",
            value: 0,
          },
          {
            text: "Signs of kindness, stability, and good character.",
            value: 1,
          },
          {
            text: "The funny, strange, or unique things that make them different.",
            value: 2,
          },
          {
            text: "The overall vibe and connection, rather than specific details.",
            value: 3,
          },
        ],
      },
    ],
    results: [
      {
        code: "red_flag_detector",
        name: "The Red Flag Detector",
        traits: ["Cautious", "Protective", "Analytical", "Pragmatic"],
        tagline: "You spot deal-breakers early — better safe than sorry.",
        description:
          "You prioritize safety and stability, and you've got a keen eye for spotting potential deal-breakers early on. You'd rather be safe than sorry.",
      },
      {
        code: "green_flag_seeker",
        name: "The Green Flag Seeker",
        traits: ["Optimistic", "Positive", "Character-Focused", "Hopeful"],
        tagline:
          "You look for the good in people — kindness and character first.",
        description:
          "You believe in looking for the good in people. Your radar is tuned to find signs of kindness, emotional maturity, and good character.",
      },
      {
        code: "beige_flag_collector",
        name: "The Beige Flag Collector",
        traits: ["Curious", "Quirk-Appreciator", "Humorous", "Observant"],
        tagline: "You're fascinated by quirks that make people unique.",
        description:
          "You're fascinated by the weird and wonderful details that make people unique. You find charm in the quirks that others might overlook.",
      },
      {
        code: "balanced_observer",
        name: "The Balanced Observer",
        traits: ["Nuanced", "Holistic", "Go-with-the-Flow", "Open-Minded"],
        tagline: "You take the whole person in before making a judgment call.",
        description:
          "You take a measured approach. You don't jump to conclusions, preferring to see the whole person before deciding if something is a red, green, or beige flag.",
      },
    ],
  },

  // ─── 6. FIXER OR LISTENER? ────────────────────────────────────────────────
  "fixer-or-listener": {
    title: "Fixer or Listener?",
    description:
      "When your partner is struggling, are you a problem-solver, an empathetic listener, a cheerleader, or a steady rock? Discover your support style.",
    cover_image_key: "fixer_vs_listener",
    questions: [
      {
        id: "q1",
        text: "Your partner had a terrible day at work. Your first instinct is to say:",
        options: [
          {
            text: "'Okay, let's break it down. What's the problem and how can we fix it?'",
            value: 0,
          },
          {
            text: "'That sounds awful. I'm so sorry you went through that. Tell me everything.'",
            value: 1,
          },
          {
            text: "'Don't worry, you're amazing at your job. Tomorrow is a new day.'",
            value: 2,
          },
          {
            text: "'I'm here for you. Just let me know if you want to talk or just sit in silence.'",
            value: 3,
          },
        ],
      },
      {
        id: "q2",
        text: "When you are feeling down, what do you need most from a partner?",
        options: [
          {
            text: "Practical help in solving the problem that's making me feel down.",
            value: 0,
          },
          {
            text: "A hug and a safe space to vent my feelings without judgment.",
            value: 1,
          },
          {
            text: "Someone to remind me of my strengths and help me see the bright side.",
            value: 2,
          },
          {
            text: "A quiet, reassuring presence that doesn't pressure me to talk.",
            value: 3,
          },
        ],
      },
      {
        id: "q3",
        text: "Your partner is stressed about a big upcoming project. You show you care by:",
        options: [
          {
            text: "Offering to proofread their work or help them with research.",
            value: 0,
          },
          {
            text: "Constantly checking in on their emotional state and offering comfort.",
            value: 1,
          },
          {
            text: "Sending them motivational quotes and telling them how capable they are.",
            value: 2,
          },
          {
            text: "Taking care of all the household chores so they have total focus.",
            value: 3,
          },
        ],
      },
      {
        id: "q4",
        text: "The phrase 'I'm here for you' primarily means...",
        options: [
          { text: "...to help you find a solution.", value: 0 },
          { text: "...to listen to your feelings.", value: 1 },
          { text: "...to cheer you on.", value: 2 },
          { text: "...to be a silent, steady presence.", value: 3 },
        ],
      },
      {
        id: "q5",
        text: "Your partner is feeling sick. You are most likely to:",
        options: [
          {
            text: "Go to the pharmacy with a list of symptoms to find the most effective medicine.",
            value: 0,
          },
          {
            text: "Sit with them, fluff their pillows, and ask them how they're feeling every hour.",
            value: 1,
          },
          {
            text: "Tell them, 'You'll feel better in no time!' and put on their favorite comedy.",
            value: 2,
          },
          {
            text: "Quietly bring them tea and a blanket, then let them rest.",
            value: 3,
          },
        ],
      },
      {
        id: "q6",
        text: "When a friend is heartbroken, you are known for:",
        options: [
          {
            text: "Giving them a step-by-step plan for how to move on.",
            value: 0,
          },
          {
            text: "Letting them cry on your shoulder for as long as they need.",
            value: 1,
          },
          {
            text: "Reminding them of how amazing they are and that there are other fish in the sea.",
            value: 2,
          },
          {
            text: "Just showing up at their house with their favorite food and not saying much.",
            value: 3,
          },
        ],
      },
      {
        id: "q7",
        text: "A supportive partner is one who primarily provides:",
        options: [
          { text: "Solutions.", value: 0 },
          { text: "Comfort.", value: 1 },
          { text: "Encouragement.", value: 2 },
          { text: "Stability.", value: 3 },
        ],
      },
    ],
    results: [
      {
        code: "fixer",
        name: "The Fixer",
        traits: [
          "Solution-Oriented",
          "Practical",
          "Action-Based",
          "Problem-Solver",
        ],
        tagline:
          "When someone's struggling, you roll up your sleeves and solve it.",
        description:
          "You show support by doing. When someone is struggling, your instinct is to find a practical solution and take action to fix the problem.",
      },
      {
        code: "empath",
        name: "The Empath",
        traits: ["Emotion-Focused", "Nurturing", "Listener", "Comforting"],
        tagline: "You offer a shoulder, a safe space, and zero judgment.",
        description:
          "You believe support is about emotional connection. Your instinct is to offer a listening ear, a shoulder to cry on, and a safe space to feel.",
      },
      {
        code: "cheerleader",
        name: "The Cheerleader",
        traits: ["Optimistic", "Encouraging", "Motivational", "Positive"],
        tagline:
          "You lift people up with optimism and relentless encouragement.",
        description:
          "You provide support through relentless positivity. Your instinct is to lift spirits, offer encouragement, and remind people of their strengths.",
      },
      {
        code: "rock",
        name: "The Rock",
        traits: ["Steady", "Calm", "Present", "Unwavering"],
        tagline: "You show up, stay calm, and let your presence do the work.",
        description:
          "You offer support through your quiet, unwavering presence. You believe just being there, calm and steady, is the most powerful form of support.",
      },
    ],
  },
};

// ─── CALCULATION ─────────────────────────────────────────────────────────────

export function calculateDominantTrait(
  answers: number[],
  results: QuizResult[],
): QuizResult {
  const counts: Record<number, number> = {};
  answers.forEach((val) => {
    counts[val] = (counts[val] || 0) + 1;
  });
  let maxVal = 0,
    maxCount = 0;
  for (const [val, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxVal = Number(val);
    }
  }
  return results[maxVal] || results[0];
}

// ─── NEXT QUIZ SUGGESTIONS (per quiz) ────────────────────────────────────────

export const NEXT_QUIZZES: Record<
  string,
  { title: string; slug: string; cover: string }[]
> = {
  "clingy-or-cool": [
    {
      title: "Fixer or Listener?",
      slug: "fixer-or-listener",
      cover: "fixer_vs_listener",
    },
    {
      title: "Vent or Vanish?",
      slug: "vent-or-vanish",
      cover: "vent_vs_vanish",
    },
    {
      title: "Your Brain on Love",
      slug: "your-brain-on-love",
      cover: "brain_on_love",
    },
  ],
  "your-brain-on-love": [
    {
      title: "Clingy or Cool?",
      slug: "clingy-or-cool",
      cover: "clingy_vs_cool",
    },
    {
      title: "Comedy Love Language",
      slug: "comedy-love-language",
      cover: "comedy",
    },
    { title: "The Ick Detector", slug: "the-ick-detector", cover: "ick" },
  ],
  "is-it-cheating": [
    {
      title: "Clingy or Cool?",
      slug: "clingy-or-cool",
      cover: "clingy_vs_cool",
    },
    {
      title: "Fixer or Listener?",
      slug: "fixer-or-listener",
      cover: "fixer_vs_listener",
    },
    {
      title: "Comedy Love Language",
      slug: "comedy-love-language",
      cover: "comedy",
    },
  ],
  "comedy-love-language": [
    { title: "The Ick Detector", slug: "the-ick-detector", cover: "ick" },
    { title: "Is It Cheating?", slug: "is-it-cheating", cover: "cheating" },
    {
      title: "Your Brain on Love",
      slug: "your-brain-on-love",
      cover: "brain_on_love",
    },
  ],
  "the-ick-detector": [
    { title: "Is It Cheating?", slug: "is-it-cheating", cover: "cheating" },
    {
      title: "Comedy Love Language",
      slug: "comedy-love-language",
      cover: "comedy",
    },
    {
      title: "Clingy or Cool?",
      slug: "clingy-or-cool",
      cover: "clingy_vs_cool",
    },
  ],
  "fixer-or-listener": [
    {
      title: "Clingy or Cool?",
      slug: "clingy-or-cool",
      cover: "clingy_vs_cool",
    },
    {
      title: "Your Brain on Love",
      slug: "your-brain-on-love",
      cover: "brain_on_love",
    },
    { title: "The Ick Detector", slug: "the-ick-detector", cover: "ick" },
  ],
};

// Default fallback for quizzes not in the map
export const DEFAULT_NEXT_QUIZZES = [
  { title: "Clingy or Cool?", slug: "clingy-or-cool", cover: "clingy_vs_cool" },
  {
    title: "Your Brain on Love",
    slug: "your-brain-on-love",
    cover: "brain_on_love",
  },
  { title: "Is It Cheating?", slug: "is-it-cheating", cover: "cheating" },
];

// ─── PREVIEW METADATA (for quizzes not yet playable on web) ──────────────────
// Used on the "coming soon" fallback page to show quiz info + waitlist capture.

export interface QuizPreview {
  title: string;
  description: string;
  cover_image_key: string;
  questionCount: number;
}

export const QUIZ_PREVIEWS: Record<string, QuizPreview> = {
  "vent-or-vanish": {
    title: "Vent or Vanish?",
    description:
      "Do you need to talk it out right now, or do you need a moment to think? Discover your natural rhythm for communication.",
    cover_image_key: "vent_vs_vanish",
    questionCount: 7,
  },
  "fight-or-flight": {
    title: "Fight or Flight?",
    description:
      "Discover your approach to disagreements and what you need to feel heard.",
    cover_image_key: "fight_vs_flight",
    questionCount: 7,
  },
  "dreamer-or-realist": {
    title: "Dreamer or Realist?",
    description:
      "Are you driven by big ideas, practical realities, logical analysis, or gut feelings?",
    cover_image_key: "dreamer_vs_realist",
    questionCount: 7,
  },
  "roots-vs-wings": {
    title: "Roots vs. Wings",
    description:
      "Do you thrive on a predictable routine and a solid home base, or are you constantly seeking freedom and new horizons?",
    cover_image_key: "roots_vs_wings",
    questionCount: 7,
  },
  "your-dating-dna": {
    title: "Your Dating DNA",
    description:
      "Initial assessment to understand core personality and dating styles.",
    cover_image_key: "dating_dna",
    questionCount: 5,
  },
  "the-10-year-plan": {
    title: "The 10-Year Plan",
    description:
      "What is the grand plan for your one precious life? Uncover your core ambitions and your vision for the future.",
    cover_image_key: "10_year",
    questionCount: 7,
  },
  "twin-flame-or-solo-flyer": {
    title: "Twin Flame or Solo Flyer?",
    description:
      "How do you and a partner build a life together while honoring your individual selves?",
    cover_image_key: "twin_vs_solo",
    questionCount: 7,
  },
  "making-amends": {
    title: "Making Amends",
    description:
      "What does a sincere apology look like to you? Discover how you make amends and what you need to hear to truly forgive.",
    cover_image_key: "amends",
    questionCount: 7,
  },
  "early-bird-or-night-owl": {
    title: "Early Bird or Night Owl?",
    description:
      "Are you powered by the sunrise or the moonlight? Uncover your natural biological rhythm.",
    cover_image_key: "early_vs_night",
    questionCount: 7,
  },
  "spender-or-saver": {
    title: "Spender or Saver?",
    description:
      "Is money a source of anxiety, a tool for freedom, or a measure of success?",
    cover_image_key: "spender_vs_saver",
    questionCount: 7,
  },
  "all-in-or-play-it-safe": {
    title: "All In or Play It Safe?",
    description:
      "Are you a cautious saver or a bold investor? Discover your comfort level with financial risk.",
    cover_image_key: "all_in_vs_safe",
    questionCount: 7,
  },
  "the-bill-splitter": {
    title: "The Bill Splitter",
    description:
      "How do you approach money and financial decisions in a partnership?",
    cover_image_key: "bill_splitter",
    questionCount: 8,
  },
  "passport-personality": {
    title: "Passport Personality",
    description:
      "Are you a luxury lounger or a backpacker explorer? Discover how you experience the world.",
    cover_image_key: "passport",
    questionCount: 7,
  },
  "planner-or-winger": {
    title: "Planner or Winger?",
    description: "Do you feel best with a detailed schedule or an open road?",
    cover_image_key: "planner_vs_winger",
    questionCount: 7,
  },
  "foodie-or-fuel": {
    title: "Foodie or Fuel?",
    description:
      "Is food an art, fuel, comfort, or convenience? Discover your personal approach to eating.",
    cover_image_key: "foodie_vs_fuel",
    questionCount: 7,
  },
  "the-saturday-test": {
    title: "The Saturday Test",
    description:
      "What energizes you in your free time? Discover if you're a Creator, a Thinker, an Adventurer, or a Connector.",
    cover_image_key: "saturday",
    questionCount: 7,
  },
  "the-glow-up-guide": {
    title: "The Glow Up Guide",
    description:
      "How do you evolve? Discover if you're a steady improver, a big leap-taker, a reflective learner, or a collaborative builder.",
    cover_image_key: "glowup",
    questionCount: 7,
  },
  "soul-recharge": {
    title: "Soul Recharge",
    description:
      "When your personal battery is at zero, what plugs you back in?",
    cover_image_key: "soul_recharge",
    questionCount: 7,
  },
  "pick-your-power": {
    title: "Pick Your Power",
    description:
      "If you could have any superpower, what would it be? This fun quiz reveals your secret personality.",
    cover_image_key: "power",
    questionCount: 7,
  },
  "saint-or-sinner": {
    title: "Saint or Sinner?",
    description:
      "What guides your decisions when things get complicated? Uncover your core ethical principles.",
    cover_image_key: "saint_vs_sinner",
    questionCount: 7,
  },
  "meet-the-parents": {
    title: "Meet the Parents",
    description:
      "Are holidays a huge family affair or a quiet getaway? Discover your approach to navigating family.",
    cover_image_key: "parents",
    questionCount: 7,
  },
  "the-roommate-test": {
    title: "The Roommate Test",
    description:
      "Are you a meticulous organizer, a cozy clutter-bug, or a practical DIYer?",
    cover_image_key: "roommate",
    questionCount: 7,
  },
  "city-slicker-country-soul": {
    title: "City Slicker / Country Soul",
    description:
      "Discover the setting where you feel most at home: the city, the suburbs, the country, or always on the move.",
    cover_image_key: "city_vs_country",
    questionCount: 7,
  },
  "squad-goals": {
    title: "Squad Goals",
    description:
      "Discover how you connect with others and your ideal social circle.",
    cover_image_key: "squad",
    questionCount: 7,
  },
  "recharge-mode": {
    title: "Recharge Mode",
    description:
      "Discover how you recharge your energy and your ideal social setting.",
    cover_image_key: "recharge",
    questionCount: 8,
  },
};
