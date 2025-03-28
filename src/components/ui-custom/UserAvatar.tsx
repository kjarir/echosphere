
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  size?: "sm" | "md" | "lg";
  isSpeaking?: boolean;
  isHost?: boolean;
  isMuted?: boolean;
  className?: string;
}

const UserAvatar = ({
  user,
  size = "md",
  isSpeaking = false,
  isHost = false,
  isMuted = false,
  className,
}: UserAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };
  
  const fallbackSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };
  
  return (
    <div className={cn("relative group", className)}>
      {/* Pulsing ring for active speaker */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-full animate-pulse-ring bg-voice-primary/30" />
      )}
      
      <Avatar 
        className={cn(
          sizeClasses[size], 
          "border-2",
          isHost ? "border-voice-primary" : "border-transparent",
          "transition-all duration-300 ease-in-out",
          isSpeaking ? "shadow-lg primary-glow scale-105" : ""
        )}
      >
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback 
          className={cn(
            "bg-voice-primary/80 text-white font-medium",
            fallbackSize[size]
          )}
        >
          {user.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      {/* Muted indicator */}
      {isMuted && (
        <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5 border border-white/10">
          <div className="bg-voice-danger h-3 w-3 rounded-full" />
        </div>
      )}
      
      {/* Host badge */}
      {isHost && (
        <div className="absolute -top-1 -right-1 rounded-full bg-voice-primary text-white text-xs px-1.5 py-0.5 border border-white/10">
          Host
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
