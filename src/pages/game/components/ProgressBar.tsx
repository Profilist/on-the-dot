interface ProgressBarProps {
  progress: number
  total: number
}

export function ProgressBar({ progress, total }: ProgressBarProps) {
  const percentage = (progress / total) * 100

  return (
    <div className="w-full">
      <div className="w-full h-8 bg-white border-2 border-black rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#FF2C2C]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right mt-2 text-sm">/{total}</div>
    </div>
  )
} 