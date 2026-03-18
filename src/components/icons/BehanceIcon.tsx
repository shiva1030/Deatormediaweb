const BehanceIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12.5h7.5a3.5 3.5 0 1 0 0-7H1v14h8a4 4 0 1 0 0-8" />
    <path d="M15 7h6" />
    <path d="M21.5 16.5a4.5 4.5 0 1 0-2 .5h4" />
  </svg>
);

export default BehanceIcon;
