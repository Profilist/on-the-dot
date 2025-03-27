interface ProgressBarProps {
  progress: number
  total: number
}

export function ProgressBar({ progress, total }: ProgressBarProps) {
  const percentage = Math.min((progress / total) * 100, 100)
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Score: {progress}</span>
        <span className="text-sm text-gray-600">Max: {total}</span>
      </div>
      <div className="w-full h-8 bg-white border-2 border-black rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#FF2C2C] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
} 