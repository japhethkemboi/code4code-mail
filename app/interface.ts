export interface Profile {
  username: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
  avatar?: string;
  role?: string;
  organization?: Partial<Organization>;
}

export interface Service {
  id?: number;
  name: string;
  description: string;
  story: string;
}

export interface Blog {
  id?: number;
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  author: Partial<Profile>;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  is_published?: boolean;
}

export interface Organization {
  id?: number;
  name: string;
  domains: Partial<Domain>[];
  owner?: Partial<Profile>;
  organization_type: string;
}

export interface Domain {
  name: string;
  verification_token?: string;
  is_verified?: boolean;
  verified_by?: Partial<Profile>;
  verification_date?: string;
  mxrecord?: string;
  disclaimer?: string;
  subdomain_stripping?: boolean;
  catch_all_address?: string;
  notification_address?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: string;
}

export const organizationTypes = [
  { id: "CORPORATE", value: "Corporate Entity (Business)" },
  { id: "NONPROFIT", value: "Nonprofits and Charities" },
  { id: "EDUCATIONAL", value: "Educational Institution" },
  { id: "GOVERNMENT", value: "Government or Public Sector" },
  { id: "HEALTHCARE", value: "Healthcare Organization" },
  { id: "TECH", value: "Technology Firm" },
  { id: "FINANCIAL", value: "Financial Institution" },
  { id: "RETAIL", value: "Retail and E-commerce" },
  { id: "MEDIA", value: "Media and Entertainment" },
  { id: "FREELANCER", value: "Freelance or Individual Professionals" },
  { id: "COOPERATIVE", value: "Cooperate or Member-based Organization" },
  { id: "RELIGIOUS", value: "Religious Organization" },
];

export interface Mail {
  id?: number;
  sender?: Partial<Profile>;
  recipients?: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
  read?: boolean;
  is_draft?: boolean;
  sent_at?: string;
  created_at?: string;
  edited?: boolean;
  reply_to?: number;
  in_reply_to?: number;
  starred?: boolean;
  archived?: boolean;
  references?: string;
}

export interface Reply {
  id: number;
  mail: number;
  parent_reply: number;
  sender: Partial<Profile>;
  body: string;
  created_at: string;
  updated_at: string;
  starred: boolean;
  is_read: boolean;
}

export interface Contact {
  id?: number;
  name: string;
  email: string;
  Profile: Partial<Profile>;
}
