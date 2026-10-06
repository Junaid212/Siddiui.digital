/**
 * knowledgeEngine.js — Grounded Knowledge Engine for Ask SID
 * "Marketing Reclassified: A Principle-First Approach" by M. Q. Siddiqui
 *
 * Grounded in approved Marketing Reclassified content:
 * - Clear, easy-to-scan structured sections:
 *   1. Understanding Your Situation
 *   2. Marketing Reclassified Perspective
 *   3. Questions to Consider
 *   4. Possible Direction
 *   5. Relevant Book Section (chapter, section, page, online link)
 *   6. Continue Exploring (clickable follow-up paths)
 * - Grounded indicator
 * - Selective SID Advisory triggers for complex strategic challenges
 */

export const BOOK_METADATA = {
  title: "Marketing Reclassified: A Principle-First Approach",
  author: "M. Q. Siddiqui",
  slug: "marketing-reclassified-principle-first-approach",
  publicationUrl: "/publications/marketing-reclassified-principle-first-approach",
  fullPrice: "$49.99",
  onlinePrice: "$20.00",
  summary:
    "A principle-first strategic playbook challenging transactional and promotional myopia; establishing marketing as an organizational leadership discipline centered on authentic value creation, customer relevance, strategic alignment, and sustainable growth."
};

export const EXAMPLE_QUESTIONS = [
  "Our marketing generates leads, but customers aren't converting. What should we examine?",
  "How do I know whether our value proposition is still relevant?",
  "Our competitors are offering lower prices. Should we reduce ours?",
  "How can we make our marketing more strategic?",
  "We are growing, but customer loyalty is declining. What could be happening?"
];

