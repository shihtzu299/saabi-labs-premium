import {
  Bot,
  BrainCircuit,
  Code2,
  FileCode2,
  Globe2,
  Layers3,
  Smartphone,
  WalletCards
} from "lucide-react";

const services = [
  {
    title: "Website Development",
    icon: Globe2
  },
  {
    title: "Web3 Development",
    icon: WalletCards
  },
  {
    title: "Smart Contracts",
    icon: FileCode2
  },
  {
    title: "AI Integrations",
    icon: BrainCircuit
  },
  {
    title: "Telegram Bots",
    icon: Bot
  },
  {
    title: "SaaS Applications",
    icon: Layers3
  },
  {
    title: "Landing Pages",
    icon: Code2
  },
  {
    title: "Mobile Apps",
    icon: Smartphone
  }
];

export default function Services() {
  return (
    <section id="services" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-black mb-16">Services</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="glass gsap-reveal p-8 rounded-[28px] hover:-translate-y-2 transition duration-300"
              >
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-blue-500/10 text-blue-300">
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <h3 className="font-semibold text-xl">{service.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
