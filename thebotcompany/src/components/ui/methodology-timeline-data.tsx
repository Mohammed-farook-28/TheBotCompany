import { Calendar, Code, FileText, User, Clock, Brain, Zap, Target, CheckCircle } from "lucide-react";

export const methodologyTimelineData = [
  {
    id: 1,
    title: "Listen",
    date: "Phase 1",
    content: "We start by deeply understanding your business needs, pain points, and goals. Our team conducts comprehensive discovery sessions to map out your current processes and identify automation opportunities.",
    category: "Discovery",
    icon: Brain,
    relatedIds: [2], // Listen → Design
  },
  {
    id: 2,
    title: "Design",
    date: "Phase 2",
    content: "We create detailed wireframes and workflows for your bot solution. Our design process includes user journey mapping, conversation flows, and technical architecture planning.",
    category: "Design",
    icon: FileText,
    relatedIds: [3], // Design → Build
  },
  {
    id: 3,
    title: "Build",
    date: "Phase 3",
    content: "We develop and deploy your bot solution with a focus on scalability, performance, and reliability. Our development process includes rigorous testing and optimization.",
    category: "Development",
    icon: Code,
    relatedIds: [4], // Build → Automate
  },
  {
    id: 4,
    title: "Automate",
    date: "Phase 4",
    content: "We infuse cutting-edge AI technologies into your bot solution. This includes natural language processing, machine learning models, and intelligent decision-making capabilities.",
    category: "AI Integration",
    icon: Zap,
    relatedIds: [5], // Automate → Evolve
  },
  {
    id: 5,
    title: "Evolve",
    date: "Phase 5",
    content: "We continuously monitor and improve your bot based on user feedback and performance metrics. Our evolution process ensures your solution stays current and effective.",
    category: "Optimization",
    icon: Target,
    relatedIds: [6], // Evolve → Scale
  },
  {
    id: 6,
    title: "Scale",
    date: "Phase 6",
    content: "We help you scale your bot solution across your organization, integrating with existing systems and expanding capabilities as your business grows.",
    category: "Scaling",
    icon: CheckCircle,
    relatedIds: [1], // Scale → Listen (circular flow)
  },
];
