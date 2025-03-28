
import { Link } from "react-router-dom";
import { Users, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  id: string;
  title: string;
  topic: string;
  participantCount: number;
  speakerCount: number;
  hosts: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
  }>;
  isLive?: boolean;
}

const RoomCard = ({
  id,
  title,
  topic,
  participantCount,
  speakerCount,
  hosts,
  isLive = true,
}: RoomCardProps) => {
  return (
    <Link 
      to={`/room/${id}`}
      className="block" 
    >
      <div 
        className={cn(
          "glass-card-hover relative rounded-xl p-5 transition-all duration-300",
          "group hover:translate-y-[-4px]",
          isLive ? "ring-1 ring-voice-primary/30" : "opacity-80"
        )}
      >
        {/* Live badge */}
        {isLive && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge 
              className="bg-voice-primary text-white font-medium flex items-center gap-1.5 px-2.5 py-1"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </Badge>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-xl font-bold mb-1 text-white group-hover:text-gradient transition-all duration-300">{title}</h3>
          <p className="text-sm text-muted-foreground">{topic}</p>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{participantCount} listening</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mic className="h-4 w-4" />
            <span>{speakerCount} speaking</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Hosted by</p>
          <div className="flex -space-x-2">
            {hosts.map((host) => (
              <Avatar 
                key={host.id} 
                className="border-2 border-card w-8 h-8 transition-transform duration-300 group-hover:translate-y-[-2px]"
              >
                <AvatarImage src={host.avatarUrl} />
                <AvatarFallback className="bg-voice-primary text-white text-xs">
                  {host.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
