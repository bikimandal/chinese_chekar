interface SkeletonBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export default function SkeletonBase({ className = "", children }: SkeletonBaseProps) {
  return (
    <div
      className={`bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 bg-[length:200%_100%] animate-shimmer ${className}`}
    >
      {children}
    </div>
  );
}

