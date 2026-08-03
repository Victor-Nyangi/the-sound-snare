import React from "react";

interface SkeletonProps {
  className?: string;
  lines?: number;
}

// Deterministic widths: Math.random() during render produces different markup
// on the server and the client, which triggers a hydration mismatch.
const LINE_WIDTHS = ["100%", "75%", "85%", "65%", "95%", "70%"];

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  lines = 1,
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 rounded mb-2"
          style={{ width: LINE_WIDTHS[index % LINE_WIDTHS.length] }}
        />
      ))}
    </div>
  );
};

export const ArticleSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="w-full h-64 bg-gray-200 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
};

export default Skeleton;
