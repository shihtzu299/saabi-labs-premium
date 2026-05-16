export type Testimonial = {
  id?: string;
  name: string;
  role: string;
  company: string;
  message: string;
  avatarUrl: string;
  rating?: number;
  status?: "pending" | "approved";
  created_at?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "David Hassan",
    role: "Founder",
    company: "AfriLance",
    message:
      "Saabi Labs transformed our product vision into a premium platform experience. Fast execution, strong communication, and exceptional engineering.",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=David",
    rating: 5,
    status: "approved",
  },
  {
    name: "Sarah Ibrahim",
    role: "Operations Lead",
    company: "PAARD-Co",
    message:
      "The level of polish and strategic thinking was impressive. The final product positioned us professionally for investors and partners.",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
    rating: 5,
    status: "approved",
  },
];
