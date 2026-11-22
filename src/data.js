const WHATSAPP_NUMBER = "918269650227";

export const CONTACT = {
  phoneDisplay: "+91 82696 50227",
  phoneTel: `tel:+${WHATSAPP_NUMBER}`,
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
  instagram: "https://www.instagram.com/25shashwatt/",
  instagramHandle: "@25shashwatt",
  linkedin: "https://www.linkedin.com/company/unmutex/",
  tagline: "Speak without fear. Practice without limits.",
};

export const SITE = {
  joinLink: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi I'm ready to send my 30-second introduction video and join *UnmuteX*."
  )}`,
};

export const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_vof9r23",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_b521arr",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "uPpFPGFPpCZH7C2x_",
};

export const EXPLORE_LINKS = [
  { label: "How it works", href: "#how", icon: "route", desc: "Four steps to join and get started" },
  { label: "About", href: "#about", icon: "users", desc: "Who we are and what we do" },
  { label: "Activities", href: "#activities", icon: "mic", desc: "GDs, debates, extempore and mock interviews" },
  { label: "Resources", href: "#resources", icon: "book", desc: "Frameworks, vocabulary, feedback, mentorship" },
  { label: "Stories", href: "#stories", icon: "play", desc: "Video stories from our members" },
];

export const PAGE_LINKS = [
  { label: "Reviews", href: "/reviews/" },
  { label: "Our Team", href: "/team/" },
  { label: "Certificate", href: "/certificate/" },
  { label: "Feedback", href: "/feedback/" },
];

export const NAV_LINKS = [...EXPLORE_LINKS, ...PAGE_LINKS];

export const FOUNDERS = [
  {
    name: "Shashwat Sharma",
    role: "Founder & Lead Facilitator",
    college: "SOIT, RGPV University",
    image: "/images/team/shashwat.jpg",
    tagline: "Speak to express, not to impress.",
    bio: [
      "There was a time when I knew exactly what I wanted to say, but couldn't express it confidently. Like many students, I struggled with hesitation, overthinking, and the fear of being judged. Even when I had ideas, I often stayed silent because I wasn't confident enough to speak up.",
      "Everything started changing when I stopped waiting to become perfect and simply started practicing. One conversation, one discussion, one opportunity at a time. Over time, I realized that confidence isn't something you're born with — it's something you build through consistency.",
      "That's why I started UnmuteX — a place where people can speak freely, participate in meaningful activities, overcome hesitation, and grow into confident communicators together.",
    ],
    linkedin: "https://www.linkedin.com/in/shashwat-sharma-b741aa311/",
    instagram: "https://www.instagram.com/25shashwatt/",
  },
  {
    name: "Yash",
    role: "Co-Founder & Coach",
    college: "IIIT Bhubaneswar",
    image: "/images/team/yash.jpg",
    tagline: "Structure your thoughts, command the room.",
    bio: [
      "Great ideas are buried every day simply because someone lacked the guts to speak up. I've seen it happen, and I've hustled hard enough to ensure it never happens to me. Building UnmuteX wasn't just a startup idea; it was a necessity.",
      "Combining a tech-driven mindset with the fire of a debater, my goal as Co-Founder is clear: We don't just teach you how to talk. We train you to claim your space. Stop surviving the conversation. Start commanding it.",
    ],
    linkedin: "https://www.linkedin.com/in/yashvardhan-shrotriya-a1a263263/",
    instagram: "https://www.instagram.com/myselfy.a.s.h?igsh=MXI3NGw3N2JhcGw5ag==",
  },
];

export const CORE_TEAM = [
  {
    name: "Nikhil Kumar",
    role: "Head of Product & Tech",
    image: "/images/team/nik.jpg",
    tagline: "Code that empowers community voices.",
    bio: "Joining UnmuteX has genuinely helped me grow as a communicator. Over time, I've noticed a big improvement in my confidence, articulation, and the way I express my thoughts. Earlier, I used to hesitate while speaking, but this community gave me a comfortable space to practice and improve consistently.",
  },
  {
    name: "Akriti",
    role: "Creative & Brand Lead",
    image: "/images/team/akriti.jpg",
    tagline: "Good design makes hard skills approachable.",
    bio: "Hello, I am Akriti. Being a part of the UnmuteX community has greatly improved my confidence and speaking skills. The environment here is so friendly and encouraging that I never felt judged while expressing my thoughts and opinions.",
  },
  {
    name: "Chhavi",
    role: "Mentorship Coordinator",
    image: "/images/team/chhavi.jpg",
    tagline: "Constructive feedback heals stage anxiety.",
    bio: "UnmuteX has helped me improve my communication skills, self confidence and structuring my thoughts properly. The community sessions are amazing, people are really considerate and supportive.",
  },
];

export const STEPS = [
  {
    key: "join",
    title: "Join the community",
    short: "Join",
    body: "Tap the invite link and step into Unmutex. You'll land in a space full of people working on exactly what you are: speaking with confidence.",
  },
  {
    key: "record",
    title: "Record your intro video",
    short: "Record",
    body: "Send us a short video introducing yourself. No script, no pressure. It simply tells us where you are today so we can meet you there.",
  },
  {
    key: "badge",
    title: "Get your badge & your group",
    short: "Badge",
    body: "Based on your intro, you receive a level badge and get placed in a group of peers at a similar stage, so every session stretches you just enough.",
  },
  {
    key: "journey",
    title: "Your journey begins",
    short: "Journey",
    body: "Group discussions, debates, extempore and mock interviews, with feedback after each one. Week by week, you hear yourself get better.",
  },
];

export const ACTIVITIES = [
  {
    title: "Group Discussions",
    image: "/images/group-discussion.jpg",
    icon: "users",
    body: "Hold your ground in a room of six to ten voices. Learn to enter a conversation, build on others' points and steer it without talking over anyone.",
    tags: ["Turn-taking", "Structuring points", "Summarising"],
  },
  {
    title: "Debates",
    image: "/images/speaker-man.jpg",
    icon: "swords",
    body: "Pick a side, build the argument and defend it under pressure. Rebuttals teach you to listen closely and answer with clarity.",
    tags: ["Argumentation", "Rebuttals", "Persuasion"],
  },
  {
    title: "Extempore",
    image: "/images/speaking-man.jpg",
    icon: "zap",
    body: "Get a topic, take a breath, speak for two minutes. The fastest way to cut filler words and stop freezing up.",
    tags: ["Spontaneity", "Structure", "Composure"],
  },
  {
    title: "Mock Interviews",
    image: "/images/video-call.jpg",
    icon: "briefcase",
    body: "HR, behavioural and role-specific rounds run like the real thing, followed by a clear breakdown of what landed and what to fix.",
    tags: ["STAR answers", "Body language", "Follow-ups"],
  },
  {
    title: "Impromptu Speaking",
    image: "/images/speaker-woman.jpg",
    icon: "mic",
    body: "Surprise prompts, from self-introductions to storytelling, that make speaking on the spot feel natural instead of nerve-wracking.",
    tags: ["Self-introductions", "Storytelling", "Presence"],
  },
];

const poster = (url) =>
  url
    .replace("/video/upload/", "/video/upload/so_1,w_540/")
    .replace(/\.mp4$/, ".jpg");

const RAW_TESTIMONIALS = [
  { id: 1, name: "Neha", video: "https://res.cloudinary.com/dm8xxqdgg/video/upload/v1789152750/VID_20260911_074609_876_bsl_1_1_iyiei9.mp4" },
  { id: 2, name: "Lavina", video: "https://res.cloudinary.com/dm8xxqdgg/video/upload/v1789146599/AQNkWKN0hOyOl0ukP3b_53qD6A2E1f4cf0xO9iG4eoS3b0y5IVnllZI8Oy5-rgua7xhaj_TI-BQ7aLRaAy9KoBlffLiLe30bjqhzE6k_1_ig613i.mp4" },
  { id: 3, name: "Saurav", video: "https://res.cloudinary.com/dm8xxqdgg/video/upload/v1789150408/VID_20260911_072416_743_bsl_1_lriivd.mp4" },
  { id: 4, name: "Sanskriti", video: "https://res.cloudinary.com/dm8xxqdgg/video/upload/v1789152472/VID_20260910_071225_440_bsl_1_1_dmzaew.mp4" },
  { id: 5, name: "Gaurangi", video: "https://res.cloudinary.com/dm8xxqdgg/video/upload/v1789153223/VID_20260911_071828_747_bsl_1_1_mxlpg4.mp4" },
  { id: 6, name: "Pushkar", video: "https://res.cloudinary.com/dm8xxqdgg/video/upload/v1789150516/VID_20260911_071003_821_bsl_1_ylhiks.mp4" },
  { id: 7, name: "Shanvi", video: "https://res.cloudinary.com/dm8xxqdgg/video/upload/q_auto/f_auto/v1780220180/shanvi_sbqmpj.mp4" },
  { id: 8, name: "Sonia", video: "https://res.cloudinary.com/dm8xxqdgg/video/upload/q_auto/f_auto/v1780220175/sonia_zdbkvo.mp4" },
  { id: 9, name: "Dolly", video: "https://res.cloudinary.com/dm8xxqdgg/video/upload/q_auto/f_auto/v1780220180/dolly_w2hjxs.mp4" },
];

const sized = (url, t) => url.replace("/video/upload/", `/video/upload/${t}/`);

export const TESTIMONIALS = RAW_TESTIMONIALS.map((t) => ({
  ...t,
  original: t.video,
  video: sized(t.video, "w_720,q_auto,vc_auto"),
  preview: sized(t.video, "w_360,q_auto:eco,vc_auto,ac_none"),
  poster: poster(t.video),
}));

