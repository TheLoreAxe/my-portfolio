"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  return (
    <html>
      <header></header>
      <body>
        <div>
          <h1>My Portfolio</h1>
          <h2>Projects</h2>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                {project.link && <a href={project.link} target="_blank">View Project</a>}
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </body>
    </html>
  );
}
