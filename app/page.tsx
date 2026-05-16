import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Testimonials from "@/components/Testimonials";
import { getTestimonials } from "@/lib/cms";

export default async function Home() {
  const testimonials = await getTestimonials("approved");

  return (
    <main>
      <Hero />
      <Services />
      <Projects />
      <Testimonials testimonials={testimonials} />
      <About />
      <Contact />
    </main>
  );
}
