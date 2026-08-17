import type { FeatureDictionary } from "@/i18n/messages/types";

const bn = { student: {
  overview: "এক নজরে", courses: "আমার কোর্স", library: "পাঠাগার", progress: "অগ্রগতি", restoring: "আপনার সেশন ফিরিয়ে আনা হচ্ছে…", search: "পাঠ খুঁজুন", settings: "সেটিংস", helpCenter: "সহায়তা কেন্দ্র",
  openSidebar: "সাইডবার খুলুন", closeSidebar: "সাইডবার বন্ধ করুন", expandSidebar: "সাইডবার বড় করুন", collapseSidebar: "সাইডবার ছোট করুন", studentNav: "শিক্ষার্থী নেভিগেশন", openProfile: "প্রোফাইল খুলুন",
  date: "সোমবার, ১৭ আগস্ট", welcome: "আবার স্বাগতম, সাইফ।", welcomeBody: "আজকের ছোট্ট অগ্রগতিই শেখার গতি ধরে রাখবে।", streak: "টানা ৬ দিন",
  continue: "শেখা চালিয়ে যান", systems: "সমীকরণ জোট", algebraLesson: "বীজগণিতের ভিত্তি · ৮টি পাঠের ৫ নম্বর", complete65: "৬৫% সম্পন্ন", minutes12: "আর ১২ মিনিট", continueLesson: "পাঠ চালিয়ে যান",
  thisWeek: "এই সপ্তাহ", details: "বিস্তারিত", learningTime: "শেখার সময়", timeValue: "২ ঘণ্টা ৪০ মিনিট", activities: "কার্যক্রম", activityValue: "১৮", weeklyChart: "সাপ্তাহিক শেখার কার্যক্রমের চার্ট",
  yourCourses: "আপনার কোর্স", pickUp: "যেখানে থেমেছিলেন, সেখান থেকেই শুরু করুন।", viewAll: "সব দেখুন", math: "গণিত", physics: "পদার্থবিজ্ঞান", chemistry: "রসায়ন", algebra: "বীজগণিতের ভিত্তি", forces: "বল ও গতি", matter: "পদার্থ ও বন্ধন", complete: "সম্পন্ন",
  learning: "শেখা", coursesDescription: "চলমান কোর্স চালিয়ে যান অথবা শেষ করা পাঠগুলো আবার দেখে নিন।", coursePlaceholder: "আপনার কোর্সের বিষয়বস্তু এখানে দেখা যাবে।",
  explore: "খুঁজে দেখুন", libraryDescription: "বিষয়, পাঠ এবং সংরক্ষিত রিসোর্স খুঁজে দেখুন।", libraryPlaceholder: "আপনার পাঠাগারের বিষয়বস্তু এখানে দেখা যাবে।",
  growth: "আপনার উন্নতি", progressDescription: "দক্ষতা, কার্যক্রম এবং শেখার মাইলফলক দেখুন।", progressPlaceholder: "আপনার অগ্রগতির তথ্য এখানে দেখা যাবে।",
} };

const en = { student: {
  overview: "Overview", courses: "My courses", library: "Library", progress: "Progress", restoring: "Restoring your session…", search: "Search lessons", settings: "Settings", helpCenter: "Help center", openSidebar: "Open sidebar", closeSidebar: "Close sidebar", expandSidebar: "Expand sidebar", collapseSidebar: "Collapse sidebar", studentNav: "Student navigation", openProfile: "Open profile",
  date: "Monday, 17 August", welcome: "Welcome back, Saif.", welcomeBody: "A little progress today keeps the momentum going.", streak: "6 day streak", continue: "Continue learning", systems: "Systems of equations", algebraLesson: "Algebra foundations · Lesson 5 of 8", complete65: "65% complete", minutes12: "12 min left", continueLesson: "Continue lesson", thisWeek: "This week", details: "Details", learningTime: "Learning time", timeValue: "2h 40m", activities: "Activities", activityValue: "18", weeklyChart: "Weekly learning activity chart", yourCourses: "Your courses", pickUp: "Pick up where you left off.", viewAll: "View all", math: "Mathematics", physics: "Physics", chemistry: "Chemistry", algebra: "Algebra foundations", forces: "Forces and motion", matter: "Matter and bonding", complete: "complete",
  learning: "Learning", coursesDescription: "Continue active courses or review completed lessons.", coursePlaceholder: "Your course content goes here.", explore: "Explore", libraryDescription: "Browse subjects, lessons, and saved resources.", libraryPlaceholder: "Your library content goes here.", growth: "Your growth", progressDescription: "Track mastery, activity, and learning milestones.", progressPlaceholder: "Your progress content goes here.",
} };

export const studentMessages = { bn, en } satisfies FeatureDictionary<typeof bn>;
