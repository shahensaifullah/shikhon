import type { FeatureDictionary } from "@/i18n/messages/types";

const bn = {
  home: {
    eyebrow: "বেশি নয়, বুঝে পড়ুন", title: "শুধু পড়ে যাবেন না।", titleAccent: "বিষয়টা সত্যিই বুঝুন।",
    intro: "বই পড়া আর মুখস্থ করার গণ্ডি পেরিয়ে আসুন। শিখনের ভিজ্যুয়াল ব্যাখ্যা ও হাতে-কলমে অনুশীলনে প্রতিটি পড়ার সময় হয়ে উঠুক আরও অর্থবহ।",
    startFree: "বিনামূল্যে শেখা শুরু করুন", seeHow: "কীভাবে কাজ করে দেখুন", noCard: "কোনো কার্ড লাগবে না", ownPace: "নিজের গতিতে শিখুন",
    built: "বোঝার জন্য তৈরি", howTitle: "যেভাবে মস্তিষ্ক সত্যিই শেখে, প্রতিটি পাঠ সেভাবেই সাজানো।", howBody: "প্রথম ব্যাখ্যা থেকে আত্মবিশ্বাসের সঙ্গে মনে রাখা পর্যন্ত—একটি সহজ ও ধারাবাহিক পথ।",
    features: [
      { title: "বুঝুন", description: "কঠিন তত্ত্বকে সহজ ও স্বাভাবিক ধারণায় ভেঙে বুঝুন।" },
      { title: "চোখে দেখুন", description: "ভিজ্যুয়াল মডেলে বিমূর্ত বিষয়কে বাস্তবের মতো অনুভব করুন।" },
      { title: "অনুশীলন করুন", description: "প্রতিটি ধারণা শেখার পরপরই নিরাপদ পরিবেশে প্রয়োগ করুন।" },
      { title: "আটকে গেলে সহায়তা নিন", description: "পুরো উত্তর না দেখেই প্রয়োজনমতো ইঙ্গিত ও ধাপে ধাপে সহায়তা নিন।" },
      { title: "নিজেকে যাচাই করুন", description: "যেখানে দুর্বলতা আছে, লক্ষ্যভিত্তিক কুইজে সেটিই আবার ঝালিয়ে নিন।" },
      { title: "এগিয়ে চলুন", description: "নিজের অগ্রগতি দেখুন এবং এরপর ঠিক কী শিখবেন তা জানুন।" },
    ],
    algebra: "বীজগণিতের ভিত্তি", linear: "রৈখিক সমীকরণ", linearNote: "সম্পন্ন · ১০০%", systems: "সমীকরণ জোট", systemsNote: "চলমান · ৬৫%", polynomials: "বহুপদী", polynomialsNote: "এরপর খুলবে",
    pace: "আপনার শেখা, আপনার গতি", paceTitle: "কতদূর শিখেছেন এবং এরপর কী—সবসময় পরিষ্কার থাকুক।", paceBody: "আপনার অগ্রগতির সঙ্গে শেখার পথও বদলাবে। প্রস্তুত হলে এগিয়ে যান, দরকার হলে ফিরে দেখুন—প্রতিটি সেশনকে কাজে লাগান।",
    mastery: "দক্ষতাভিত্তিক শেখার অগ্রগতি", tracking: "তাৎক্ষণিক দক্ষতা পর্যবেক্ষণ", steady: "সময়সীমার চাপ নয়, নিয়মিত উন্নতি",
    ctaTitle: "যা পড়েন, তা সত্যিই বুঝতে প্রস্তুত?", ctaBody: "প্রথম পাঠটি খুলুন এবং চোখে দেখে, ভেবে ও অনুশীলন করে শেখার নতুন অভিজ্ঞতা নিন।", createFree: "বিনামূল্যে অ্যাকাউন্ট খুলুন",
  },
  preview: { title: "দ্বিঘাত সমীকরণ", lesson: "৮টি পাঠের ৪ নম্বর · সমাধান", more: "আরও অপশন", solve: "সমাধান করুন, যখন", correct: "সঠিক—দুটি মানই সমীকরণটি পূরণ করে।", momentum: "দারুণ এগোচ্ছেন", mastered: "৩টি ধারণা আয়ত্ত হয়েছে" },
  physics: { try: "নিজে করে দেখুন", title: "সূত্র শুধু মুখস্থ নয়—পরিবর্তনটা অনুভব করুন।", body: "বল ও ভরের মান বদলে দেখুন। প্রতিটি পরিবর্তনকে শিখন নিউটনের দ্বিতীয় সূত্রের সঙ্গে মিলিয়ে দেখাবে—তখন সূত্রটি মুখস্থ তথ্য নয়, সহজবোধ্য ধারণা হয়ে উঠবে।", force: "বল", mass: "ভর", acceleration: "ত্বরণ", visual: "বল ও ভরের ভিজ্যুয়াল মডেল", less: "কম ত্বরণ", more: "বেশি ত্বরণ" },
};

const en = {
  home: {
    eyebrow: "Study smart, not hard", title: "Don't just study it.", titleAccent: "Make it click.", intro: "Go beyond reading and memorizing. Shikhon turns complex lessons into interactive visuals and purposeful practice, helping you understand more in every study session.",
    startFree: "Start learning free", seeHow: "See how it works", noCard: "No credit card", ownPace: "Learn at your pace", built: "Built for understanding", howTitle: "Every lesson follows how real learning happens.", howBody: "A calm, connected path from first explanation to confident recall.",
    features: [
      { title: "Understand", description: "Break difficult theories into clear, intuitive principles." }, { title: "See", description: "Explore visual models that make abstract relationships tangible." },
      { title: "Practice", description: "Apply each idea immediately in a safe, guided environment." }, { title: "Get unstuck", description: "Ask for contextual hints without giving away the whole answer." },
      { title: "Check mastery", description: "Use focused quizzes that revisit exactly what needs work." }, { title: "Keep growing", description: "See real progress and know precisely what to learn next." },
    ],
    algebra: "Algebra foundations", linear: "Linear equations", linearNote: "Completed · 100%", systems: "Systems of equations", systemsNote: "In progress · 65%", polynomials: "Polynomials", polynomialsNote: "Unlocks next",
    pace: "Your learning, your pace", paceTitle: "Always know where you are—and what comes next.", paceBody: "A mastery-based path adapts to your progress. Move forward when you are ready, revisit ideas when you need to, and make every session count.", mastery: "Mastery-based progression", tracking: "Real-time skill tracking", steady: "No deadlines, just steady growth", ctaTitle: "Ready to understand what you study?", ctaBody: "Open your first lesson and experience a more visual, thoughtful way to learn.", createFree: "Create free account",
  },
  preview: { title: "Quadratic equations", lesson: "Lesson 4 of 8 · Solving", more: "More options", solve: "Solve when", correct: "Correct—both values satisfy the equation.", momentum: "Great momentum", mastered: "3 concepts mastered" },
  physics: { try: "Try it yourself", title: "Turn formulas into something you can feel.", body: "Adjust force and mass. Shikhon connects every change to Newton's second law, so the formula becomes an intuition—not a fact to memorize.", force: "Force", mass: "Mass", acceleration: "Acceleration", visual: "Force and mass visualization", less: "Less acceleration", more: "More acceleration" },
};

export const homeMessages = { bn, en } satisfies FeatureDictionary<typeof bn>;