export const PRINCIPLE_KNOWLEDGE_BASE = [
  {
    id: "lead-conversion-friction",
    keywords: ["lead", "conversion", "converting", "leads", "funnel", "bounce", "drop-off", "close rate", "pipeline"],
    understanding:
      "Your promotional activity is attracting initial buyer curiosity, but prospects hesitate, stall, or abandon before committing to a commercial transaction.",
    perspective:
      "In Marketing Reclassified, lead-conversion failure is rarely a tactical closing problem. It is an upstream misalignment between promotional promise and customer reality. When campaigns buy superficial attention instead of addressing genuine customer intent, the business creates a promise deficit. The customer experiences cognitive friction at the moment of commitment because the promotional narrative ran ahead of operational substance.",
    questionsToConsider: [
      "Are your demand generation campaigns attracting buyers with authentic intent, or merely harvesting contact details with inflated incentives?",
      "Does the post-opt-in customer experience maintain the sophistication, tone, and clarity of your initial advertisement?",
      "What unaddressed risk, ambiguity, or hesitation is forcing qualified prospects to pause right before converting?"
    ],
    possibleDirection:
      "Conduct a rigorous audit of the Promise-to-Delivery Continuum. Rather than deploying high-pressure sales automation or lowering prices, tighten your qualifying criteria at the point of inquiry so every prospective lead is already grounded in your authentic value proposition.",
    relevantBookSection: {
      book: BOOK_METADATA.title,
      chapter: "Chapter 3: The Illusions of Modern Marketing",
      section: "Beyond the Lead Generation Treadmill",
      page: "Page 58",
      readUrl: BOOK_METADATA.publicationUrl
    },
    continueExploring: [
      "How does increasing lead volume inadvertently accelerate value drift?",
      "What diagnostic should leadership run on product-promise fit?",
      "How do we distinguish curiosity clicks from commercial intent?"
    ],
    showAdvisoryCta: false,
    grounded: true
  },
  {
    id: "value-proposition-relevance",
    keywords: ["value proposition", "relevance", "relevant", "differentiation", "market fit", "drift", "outdated", "offer"],
    understanding:
      "You are assessing whether the core promise and functional value of your organization still correspond to the evolving reality and priorities of your target market.",
    perspective:
      "Marketing Reclassified establishes that value proposition decay is seldom sudden; it occurs through gradual 'Value Drift.' Organizations frequently confuse familiarity with relevance. When customer context shifts—due to economic pressure, technology, or category maturation—a proposition that once resonated begins to sound formulaic and disconnected. True relevance requires continuous alignment with the customer's authentic worldview rather than cosmetic rebranding.",
    questionsToConsider: [
      "Has your target customer's definition of risk or progress changed in the last 12 months while your core messaging remained static?",
      "If your brand name were removed from your messaging, would customers immediately recognize your unique point of view?",
      "Are you defining value from your internal operational perspective or from the customer's lived friction points?"
    ],
    possibleDirection:
      "Deploy the Adaptive Value Framework: map your offering across Functional Utility, Emotional Resonance, and Strategic Trust. Remove legacy claims that no longer solve pressing customer dilemmas and restate your core contribution in uncompromisingly honest terms.",
    relevantBookSection: {
      book: BOOK_METADATA.title,
      chapter: "Chapter 2: The Adaptive Value Architecture",
      section: "Diagnosing Value Drift in Mature Markets",
      page: "Page 42",
      readUrl: BOOK_METADATA.publicationUrl
    },
    continueExploring: [
      "What are the earliest leading indicators of value drift?",
      "How do we interview customers without leading them to polite answers?",
      "How can an incumbent reclaim market leadership without discounting?"
    ],
    showAdvisoryCta: false,
    grounded: true
  },
  {
    id: "price-competition-discounting",
    keywords: ["price", "competitor", "cheaper", "discount", "margin", "pricing", "undercut", "cost", "reduce price", "lowering"],
    understanding:
      "Competitors are competing aggressively on price, creating commercial anxiety and tempting your organization to engage in retaliatory discounting.",
    perspective:
      "M. Q. Siddiqui argues in Marketing Reclassified that price is never merely a financial metric; it is an explicit communicator of perceived value and institutional confidence. Discounting to match lower-cost competitors commoditizes your own brand and signals to the market that your previous price was arbitrary. When you lower price in panic, you attract price-sensitive switchers who possess zero institutional loyalty and will abandon you the instant another competitor drops lower.",
    questionsToConsider: [
      "What authentic dimension of value (certainty, speed, domain mastery, risk mitigation) are you offering that cheaper competitors cannot replicate?",
      "Have you communicated your value clearly enough that a reasonable buyer can justify paying your current premium?",
      "Would reducing price solve the real customer hesitation, or does the customer simply not believe the full value claim?"
    ],
    possibleDirection:
      "Refuse the race to the bottom. Instead of cutting prices, re-bundle your offering to increase tangible customer certainty. Frame your price not against competitor price tags, but against the hidden cost and risk of choosing an inferior alternative.",
    relevantBookSection: {
      book: BOOK_METADATA.title,
      chapter: "Chapter 5: Price as a Dimension of Value",
      section: "Escaping the Commodity Trap & Pricing Integrity",
      page: "Page 94",
      readUrl: BOOK_METADATA.publicationUrl
    },
    continueExploring: [
      "How do we train our sales team to defend our price without apologizing?",
      "When is a tiered pricing architecture appropriate vs dangerous?",
      "How does price reduction erode operational reinvestment capacity?"
    ],
    showAdvisoryCta: false,
    grounded: true
  },
  {
    id: "strategic-vs-tactical",
    keywords: ["strategic", "tactical", "strategy", "tactics", "execution", "campaigns", "long-term", "alignment", "ad spend", "busywork"],
    understanding:
      "Your marketing team is trapped in a reactive cycle of tactical campaigns, output metrics, and promotional noise without cohesive strategic trajectory.",
    perspective:
      "A core thesis of Marketing Reclassified is that modern organizations have mistaken promotional activity for marketing strategy. Tactics are tools; strategy is the deliberate orchestration of distinct value to achieve defensible market positioning. When marketing is relegated to tactical execution, it becomes an uncoordinated cost center scrambling for vanity metrics rather than an executive discipline steering sustainable enterprise growth.",
    questionsToConsider: [
      "Can your leadership team articulate your marketing strategy without referencing specific channels, tools, or software platforms?",
      "Are your key marketing metrics tracking transactional outputs (impressions, clicks) or structural business health (customer lifetime trust, pricing power)?",
      "Does your marketing activity reinforce an overarching long-term moat or just generate short-term spikes?"
    ],
    possibleDirection:
      "Elevate marketing from tactical servicing to the Principle-First Leadership table. Establish explicit criteria for which opportunities your business will deliberately say NO to, anchoring every future initiative to long-term category leadership.",
    relevantBookSection: {
      book: BOOK_METADATA.title,
      chapter: "Chapter 1: The Principle-First Mandate",
      section: "Transcending Tactical Myopia: Marketing as Leadership",
      page: "Page 24",
      readUrl: BOOK_METADATA.publicationUrl
    },
    continueExploring: [
      "How should the CMO interact with the CEO and Board on marketing strategy?",
      "What frameworks prevent tactical drift during high-pressure quarters?",
      "How do we transition existing staff from tactical executors to strategic thinkers?"
    ],
    showAdvisoryCta: false,
    grounded: true
  },
  {
    id: "customer-loyalty-retention",
    keywords: ["loyalty", "retention", "churn", "repeat", "growing", "acquisition", "declining", "customer satisfaction", "attrition", "nps"],
    understanding:
      "Top-line customer acquisition looks healthy, but existing customers are quietly churning, revealing an unsustainable 'leaky bucket' dynamic.",
    perspective:
      "Marketing Reclassified calls this the 'Acquisition Illusion.' Organizations celebrate gross customer additions while ignoring the systematic erosion of their core base. Churn is rarely a customer loyalty program failure; it is an onboarding and ongoing relevance failure. When organizations allocate 90% of their creativity to enticing strangers and neglect the ongoing progress of existing customers, trust collapses and commercial momentum becomes an illusion.",
    questionsToConsider: [
      "What percentage of your senior marketing bandwidth is dedicated to existing customer success versus hunting new leads?",
      "At what precise post-purchase milestone does customer enthusiasm typically plateau or decay?",
      "Are your internal operational incentives rewarding new customer acquisition at the expense of sustainable customer retention?"
    ],
    possibleDirection:
      "Institute the Continuity Loop. Audit the post-purchase experience with the same intensity applied to top-of-funnel acquisition. Align leadership KPIs with Net Revenue Retention and Customer Progress rather than raw acquisition tallies.",
    relevantBookSection: {
      book: BOOK_METADATA.title,
      chapter: "Chapter 4: The Continuity Loop",
      section: "From Transactional Acquisition to Enduring Customer Equity",
      page: "Page 76",
      readUrl: BOOK_METADATA.publicationUrl
    },
    continueExploring: [
      "What is the mathematical threshold where churn overcomes acquisition speed?",
      "How do we design post-purchase touchpoints that deepen trust naturally?",
      "Should marketing and customer success be unified under a single mandate?"
    ],
    showAdvisoryCta: true, // Loyalty/churn overhaul qualifies for deeper advisory review
    grounded: true
  },
  {
    id: "complex-transformation-advisory",
    keywords: [
      "restructuring",
      "merger",
      "acquisition",
      "transformation",
      "turnaround",
      "reorganization",
      "board",
      "multi-million",
      "enterprise audit",
      "bespoke",
      "advisory",
      "private consultation"
    ],
    understanding:
      "You are confronting a structural, multi-dimensional organizational inflection point that encompasses leadership realignment, capital allocation, and extensive market repositioning.",
    perspective:
      "In Marketing Reclassified, deep enterprise friction requires structural diagnostic precision. While the core principle-first frameworks provide the conceptual scaffolding, executing a complete institutional turnaround demands rigorous stakeholder synchronization, private strategic audits, and custom navigational architecture tailored to your board-level reality.",
    questionsToConsider: [
      "Is the executive leadership team fundamentally aligned on the true identity and future contribution of the enterprise?",
      "What legacy operational dependencies or political inertia are blocking the necessary strategic realignment?",
      "Do internal teams possess the diagnostic objectivity required to evaluate your market positioning without protective bias?"
    ],
    possibleDirection:
      "Initiate a confidential, principle-first diagnostic review across executive leadership, separating core strategic value from operational noise before committing substantial capital to organizational change.",
    relevantBookSection: {
      book: BOOK_METADATA.title,
      chapter: "Chapter 7: The Synchronization Matrix",
      section: "Executive Alignment and Institutional Turnarounds",
      page: "Page 142",
      readUrl: BOOK_METADATA.publicationUrl
    },
    continueExploring: [
      "What framework diagnoses executive misalignment early?",
      "How do board mandates conflict with principle-first customer delivery?",
      "What steps protect institutional trust during restructuring?"
    ],
    showAdvisoryCta: true, // Explicitly triggers SID Advisory CTA!
    grounded: true
  }
];

