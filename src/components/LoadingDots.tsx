export default function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-2" role="status" aria-label="Loading response">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#8A8A8A]"
          style={{
            animation: 'dotPulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 200}ms`,
          }}
        />
      ))}
    </div>
  )
}
