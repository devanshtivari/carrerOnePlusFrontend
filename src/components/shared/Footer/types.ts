export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  [category: string]: FooterLink[];
}
