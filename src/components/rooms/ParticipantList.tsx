
import UserAvatar from "../ui-custom/UserAvatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Crown, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  isHost?: boolean;
  isSpeaker?: boolean;
  isMuted?: boolean;
  joinedAt?: string;
}

interface ParticipantListProps {
  participants: Participant[];
  activeSpeakerIds?: string[];
  showName?: boolean;
  compact?: boolean;
  currentUserId?: string;
  hostId?: string;
  onPromoteUser?: (userId: string) => void;
}

const ParticipantList = ({
  participants,
  activeSpeakerIds = [],
  showName = false,
  compact = false,
  currentUserId,
  hostId,
  onPromoteUser,
}: ParticipantListProps) => {
  const avatarSize = compact ? "sm" : "md";
  
  // Sort participants: hosts first, then speakers, then others
  // For listeners, sort by join time (most recent first)
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.isHost && !b.isHost) return -1;
    if (!a.isHost && b.isHost) return 1;
    if (a.isSpeaker && !b.isSpeaker) return -1;
    if (!a.isSpeaker && b.isSpeaker) return 1;
    
    // If both are listeners, sort by join time
    if (!a.isSpeaker && !b.isSpeaker && a.joinedAt && b.joinedAt) {
      return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
    }
    
    return 0;
  });
  
  // Check if current user is the host
  const isCurrentUserHost = currentUserId === hostId;
  
  return (
    <div className={cn(
      "grid gap-4",
      compact 
        ? "grid-cols-1" 
        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    )}>
      {sortedParticipants.map((participant) => {
        const timeAgo = participant.joinedAt 
          ? formatTimeAgo(new Date(participant.joinedAt)) 
          : '';
          
        return (
          <div 
            key={participant.id} 
            className={cn(
              "flex flex-col items-center",
              compact ? "flex-row justify-start gap-3" : "gap-2"
            )}
          >
            <div className="relative">
              <UserAvatar 
                user={participant}
                size={avatarSize}
                isHost={participant.isHost}
                isMuted={participant.isMuted}
                isSpeaking={activeSpeakerIds.includes(participant.id)}
              />
              
              {participant.isHost && (
                <span className="absolute -top-1 -right-1 text-yellow-400">
                  <Crown className="h-4 w-4" />
                </span>
              )}
            </div>
            
            {showName && (
              <div className={cn(
                "text-center",
                compact ? "text-left flex-1 min-w-0" : ""
              )}>
                <div className="flex items-center gap-1">
                  <p className={cn(
                    "font-medium truncate",
                    compact ? "text-sm" : "text-base"
                  )}>
                    {participant.name}
                    {participant.id === currentUserId && " (You)"}
                  </p>
                </div>
                
                {participant.isHost && !compact && (
                  <p className="text-xs text-voice-primary">Host</p>
                )}
                
                {!participant.isSpeaker && compact && timeAgo && (
                  <p className="text-xs text-muted-foreground">Joined {timeAgo}</p>
                )}
              </div>
            )}
            
            {/* Promote button - only shown to host for listeners */}
            {isCurrentUserHost && 
             !participant.isSpeaker && 
             participant.id !== currentUserId &&
             compact && 
             onPromoteUser && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full bg-voice-primary/10 hover:bg-voice-primary/20"
                      onClick={() => onPromoteUser(participant.id)}
                    >
                      <Zap className="h-3.5 w-3.5 text-voice-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Promote to Speaker</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper function to format time ago
const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  if (seconds < 10) return "just now";
  return Math.floor(seconds) + " seconds ago";
};

export default ParticipantList;
