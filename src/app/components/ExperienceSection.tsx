export default function ExperienceSection() {
  return (
    <section id="experience" className="section section--experience">
      <h2 className="section-title section-title--md accent">Experience</h2>

      {/* Job 1: Carolina One */}
      <div className="experience-item">
        <div className="experience-header">
          <h3 className="experience-title">Software Developer</h3>
          <span className="experience-company">Carolina One Real Estate</span>
        </div>
        <p className="experience-meta">Charleston, SC — July 2024-Present</p>
        <ul className="experience-list">
          <li>
            Designed REST APIs and webhook integrations to facilitate
            cross-system communication.
          </li>
          <li>
            Built C# and ASP.NET applications to automate agent onboarding, data
            sync, and CRM processes.
          </li>
          <li>
            Refactored legacy CRM systems into a modular architecture, improving
            maintainability and enabling faster feature delivery.
          </li>
          <li>
            Automated workstation setup scripts, reducing IT configuration time
            by 60%.
          </li>
        </ul>
      </div>

      {/* Job Freelance: Freelance */}
      <div className="experience-item">
        <div className="experience-header">
          <h3 className="experience-title">Freelance Developer</h3>
          <span className="experience-company">TAOT</span>
        </div>
        <p className="experience-meta">Remote — March 2025</p>
        <ul className="experience-list">
          <li>
            Designed custom integrations between Google Sheets and Wix Studio.
          </li>
          <li>
            Automated data import improving transaction processing speed.
          </li>
          <li>
            Worked with the client to meet all expectations while communicating on all updates.
          </li>
        </ul>
      </div>

      {/* Job 2: Abeka Books */}
      <div className="experience-item">
        <div className="experience-header">
          <h3 className="experience-title">Software Developer</h3>
          <span className="experience-company">Abeka Books</span>
        </div>
        <p className="experience-meta">Pensacola, FL — May 2022-July 2024</p>
        <ul className="experience-list">
          <li>
            Developed Windows applications and web interfaces in C# and ASP.NET
            for critical business operations.
          </li>
          <li>
            Customized Dynamics NAV modules using C/AL to meet specific business
            requirements.
          </li>
          <li>
            Served as lead developer for the Postal Soft Management System.
          </li>
          <li>
            Delivered rapid bug-fix deployments under tight deadlines,
            significantly improving system uptime.
          </li>
        </ul>
      </div>

      {/* Job 3: PCC */}
      <div className="experience-item">
        <div className="experience-header">
          <h3 className="experience-title">IT Systems Developer</h3>
          <span className="experience-company">
            Pensacola Christian College
          </span>
        </div>
        <p className="experience-meta">Pensacola, FL — July 2018-May 2022</p>
        <ul className="experience-list">
          <li>
            Created automation tools in Python, C#, AutoIt, and Java to process
            maintenance and facility data.
          </li>
          <li>
            Integrated data across Excel, Maximo, Outlook, and SQL databases to
            streamline workflows.
          </li>
          <li>
            Improved maintenance request throughput by 315% through workflow
            automation.
          </li>
        </ul>
      </div>
    </section>
  );
}
