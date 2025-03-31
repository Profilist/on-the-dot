import { motion } from "framer-motion";
import { FadeIn } from "./components/FadeIn";
import { Footer } from "../../components/Footer";
import { DottedBackground } from "../../components/DottedBackground";

interface LandingPageProps {
  onStartGame: () => void;
}

export function LandingPage({ onStartGame }: LandingPageProps) {
  return (
    <div className="relative">
      <DottedBackground />

      <div className="h-screen w-screen flex flex-col items-center justify-between bg-white">
        <div className="flex-1" />

        <div className="flex flex-col items-center justify-center gap-8 px-4">
          {/* Logo */}
          <FadeIn delay={0.2}>
            <div className="w-full max-w-2xl mb-[12px]">
              <img
                src="/logo.svg"
                alt="On the Dot Logo"
                className="w-[360px] h-auto block"
              />
            </div>
          </FadeIn>

          {/* Divider lines */}
          <FadeIn delay={0.3}>
            <div className="w-screen border-t border-black" />
          </FadeIn>

          {/* Game description */}
          <FadeIn delay={0.4}>
            <h1 className="text-4xl md:text-3xl text-center font-normal">
              Guess the item closest to #100.
            </h1>
          </FadeIn>

          {/* Bottom divider */}
          <FadeIn delay={0.5}>
            <div className="w-screen border-t border-black" />
          </FadeIn>

          {/* Play button */}
          <FadeIn delay={0.6}>
            <motion.button
              onClick={onStartGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white relative px-24 py-6 text-3xl border-2 border-black rounded-full
                       overflow-hidden transition-all duration-300
                       hover:text-white hover:border-[#f11d2b] group"
            >
              <span className="relative z-10">Play</span>
              <div
                className="absolute inset-0 bg-[#f11d2b] transform scale-x-0 
                            group-hover:scale-x-100 transition-transform duration-300 
                            origin-left"
              />
            </motion.button>
          </FadeIn>
        </div>

        {/* Bottom spacer with Footer */}
        <div className="flex-1 flex items-end">
          <FadeIn delay={0.7}>
            <Footer />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
