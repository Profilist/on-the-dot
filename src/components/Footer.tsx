//import { FaDiscord, FaXTwitter, FaLinkedin } from 'react-icons/fa6'

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`w-full py-4 ${className}`}>
      <div className="container mx-auto flex flex-col items-center justify-center gap-3">
        {/* <div className="flex items-center gap-6">
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Discord"
          >
            <FaDiscord className="w-5 h-5" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="X (Twitter)"
          >
            <FaXTwitter className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
        </div> */}

        <p className="text-sm text-gray-600">
        © 2025 11213Labs |{" "}
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
            discord
        </a>
        ,{" "}
        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            x
        </a>
        ,{" "}
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            linkedin
        </a>
        </p>

      </div>
    </footer>
  )
}