/**
 * Diagnostic matcher grounded in Marketing Reclassified
 */
export function matchPrincipleInKnowledgeBase(query) {
  const cleanQ = String(query || "").toLowerCase();

  // Check off-topic
  const isBusinessOrMarketing = /market|business|customer|sales|price|growth|brand|strategy|value|product|lead|client|revenue|loyalty|purpose|company|service|team|enterprise|industry|retention|churn|funnel|advisory/i.test(
    cleanQ
  );

  let bestMatch = null;
  let highestScore = 0;

  for (const node of PRINCIPLE_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of node.keywords) {
      if (cleanQ.includes(kw)) {
        score += kw.length > 5 ? 3 : 2;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = node;
    }
  }

  if (highestScore >= 2 && bestMatch) {
    return { ...bestMatch, offTopic: false };
  }

  if (!isBusinessOrMarketing) {
    return {
      understanding:
        "You have submitted an inquiry that sits outside the scope of strategic marketing and business architecture.",
      perspective:
        "Ask SID is the dedicated digital companion to 'Marketing Reclassified: A Principle-First Approach' by M. Q. Siddiqui. The approved principles of the book do not provide enough basis for an authoritative answer to general or unrelated topics. Ask SID's purpose is to guide readers and leaders through strategic marketing, customer relevance, purposeful growth, and commercial dilemmas.",
      questionsToConsider: [
        "What specific marketing or business challenge is currently facing your organization?",
        "Are you exploring dilemmas regarding lead conversion, value proposition relevance, pricing integrity, or customer retention?"
      ],
      possibleDirection:
        "Please describe a challenge related to your business strategy, customer engagement, pricing, or market positioning. Ask SID will explore it through the approved frameworks of Marketing Reclassified.",
      relevantBookSection: {
        book: BOOK_METADATA.title,
        chapter: "Introduction",
        section: "A Principle-First Approach to Modern Marketing",
        page: "Page 12",
        readUrl: BOOK_METADATA.publicationUrl
      },
      continueExploring: [
        "Our marketing generates leads, but customers aren't converting. What should we examine?",
        "How do I know whether our value proposition is still relevant?",
        "Our competitors are offering lower prices. Should we reduce ours?"
      ],
      showAdvisoryCta: false,
      grounded: true,
      offTopic: true
    };
  }

  // General business question grounded in overarching Marketing Reclassified ethos
  const isHighStakes = /transformation|board|restructur|merger|enterprise|multimillion|turnaround/i.test(cleanQ);

  return {
    understanding:
      "You are navigating a strategic challenge concerning organizational alignment, market execution, or commercial sustainability.",
    perspective:
      "In Marketing Reclassified, M. Q. Siddiqui emphasizes that every commercial challenge is fundamentally a strategic alignment challenge. When outcomes falter, the solution is rarely to introduce more aggressive promotional tactics. Instead, leadership must examine whether the underlying value proposition is truly differentiated, whether the organization is listening to authentic customer reality, and whether internal resources are synchronized behind purposeful delivery.",
    questionsToConsider: [
      "Where in this situation are operational assumptions conflicting with actual customer behavior?",
      "Are you attempting to solve a structural or value problem with tactical marketing communication?",
      "What single principle from your founding value proposition is being compromised in the current execution?"
    ],
    possibleDirection:
      "Step back from day-to-day tactical firefighting. Re-anchor your team to first principles: define the authentic contribution of your enterprise, strip away promotional noise, and align internal execution with genuine customer progress.",
    relevantBookSection: {
      book: BOOK_METADATA.title,
      chapter: "Chapter 1: The Principle-First Mandate",
      section: "Aligning Enterprise Strategy with Customer Reality",
      page: "Page 32",
      readUrl: BOOK_METADATA.publicationUrl
    },
    continueExploring: [
      "How do we know whether our value proposition is still relevant?",
      "How can we make our marketing more strategic rather than just tactical?",
      "What operational signals reveal value drift before financial metrics drop?"
    ],
    showAdvisoryCta: isHighStakes,
    grounded: true,
    offTopic: false
  };
}
