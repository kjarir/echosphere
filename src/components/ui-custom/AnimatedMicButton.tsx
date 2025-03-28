
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedMicButtonProps {
  initialState?: boolean;
  onChange?: (isActive: boolean) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const AnimatedMicButton = ({
  initialState = false,
  onChange,
  size = "md",
  className,
}: AnimatedMicButtonProps) => {
  const [isActive, setIsActive] = useState(initialState);
  
  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    onChange?.(newState);
  };
  
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-20 w-20",
  };
  
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className={cn(
        sizeClasses[size],
        "rounded-full transition-all duration-300 relative overflow-hidden",
        isActive 
          ? "bg-voice-primary hover:bg-voice-primary/90 border-voice-primary/50 primary-glow" 
          : "bg-voice-danger hover:bg-voice-danger/90 border-voice-danger/50",
        className
      )}
    >
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-transform duration-300",
        isActive ? "translate-y-0" : "translate-y-full"
      )}>
        <Mic className={cn(iconSizes[size], "text-white")} />
      </div>
      
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-transform duration-300",
        isActive ? "-translate-y-full" : "translate-y-0"
      )}>
        <MicOff className={cn(iconSizes[size], "text-white")} />
      </div>
    </Button>
  );
};

export default AnimatedMicButton;
