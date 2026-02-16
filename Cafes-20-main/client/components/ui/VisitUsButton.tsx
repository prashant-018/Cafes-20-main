import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

interface VisitUsButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  showIcon?: boolean;
  text?: string;
}

export const VisitUsButton = ({
  className = "",
  size = 'md',
  variant = 'primary',
  showIcon = true,
  text = "Visit Us Today"
}: VisitUsButtonProps) => {

  const handleClick = () => {
    // Google Maps URL for The Himalayan Pizza, Jabalpur
    // Using a more specific search that includes the city name
    const mapsUrl = "https://www.google.com/maps/search/The+Himalayan+Pizza+Jabalpur,+Madhya+Pradesh,+India/@23.1815,79.9864,15z";
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-red-600 via-primary to-red-500 hover:from-red-700 hover:via-red-600 hover:to-red-600',
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        ${variantClasses[variant]}
        text-white font-semibold rounded-full 
        shadow-lg hover:shadow-xl 
        transition-all duration-300 
        transform hover:-translate-y-1 active:translate-y-0 
        flex items-center gap-2 justify-center
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {showIcon && <MapPin className="w-4 h-4" />}
      {text}
      <ExternalLink className="w-3 h-3 opacity-70" />
    </motion.button>
  );
};

export default VisitUsButton;