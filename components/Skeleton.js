export default function Skeleton({ variant = 'text', className = '' }) {
  const baseClasses = 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:1000px_100%] rounded';
  
  const variants = {
    banner: 'h-[300px] md:h-[450px] w-full',
    title: 'h-8 w-3/4 mb-4',
    text: 'h-4 w-full mb-2',
    sidebar: 'h-64 w-full',
  };

  return (
    <div className={`${baseClasses} ${variants[variant] || variants.text} ${className}`} />
  );
}
