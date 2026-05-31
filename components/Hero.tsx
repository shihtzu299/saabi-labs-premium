"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { homeContent } from "@/data/home";

const statusItems = [
  ["AI Agent", "online"],
  ["Contract", "ready"],
  ["API", "stable"],
  ["Deploy", "passed"],
];

const systemModules = [
  ["Product UX", "98"],
  ["Automation", "24"],
  ["Web3", "07"],
  ["AI Systems", "12"],
];

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [isCompactScreen, setIsCompactScreen] = useState(false);
  const shouldSimplifyHero = prefersReducedMotion || isCompactScreen;

  useEffect(() => {
    const query = window.matchMedia("(max-width: 600px)");
    const updateScreenSize = () => setIsCompactScreen(query.matches);

    updateScreenSize();
    query.addEventListener("change", updateScreenSize);

    return () => query.removeEventListener("change", updateScreenSize);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center grid-bg overflow-hidden">
      <div className="glow top-0 left-0"></div>

      <div className="max-w-7xl mx-auto px-6 w-full pt-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="uppercase tracking-[0.3em] text-blue-400 mb-6 mt-8"
            >
              Premium Engineering Studio
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black leading-[1]"
            >
              Building
              <span className="gradient-text"> modern </span>
              digital products for startups & Web3 ecosystems.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-xl mt-8 max-w-3xl leading-8"
            >
              Saabi Labs engineers premium web applications, blockchain
              infrastructure, smart contracts, AI systems, automation tools and
              scalable startup products.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-5 mt-10 flex-wrap"
            >
              <a
                href="https://wa.me/2348140668254"
                className="bg-blue-500 hover:scale-105 transition px-8 py-4 rounded-full"
              >
                Start a Project
              </a>

              <a href="#projects" className="glass px-8 py-4 rounded-full">
                View Work
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, rotateX: 18, rotateY: -18 }}
            animate={{ opacity: 1, rotateX: 0, rotateY: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="hero-visual-shell min-h-[360px] overflow-hidden rounded-[32px]"
          >
            {homeContent.heroImageUrl ? (
              <img
                src={homeContent.heroImageUrl}
                alt="Saabi Labs premium product showcase"
                className="h-[360px] w-full object-contain sm:h-[420px] lg:h-[560px]"
              />
            ) : (
              <div className="hero-visual hero-system-visual">
                <div className="hero-grid"></div>
                <div className="hero-scanline"></div>
                <div className="hero-core-glow"></div>

                <div className="hero-orbit hero-orbit-one"></div>
                <div className="hero-orbit hero-orbit-two"></div>
                <div className="hero-orbit hero-orbit-three"></div>

                <motion.div
                  animate={shouldSimplifyHero ? { rotate: 0 } : { rotate: 360 }}
                  transition={
                    shouldSimplifyHero
                      ? { duration: 0 }
                      : { duration: 34, repeat: Infinity, ease: "linear" }
                  }
                  className="hero-core-ring"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </motion.div>

                <motion.div
                  animate={
                    isCompactScreen
                      ? { y: 0 }
                      : shouldSimplifyHero
                        ? { y: 0 }
                        : { y: [0, -10, 0] }
                  }
                  transition={
                    shouldSimplifyHero
                      ? { duration: 0 }
                      : { duration: 5.6, repeat: Infinity, ease: "easeInOut" }
                  }
                  className="command-panel command-panel-main"
                >
                  <div className="command-topbar">
                    <div className="flex gap-2">
                      <span className="dot blue"></span>
                      <span className="dot purple"></span>
                      <span className="dot cyan"></span>
                    </div>
                    <span>SAABI CORE</span>
                  </div>

                  <div className="core-module">
                    <div>
                      <p>System Engine</p>
                      <h3>Premium Build Stack</h3>
                    </div>
                    <span>LIVE</span>
                  </div>

                  <div className="system-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="module-grid">
                    {systemModules.map(([label, value]) => (
                      <div key={label} className="module-tile">
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  animate={
                    shouldSimplifyHero
                      ? { x: 0, y: 0 }
                      : { x: [0, 8, 0], y: [0, 12, 0] }
                  }
                  transition={
                    shouldSimplifyHero
                      ? { duration: 0 }
                      : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
                  }
                  className="command-panel command-panel-status"
                >
                  <div className="panel-label">Launch Monitor</div>
                  <div className="status-stack">
                    {statusItems.map(([label, state]) => (
                      <div key={label} className="status-row">
                        <span className="status-pulse"></span>
                        <span>{label}</span>
                        <strong>{state}</strong>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  animate={shouldSimplifyHero ? { y: 0 } : { y: [0, -8, 0] }}
                  transition={
                    shouldSimplifyHero
                      ? { duration: 0 }
                      : { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
                  }
                  className="command-panel command-panel-code"
                >
                  <div className="panel-label">Agent Trace</div>
                  <div className="code-lines">
                    <span className="w-[86%]"></span>
                    <span className="w-[64%]"></span>
                    <span className="w-[92%]"></span>
                    <span className="w-[52%]"></span>
                  </div>
                </motion.div>

                <div className="data-node node-one"></div>
                <div className="data-node node-two"></div>
                <div className="data-node node-three"></div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
