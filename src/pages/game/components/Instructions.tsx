interface InstructionsProps {
  category: string;
}

export function Instructions({ category }: InstructionsProps) {
  return (
    <div className="w-full max-w-2xl border-3 border-black rounded-3xl p-8 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">How to play</h2>
        <div className="w-6 h-6 rounded-full flex items-center justify-center">
          <img src="question.svg" />
        </div>
      </div>

      <div className="space-y-4 text-lg">
        <p>
          Guess the {category.toLowerCase()} in the top 100 closest to the 100th
          spot.
        </p>

        <p>You have 4 guesses.</p>
        <p>
          After submitting a guess, you will see its position in the top 100.
        </p>

        <p>Try to get #100, #99, #98, and #97 for the max score!</p>

        <div className="flex items-center gap-2">
          <p>Scores of 90 and above are</p>
          <span className="font-bold">ON THE DOT</span>
          <div className="w-4 h-4 bg-[#FF2C2C] rounded-full" />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-black italic text-gray-600">
        follow us on{" "}
        <span>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            x
          </a>
        </span>{" "}
        for the latest updates and join the ON THE DOT discord community!
      </div>
    </div>
  );
}
