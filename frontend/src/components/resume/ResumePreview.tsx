import { Resume } from '@/lib/api';
import { Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';

interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview = ({ resume }: ResumePreviewProps) => {
  const { contact_info, summary, experience, education, skills, projects } = resume;

  return (
    <div className="bg-white shadow-xl rounded-sm w-full max-w-[210mm] min-h-[297mm] mx-auto p-10 md:p-14 text-gray-800 font-serif text-sm leading-relaxed border border-gray-200">
      {/* Header */}
      <header className="border-b-2 border-gray-900 pb-6 mb-8 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-widest text-gray-900 mb-4 font-sans">
          {contact_info.name}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600 font-sans">
          {contact_info.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" /> {contact_info.email}
            </div>
          )}
          {contact_info.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> {contact_info.phone}
            </div>
          )}
          {contact_info.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {contact_info.location}
            </div>
          )}
          {contact_info.linkedin && (
            <a href={contact_info.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Linkedin className="w-3 h-3" /> LinkedIn
            </a>
          )}
          {contact_info.github && (
            <a href={contact_info.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Github className="w-3 h-3" /> GitHub
            </a>
          )}
          {contact_info.website && (
            <a href={contact_info.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Globe className="w-3 h-3" /> Portfolio
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-gray-900 font-sans">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-4 text-gray-900 font-sans">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1 font-sans">
                  <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
                    {exp.start_date} – {exp.current ? 'Present' : exp.end_date}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700 italic">{exp.company}</span>
                  {exp.location && <span className="text-xs text-gray-500 font-sans">{exp.location}</span>}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1.5 text-gray-700 marker:text-gray-400">
                  {exp.description && exp.description.map((desc: string, j: number) => (
                    <li key={j} className="pl-1">{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-4 text-gray-900 font-sans">
            Projects
          </h2>
          <div className="space-y-5">
            {projects.map((proj, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1 font-sans">
                  <h3 className="font-bold text-gray-900 text-base">
                    {proj.name}
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 hover:underline text-xs font-normal">
                        (Link)
                      </a>
                    )}
                  </h3>
                </div>
                <p className="text-gray-700 mb-2">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {proj.technologies.map((tech: string, j: number) => (
                      <span key={j} className="text-[10px] uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-sm text-gray-600 font-sans font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-4 text-gray-900 font-sans">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {skills.map((skillGroup, i) => (
              <div key={i}>
                <h3 className="font-bold text-gray-800 text-xs mb-2 font-sans uppercase tracking-wide">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.skills && skillGroup.skills.map((skill: string, j: number) => (
                    <span key={j} className="inline-block px-2 py-1 bg-gray-50 border border-gray-200 text-gray-700 rounded-sm text-xs font-medium font-sans">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-4 text-gray-900 font-sans">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline font-sans">
                  <h3 className="font-bold text-gray-900 text-base">{edu.institution}</h3>
                  <span className="text-xs text-gray-500 font-medium">
                    {edu.start_date} – {edu.end_date}
                  </span>
                </div>
                <div className="text-gray-700 italic">
                  {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
