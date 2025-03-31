import { motion } from 'framer-motion'

interface InstructionsProps {
  category: string;
}

export function Instructions({ category }: InstructionsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl border-3 border-black rounded-3xl p-8 mt-8 bg-white"
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-2 mb-4"
      >
        <h2 className="text-2xl font-bold">How to play</h2>
        <motion.div 
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-6 rounded-full flex items-center justify-center"
        >
          <img src="question.svg" />
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4 text-lg"
      >
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Guess the {category.toLowerCase()} in the top 100 closest to the 100th
          spot.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          You have 4 guesses.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          After submitting a guess, you will see its position in the top 100.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Try to get #100, #99, #98, and #97 for the max score!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex items-center gap-2"
        >
          <p>Scores of 90 and above are</p>
          <span className="font-bold">ON THE DOT</span>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              delay: 1.1
            }}
            className="w-4 h-4 bg-[#FF2C2C] rounded-full" 
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-8 pt-6 border-t border-black italic text-gray-600"
      >
        follow us on{" "}
        <motion.span
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            x
          </a>
        </motion.span>{" "}
        for the latest updates and join the ON THE DOT discord community!
      </motion.div>
    </motion.div>
  );
}
