import portfolioImage from '../assets/portfolio.jpg';
import eventScheduleImage from '../assets/event-schedule.jpg';
import attendanceDisplayImage from '../assets/attendance-display.jpg';
import { StaticImageData } from 'next/image';

export interface Project {
  id: string; // matches the github repo name exactly
  title: string; // A cleaner title than "my-react-app-v2"
  description: string; // Marketing copy, not technical jargon
  tech: string[]; // List of technologies
  repoLink: string;
  demoLink?: string; // Optional
  image: StaticImageData; // Local path like '/images/projects/dashboard.png'
  featured: boolean; 
}

export const projects: Project[] = [
  {
    id: "my-portfolio",
    title: "My Portfolio Website",
    description: "A personal portfolio website to showcase my projects and skills.",
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
    repoLink: "https://github.com/TheLoreAxe/my-portfolio",
    demoLink: "matthewsteffan.dev",
    image: portfolioImage,
    featured: true,
  },
  {
    id: "attendance-display",
    title: "Attendance Display",
    description: "A digital display showcasing statisitcs and attendance data in real-time.",
    tech: ["TypeScript", "Next.js", "React"],
    repoLink: "https://github.com/TheLoreAxe/attendance-display",
    image: attendanceDisplayImage,
    featured: true,
  },
  {
    id: "event-schedule",
    title: "Event Schedule Display",
    description: "Digital event schedule display for Martech Trade Show.",
    tech: ["TypeScript", "Next.js", "React"],
    repoLink: "https://github.com/TheLoreAxe/event-schedule",
    image: eventScheduleImage,
    featured: true,
  },

];