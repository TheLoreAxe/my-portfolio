"use client";

import Image from 'next/image';
import { projects } from './projects';

export default function ProjectsSection() {
  return (
    <section id="projects" className="section section--projects">
      <h2 className="section-title section-title--md accent">Projects</h2>
      <p className="text-lg mb-8">Here are some of my favorite projects that showcase my skills and passion for development.</p>
      
      <div className="projects-grid">
        {projects.map((project) => {
          const isPortrait = project.image.height > project.image.width;
          return (
            <div key={project.id} className={`project-card ${isPortrait ? 'project-card--portrait' : 'project-card--landscape'}`} onClick={() => window.open(project.repoLink, '_blank')}>
              <div className="project-image" style={{ aspectRatio: `${project.image.width} / ${project.image.height}` }}>
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech) => (
                    <span key={tech} className={`tech-tag tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '')}`}>{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.demoLink && (
                    <a href={project.demoLink.startsWith('http') ? project.demoLink : `https://${project.demoLink}`} target="_blank" rel="noopener noreferrer" className="project-link" onClick={(e) => e.stopPropagation()}>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


