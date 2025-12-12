export interface SocialLink {
  name: string;
  url: string;
  icon: "facebook" | "instagram" | "twitter" | "youtube" | "linkedin";
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface WorkingHours {
  day: string;
  hours: string;
}

export interface FooterConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
  };
  socialLinks: SocialLink[];
  contact: ContactInfo;
  workingHours: WorkingHours[];
  quickLinks: {
    label: string;
    href: string;
  }[];
  footerText: string;
  madeWith: {
    text: string;
    location: string;
  };
  maps: {
    embedUrl: string;
    title: string;
    subtitle: string;
  };
}

export const footerConfig: FooterConfig = {
  brand: {
    name: "Chinese Chekar",
    tagline: "Premium Cuisine",
    description:
      "Experience authentic Chinese flavors crafted with passion and precision. Where tradition meets modern culinary excellence.",
  },
  socialLinks: [
    {
      name: "Facebook",
      url: "https://facebook.com/chinesechekar",
      icon: "facebook",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/chinesechekar",
      icon: "instagram",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/chinesechekar",
      icon: "twitter",
    },
  ],
  contact: {
    address: "Opposite Parakh Petrol Pump, Bidhannagar, West Bengal",
    phone: "+91 7319050230",
    email: "sapan009sinha@gmail.com",
  },
  workingHours: [
    {
      day: "Monday - Friday",
      hours: "11:00 AM - 10:00 PM",
    },
    {
      day: "Saturday - Sunday",
      hours: "11:00 AM - 11:00 PM",
    },
  ],
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Live Inventory", href: "/inventory" },
    { label: "About Us", href: "/about" }
  ],
  footerText: `© ${new Date().getFullYear()} Chinese Chekar. All rights reserved. Crafted with passion.`,
  madeWith: {
    text: "Made With love",
    location: "Bidhannagar",
  },
  maps: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d223.18160694234393!2d88.23764798552298!3d26.49098058778825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1765549268039!5m2!1sen!2sin",
    title: "Find Us",
    subtitle: "Visit us at our location",
  },
};

