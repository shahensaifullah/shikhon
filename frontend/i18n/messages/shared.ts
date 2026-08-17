import type { FeatureDictionary } from "@/i18n/messages/types";

const bn = {
  common: {
    brand: "শিখন", home: "হোম", help: "সহায়তা", privacy: "গোপনীয়তা", terms: "শর্তাবলি", contact: "যোগাযোগ",
    login: "লগইন", logout: "লগআউট", register: "অ্যাকাউন্ট খুলুন", cancel: "বাতিল করুন", close: "বন্ধ করুন",
    copyright: "© ২০২৬ শিখন এডুকেশন", bangla: "বাংলা", english: "English",
  },
  metadata: {
    title: "শিখন — বুঝে শেখার সহজ পথ", description: "ভিজ্যুয়াল পাঠ ও হাতে-কলমে অনুশীলনে কঠিন বিষয় সহজে বুঝে শিখুন।",
    loginTitle: "লগইন", loginDescription: "একবার ব্যবহারযোগ্য যাচাইকরণ কোড দিয়ে নিরাপদে শিখনে লগইন করুন।",
    registerTitle: "অ্যাকাউন্ট খুলুন", registerDescription: "আপনার শিখন লার্নার অ্যাকাউন্ট তৈরি করুন।",
    studentTitle: "শিক্ষার্থী ড্যাশবোর্ড", studentDescription: "শিখনে শেখা চালিয়ে যান এবং নিজের অগ্রগতি দেখুন।",
  },
  nav: {
    how: "যেভাবে শিখবেন", subjects: "বিষয়সমূহ", progress: "অগ্রগতি", start: "শেখা শুরু করুন",
    main: "প্রধান নেভিগেশন", mobile: "মোবাইল নেভিগেশন", open: "নেভিগেশন খুলুন", close: "নেভিগেশন বন্ধ করুন",
  },
  system: {
    notFoundLabel: "পৃষ্ঠা পাওয়া যায়নি", notFoundTitle: "মনে হচ্ছে এই পাঠটি এখানে নেই।", notFoundBody: "লিংকটি ভুল হতে পারে অথবা পাতাটি অন্য কোথাও সরানো হয়েছে। হোম পাতায় ফিরে নতুন করে শুরু করুন।", backHome: "হোম পাতায় ফিরুন",
    errorTitle: "পাতাটি দেখাতে সমস্যা হচ্ছে।", errorBody: "চিন্তার কিছু নেই। আরেকবার চেষ্টা করুন, অথবা হোম পাতায় ফিরে যান।", retry: "আবার চেষ্টা করুন",
  },
};

const en = {
  common: {
    brand: "Shikhon", home: "Home", help: "Help", privacy: "Privacy", terms: "Terms", contact: "Contact",
    login: "Log in", logout: "Sign out", register: "Create account", cancel: "Cancel", close: "Close",
    copyright: "© 2026 Shikhon Education", bangla: "বাংলা", english: "English",
  },
  metadata: {
    title: "Shikhon — Learn by understanding", description: "Understand difficult topics through visual lessons and hands-on practice.",
    loginTitle: "Log in", loginDescription: "Log in securely to Shikhon with a one-time verification code.",
    registerTitle: "Create account", registerDescription: "Create your Shikhon learner account.",
    studentTitle: "Student dashboard", studentDescription: "Continue learning and track your progress on Shikhon.",
  },
  nav: { how: "How it works", subjects: "Subjects", progress: "Progress", start: "Start learning", main: "Main navigation", mobile: "Mobile navigation", open: "Open navigation", close: "Close navigation" },
  system: { notFoundLabel: "Page not found", notFoundTitle: "It looks like this lesson isn't here.", notFoundBody: "The link may be incorrect or the page may have moved. Return home and start again.", backHome: "Back to home", errorTitle: "We couldn't display this page.", errorBody: "No worries. Try again, or return to the home page.", retry: "Try again" },
};

export const sharedMessages = { bn, en } satisfies FeatureDictionary<typeof bn>;
