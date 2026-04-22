import { FooterSection } from "./types";

/**
 * Local fallback footer links. Production data is loaded from the backend
 * (`GET /content/footer`). Edit copy in `backend/src/content/content.config.ts`.
 */
export const footerLinks: FooterSection = {
  Explore: [
    { label: "Courses Catalog", href: "/learning" },
    { label: "Student Projects", href: "/projects" },
    { label: "Rankings", href: "/leaderboard" },
    { label: "Certificates", href: "/certificates" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/team" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "Help Center", href: "/support" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};
