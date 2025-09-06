import Image from 'next/image';

interface LogoInstitucionalProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function LogoInstitucional({ 
  size = 'md', 
  className = '',
  showText = true 
}: LogoInstitucionalProps) {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16', 
    lg: 'h-20 w-20'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className={`relative ${sizeClasses[size]} mb-2`}>
        <Image
          src="/images/che-mini-logo.svg"
          alt="CHE - Mundo Libre"
          fill
          className="object-contain"
        />
      </div>
      {showText && (
        <div>
          <p className={`${textSizes[size]} text-gray-600 font-medium`}>CHE</p>
          <p className={`${textSizes[size]} text-gray-500`}>Mundo Libre</p>
        </div>
      )}
    </div>
  );
}
