// seed/seedEvents.js
import Event from "../models/Event.js";
import User from "../models/User.js";

const sampleEvents = [
  {
    title: "HackMatrix: 24-Hour AI & Web3 Hackathon",
    category: "Hackathon",
    description: "Build cutting-edge full-stack decentralized applications, generative AI agents, and smart solutions. Cash prize pool of ₹1,00,000 + mentorship from top industry engineers.",
    date: new Date("2026-03-20T09:00:00Z"),
    time: "09:00 AM - 24 Hours",
    venue: "Innovation Centre & High-Tech Lab",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
    capacity: 150,
    ticketPrice: 0,
    tags: ["Hackathon", "AI", "Web3", "Coding"],
    status: "upcoming",
  },
  {
    title: "CodeSprint: National Speed Debugging & Algorithmic Contest",
    category: "Coding",
    description: "Test your problem-solving speed and algorithmic prowess in a high-intensity 3-round competitive programming and bug-fixing arena. Language agnostic: C++, Python, Java, JS.",
    date: new Date("2026-03-21T10:30:00Z"),
    time: "10:30 AM - 01:30 PM",
    venue: "Central Computing Lab 2",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    capacity: 100,
    ticketPrice: 0,
    tags: ["Competitive Programming", "DSA", "Debugging"],
    status: "upcoming",
  },
  {
    title: "NextGen AI & Cloud Architecture Workshop",
    category: "Workshop",
    description: "Hands-on masterclass on building and deploying scalable AI microservices with Docker, Kubernetes, and Gemini API. Interactive labs and real-time cloud credits provided.",
    date: new Date("2026-03-21T02:00:00Z"),
    time: "02:00 PM - 05:00 PM",
    venue: "Seminar Hall A",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    capacity: 80,
    ticketPrice: 0,
    tags: ["AI", "Cloud", "Kubernetes", "Workshop"],
    status: "upcoming",
  },
  {
    title: "Innovision: Technical Paper Presentation",
    category: "Paper Presentation",
    description: "Present your original research and engineering innovations in AI, Robotics, Cyber Security, IoT, and Clean Energy before an esteemed panel of researchers and industry experts.",
    date: new Date("2026-03-22T09:30:00Z"),
    time: "09:30 AM - 01:00 PM",
    venue: "Conference Hall 1",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
    capacity: 60,
    ticketPrice: 0,
    tags: ["Research", "Paper Presentation", "Innovation"],
    status: "upcoming",
  },
  {
    title: "RoboWars: Combat Robotics Championship",
    category: "Robotics",
    description: "The ultimate clash of metal and code. Witness remote-controlled battle-bots compete in an enclosed steel hazard arena with spinners, flippers, and wedge weapons.",
    date: new Date("2026-03-22T02:00:00Z"),
    time: "02:00 PM - 06:00 PM",
    venue: "Main Open Amphitheatre",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    capacity: 250,
    ticketPrice: 0,
    tags: ["Robotics", "Hardware", "Combat"],
    status: "upcoming",
  },
  {
    title: "CyberShield: Capture The Flag (CTF) Challenge",
    category: "Technical",
    description: "A battleground for ethical hackers and security enthusiasts. Solve realistic cryptography, web exploitation, reverse engineering, and forensic security challenges.",
    date: new Date("2026-03-23T10:00:00Z"),
    time: "10:00 AM - 04:00 PM",
    venue: "Cyber Security Lab 4",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    capacity: 90,
    ticketPrice: 0,
    tags: ["Security", "CTF", "Ethical Hacking"],
    status: "upcoming",
  },
];

const seedEvents = async (adminId) => {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      const eventsToInsert = sampleEvents.map((evt) => ({
        ...evt,
        createdBy: adminId || null,
        registrations: [],
      }));
      await Event.insertMany(eventsToInsert);
      console.log("✨ Seeded default technical symposium events successfully!");
    } else {
      console.log(`ℹ️ ${count} events already exist in database.`);
    }
  } catch (err) {
    console.error("❌ Error seeding events:", err);
  }
};

export default seedEvents;
