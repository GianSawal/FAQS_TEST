export type FAQ = {
  id: string;
  question: string;
  answer: string;
  keywords?: string[];
};

export type FAQCategory = {
  id: string;
  title: string;
  description: string;
  remember: string;
  faqs: FAQ[];
};

/** Transcribed from WEBSITE CREATION.docx. Keep policy wording in this single source. */
export const categories: FAQCategory[] = [
  {
    id: "work-schedule",
    title: "Work Schedule",
    description: "Hours, approved schedules, flexible work, and overtime.",
    remember: "complete your 40-hour workweek, follow your approved schedule, comply with attendance and reporting requirements, and obtain prior authorization before rendering overtime.",
    faqs: [
      { id: "work-schedule-1", question: "How many hours should I work each week?", answer: "You must work 40 hours per week, not including your lunch break. Follow your approved work schedule.", keywords: ["40 hours", "workweek"] },
      { id: "work-schedule-2", question: "Do all employees need to follow the 8:00 AM to 5:00 PM schedule?", answer: "The Department must provide public services from 8:00 AM to 5:00 PM, including lunchtime. Some employees, such as drivers, may have different work hours depending on their duties and approval from the Head of Office." },
      { id: "work-schedule-3", question: "If I have an approved Flexible Work Arrangement (FWA), can I choose my own working hours?", answer: "No. You must follow the work schedule approved for you. You must also follow the rules on attendance, work performance, communication, and reporting.", keywords: ["FWA"] },
      { id: "work-schedule-4", question: "If I work beyond my regular hours, will I automatically receive overtime pay or time credits?", answer: "No. You must get approval before working overtime. Your overtime must also follow the rules before you can receive overtime pay or compensatory time credits.", keywords: ["overtime"] }
    ]
  },
  {
    id: "attendance-recording",
    title: "Attendance Recording System",
    description: "Time entries, missing records, and attendance devices.",
    remember: "Always record your attendance correctly, complete all required time-in and time-out entries, submit supporting documents when needed, and never falsify your attendance records.",
    faqs: [
      { id: "attendance-recording-1", question: "How many times should I record my attendance each day?", answer: "You must record your attendance four times per regular onsite workday: morning time-in, morning time-out, afternoon time-in, and afternoon time-out, unless another authorized arrangement applies." },
      { id: "attendance-recording-2", question: "What should I do if I forget to time in or time out?", answer: "You must submit the appropriate supporting document, such as an approved OB form, certificate of attendance, approved leave or CTO, or other applicable document." },
      { id: "attendance-recording-3", question: "What if the biometric scanner or bundy clock is not working?", answer: "You should provide the required certification of system failure or other appropriate supporting document to explain the missing attendance record.", keywords: ["biometric", "bundy clock"] },
      { id: "attendance-recording-4", question: "Do employees with an approved Flexible Work Arrangement (FWA) still need to record their attendance?", answer: "Yes, unless another authorized attendance monitoring arrangement applies. Your attendance must still be properly recorded according to your approved arrangement.", keywords: ["FWA"] }
    ]
  },
  {
    id: "daily-time-record",
    title: "Daily Time Record (DTR)",
    description: "Submission, corrections, and supporting documents.",
    remember: "Check your DTR carefully, attach the necessary documents, obtain the required signatures or validation, and submit it on time to avoid possible payroll delays.",
    faqs: [
      { id: "daily-time-record-1", question: "When should I submit my DTR?", answer: "You must submit your validated DTR within five (5) working days after receiving it or when it becomes available, unless another deadline is announced.", keywords: ["DTR", "deadline"] },
      { id: "daily-time-record-2", question: "What if my DTR has missing attendance entries?", answer: "Provide the appropriate supporting documents, such as proof of official business, approved leave, CTO, authorized FWA, or other official activity, as applicable. Unsupported entries may be treated as absence, tardiness, or undertime.", keywords: ["DTR"] },
      { id: "daily-time-record-3", question: "Can I write my attendance entries by hand?", answer: "Only if the attendance system is unavailable or there is another valid reason. You must provide supporting proof, and the entries must be checked and validated by the appropriate official.", keywords: ["DTR", "handwritten"] }
    ]
  },
  {
    id: "official-business",
    title: "Official Business (OB)",
    description: "Prior approval, OB forms, and proof of attendance.",
    remember: "GET APPROVAL, KEEP PROOF, AND SUBMIT DOCUMENTS.",
    faqs: [
      { id: "official-business-1", question: "Do I need approval before going on OB?", answer: "Yes. You must get approval before leaving for official activities, except in emergencies or urgent situations when prior approval is not possible.", keywords: ["OB"] },
      { id: "official-business-2", question: "What information should be included in the OB form?", answer: "The date, purpose, destination, and expected duration of the activity.", keywords: ["OB"] },
      { id: "official-business-3", question: "What documents can prove that I attended an official activity?", answer: "A certificate of attendance, certificate of appearance, or other required supporting documents.", keywords: ["OB"] },
      { id: "official-business-4", question: "What if I cannot get approval because of an emergency?", answer: "The policy allows an exception when an emergency or urgent official requirement makes prior approval impractical.", keywords: ["OB"] }
    ]
  }
];

export const faqCount = categories.reduce((sum, category) => sum + category.faqs.length, 0);
