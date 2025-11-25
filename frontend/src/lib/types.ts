export interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  location?: string;
  description: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies?: string[];
  url?: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
}

export interface Resume {
  contact_info: ContactInfo;
  summary?: string;
  experience?: Experience[];
  projects?: Project[];
  skills?: SkillGroup[];
  education?: Education[];
}
