import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ParticipantList from "./ParticipantList";
import AnimatedMicButton from "../ui-custom/AnimatedMicButton";
import { Mic, MicOff, Hand, LogOut, Users, MessageSquare, Share2, Crown, VolumeX, Volume2, Radio, Zap, Gift, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mockRoom = {
  id: "room-1",
  title: "Tech Talk: Future of AI",
  topic: "Technology",
  description: "Join us to discuss the latest advancements in AI technology and what the future holds. We'll cover topics from machine learning to ethics in AI development.",
  createdBy: "user-1",
  participants: [
    { id: "user-1", name: "Alex Johnson", avatarUrl: "", isHost: true, isSpeaker: true, joinedAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "user-2", name: "Maria Garcia", avatarUrl: "", isHost: false, isSpeaker: true, joinedAt: new Date(Date.now() - 2400000).toISOString() },
    { id: "user-3", name: "Sam Taylor", avatarUrl: "", isHost: false, isSpeaker: true, isMuted: true, joinedAt: new Date(Date.now() - 1800000).toISOString() },
    { id: "user-4", name: "Jamie Smith", avatarUrl: "", isHost: false, isSpeaker: true, joinedAt: new Date(Date.now() - 900000).toISOString() },
    { id: "user-5", name: "Taylor Wong", avatarUrl: "", isHost: false, isSpeaker: false, joinedAt: new Date(Date.now() - 600000).toISOString() },
    { id: "user-6", name: "Olivia Chen", avatarUrl: "", isHost: false, isSpeaker: false, joinedAt: new Date(Date.now() - 300000).toISOString() },
    { id: "user-7", name: "Michael Brown", avatarUrl: "", isHost: false, isSpeaker: false, joinedAt: new Date(Date.now() - 200000).toISOString() },
    { id: "user-8", name: "Emma Davis", avatarUrl: "", isHost: false, isSpeaker: false, joinedAt: new Date(Date.now() - 100000).toISOString() },
    { id: "user-9", name: "John Doe", avatarUrl: "", isHost: false, isSpeaker: false, joinedAt: new Date().toISOString() },
    { id: "user-10", name: "Jane Doe", avatarUrl: "", isHost: false, isSpeaker: false, joinedAt: new Date().toISOString() },
  ],
  chats: [
    { id: "chat-1", userId: "user-5", userName: "Taylor Wong", message: "This is fascinating! Can anyone explain more about neural networks?", timestamp: new Date().toISOString() },
    { id: "chat-2", userId: "user-6", userName: "Olivia Chen", message: "I agree with what Alex said about AI ethics. We need more regulation.", timestamp: new Date().toISOString() },
    { id: "chat-3", userId: "user-2", userName: "Maria Garcia", message: "Does anyone have resources about getting started with machine learning?", timestamp: new Date().toISOString() },
    { id: "chat-4", userId: "user-8", userName: "Emma Davis", message: "I work in ML research and would be happy to share some insights!", timestamp: new Date().toISOString() },
  ],
  voiceEffects: [
    { id: "effect-1", name: "Echo", active: false },
    { id: "effect-2", name: "Deep Voice", active: false },
    { id: "effect-3", name: "Radio", active: false },
    { id: "effect-4", name: "Robot", active: false }
  ],
  reactions: {
    "👏": 12,
    "❤️": 8,
    "🔥": 5,
    "💯": 3,
    "😂": 7
  }
};

const simulateVoiceActivity = (participants: any[], currentUserId: string = "") => {
  const speakerIds = participants
    .filter(p => p.isSpeaker && !p.isMuted)
    .map(p => p.id);
  
  const eligibleSpeakers = currentUserId ? 
    speakerIds.filter(id => id !== currentUserId || (id === currentUserId && document.microphoneActive)) 
    : speakerIds;
  
  if (eligibleSpeakers.length === 0) return [];
  
  const numberOfActiveSpeakers = Math.floor(Math.random() * 2) + 1;
  return [...eligibleSpeakers]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(numberOfActiveSpeakers, eligibleSpeakers.length));
};

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

interface VoiceEffect {
  id: string;
  name: string;
  active: boolean;
}

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const bottomOfChat = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("participants");
  const [effectsOpen, setEffectsOpen] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeSpeakers, setActiveSpeakers] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState("user-5");
  const [messages, setMessages] = useState<Message[]>(mockRoom.chats);
  const [newMessage, setNewMessage] = useState("");
  const [isJoiningAsListener, setIsJoiningAsListener] = useState(true);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceEffects, setVoiceEffects] = useState<VoiceEffect[]>(mockRoom.voiceEffects);
  const [reactions, setReactions] = useState(mockRoom.reactions);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [recentReactions, setRecentReactions] = useState<{emoji: string, timestamp: number}[]>([]);
  
  const room = mockRoom;
  
  const host = room.participants.find(p => p.isHost);
  
  useEffect(() => {
    if (!hasJoinedRoom) return;
    
    const interval = setInterval(() => {
      const newActiveSpeakers = simulateVoiceActivity(room.participants, currentUserId);
      setActiveSpeakers(newActiveSpeakers);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [hasJoinedRoom, isMicActive]);
  
  useEffect(() => {
    if (bottomOfChat.current) {
      bottomOfChat.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  useEffect(() => {
    if (recentReactions.length === 0) return;
    
    const timeout = setTimeout(() => {
      setRecentReactions(prev => prev.filter(r => Date.now() - r.timestamp < 3000));
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [recentReactions]);
  
  const handleMicToggle = (isActive: boolean) => {
    setIsMicActive(isActive);
    toast(isActive ? "Microphone activated" : "Microphone muted");
    
    document.microphoneActive = isActive;
  };
  
  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    toast(isHandRaised ? "Hand lowered" : "Hand raised. The host will be notified.");
    
    if (!isHandRaised) {
      const host = room.participants.find(p => p.isHost);
      if (host) {
        setTimeout(() => {
          toast(`${host.name} has seen your raised hand`);
        }, 2000);
      }
    }
  };
  
  const handleLeaveRoom = () => {
    toast("Left the room");
    setHasJoinedRoom(false);
    navigate("/");
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `chat-${Date.now()}`,
      userId: currentUserId,
      userName: room.participants.find(p => p.id === currentUserId)?.name || "You",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    
    if (activeTab !== "chat") {
      setActiveTab("chat");
    }
  };
  
  const handleJoinRoom = (asSpeaker: boolean) => {
    setIsConnecting(true);
    setIsJoiningAsListener(!asSpeaker);
    
    setTimeout(() => {
      setIsConnecting(false);
      setHasJoinedRoom(true);
      
      if (asSpeaker) {
        setIsMicActive(true);
        document.microphoneActive = true;
        
        toast.success("You've joined as a speaker");
      } else {
        toast.success("You've joined as a listener");
      }
    }, 1500);
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    toast(`Volume set to ${newVolume}%`);
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast(isMuted ? "Unmuted audio" : "Muted audio");
  };
  
  const toggleVoiceEffect = (effectId: string) => {
    setVoiceEffects(prev => 
      prev.map(effect => 
        effect.id === effectId 
          ? { ...effect, active: !effect.active } 
          : effect
      )
    );
    
    const effect = voiceEffects.find(e => e.id === effectId);
    if (effect) {
      toast(`${effect.active ? 'Disabled' : 'Enabled'} ${effect.name} effect`);
    }
  };
  
  const sendReaction = (emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));
    
    setRecentReactions(prev => [
      ...prev, 
      { emoji, timestamp: Date.now() }
    ]);
  };
  
  const handleInviteUser = () => {
    toast.success("Invitation sent successfully!");
    setIsInviteModalOpen(false);
  };
  
  const promoteToSpeaker = (userId: string) => {
    toast.success(`User promoted to speaker`);
  };
  
  if (!hasJoinedRoom) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-fade-in">
        <Card className="glass-card p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-2 text-gradient">{room.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">{room.topic}</p>
          <p className="text-sm text-foreground/80 mb-6">{room.description}</p>
          
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full bg-voice-primary hover:bg-voice-primary/90 gap-2"
              disabled={isConnecting}
              onClick={() => handleJoinRoom(false)}
            >
              {isConnecting && isJoiningAsListener ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Users className="h-5 w-5" />
                  Join as Listener
                </>
              )}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full gap-2"
              disabled={isConnecting}
              onClick={() => handleJoinRoom(true)}
            >
              {isConnecting && !isJoiningAsListener ? (
                <div className="h-5 w-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  Join as Speaker
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <Card className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold mb-2 text-gradient">{room.title}</h1>
              <Badge variant="outline" className="bg-voice-primary/20 text-xs border-voice-primary/30">
                LIVE
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{room.topic}</p>
            <p className="text-sm text-foreground/80 max-w-2xl">{room.description}</p>
            
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Hosted by:</span>
              <span className="text-xs font-medium flex items-center gap-1">
                <Crown className="h-3 w-3 text-yellow-400" />
                {host?.name || "Unknown Host"}
              </span>
            </div>
          </div>
          
          <div className="flex md:flex-col justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-muted/50 border-white/10"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
                toast.success("Room link copied to clipboard!");
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            {host?.id === currentUserId && (
              <Button
                variant="outline"
                size="sm"
                className="bg-voice-primary/20 border-voice-primary/30 hover:bg-voice-primary/30"
                onClick={() => setIsInviteModalOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            )}
            
            <Button 
              variant="destructive" 
              size="sm" 
              className="bg-voice-danger/80 hover:bg-voice-danger"
              onClick={handleLeaveRoom}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card p-6 min-h-[400px] relative overflow-hidden">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              Speakers
              {host && (
                <span className="text-xs text-muted-foreground ml-2">
                  Host: {host.name}
                </span>
              )}
            </h2>
            
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {recentReactions.map((reaction, index) => (
                <div 
                  key={`${reaction.emoji}-${reaction.timestamp}-${index}`}
                  className="absolute animate-float-up text-2xl"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    bottom: '10%',
                    animation: `float-up 3s ease-out forwards, fade-out 3s ease-out forwards`,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {reaction.emoji}
                </div>
              ))}
            </div>
            
            <ParticipantList 
              participants={room.participants.filter(p => p.isSpeaker)} 
              activeSpeakerIds={activeSpeakers}
              showName
            />
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-white/10 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Voice Effects</h3>
                <Button variant="ghost" size="sm" onClick={() => setEffectsOpen(false)}>
                  Close
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {voiceEffects.map(effect => (
                  <Button
                    key={effect.id}
                    variant={effect.active ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "text-xs h-auto py-2",
                      effect.active 
                        ? "bg-voice-primary hover:bg-voice-primary/90" 
                        : "border-white/10 hover:bg-white/5"
                    )}
                    onClick={() => toggleVoiceEffect(effect.id)}
                  >
                    {effect.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-muted-foreground">Reactions</h3>
                <span className="text-xs text-muted-foreground">
                  {Object.values(reactions).reduce((sum, count) => sum + count, 0)} total
                </span>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                {Object.entries(reactions).map(([emoji, count]) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-base hover:bg-white/5"
                    onClick={() => sendReaction(emoji)}
                  >
                    <span className="mr-1">{emoji}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
          
          <Card className="glass-card p-4">
            <div className="mb-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleToggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="h-4 w-4 text-voice-primary" />
                )}
              </Button>
              
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                className="flex-1"
                onValueChange={handleVolumeChange}
                disabled={isMuted}
              />
              
              <span className="text-xs text-muted-foreground w-8 text-right">
                {volume}%
              </span>
            </div>
            
            <div className="flex justify-center gap-4 py-2">
              <AnimatedMicButton 
                initialState={isMicActive}
                onChange={handleMicToggle}
                size="lg"
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleRaiseHand}
                className={cn(
                  "h-14 w-14 rounded-full transition-all duration-300",
                  isHandRaised 
                    ? "bg-voice-accent hover:bg-voice-accent/90 border-voice-accent/50 accent-glow" 
                    : "bg-muted hover:bg-muted/90 border-voice-muted/50"
                )}
              >
                <Hand className={cn(
                  "h-6 w-6 transition-all duration-300",
                  isHandRaised ? "text-white" : "text-muted-foreground"
                )} />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEffectsOpen(!effectsOpen)}
                className={cn(
                  "h-14 w-14 rounded-full transition-all duration-300",
                  effectsOpen
                    ? "bg-voice-primary hover:bg-voice-primary/90 border-voice-primary/50" 
                    : "bg-muted hover:bg-muted/90 border-voice-muted/50"
                )}
              >
                <Radio className={cn(
                  "h-6 w-6 transition-all duration-300",
                  effectsOpen ? "text-white" : "text-muted-foreground"
                )} />
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="h-full">
          <Card className="glass-card h-full flex flex-col">
            <Tabs 
              defaultValue="participants" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full h-full flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="participants" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Participants</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="participants" className="flex-1 p-4 overflow-auto animate-fade-in">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {room.participants.length} Participants
                </h3>
                
                {currentUserId === host?.id && (
                  <div className="mb-4 p-3 border border-voice-primary/20 rounded-lg bg-voice-primary/5">
                    <p className="text-xs text-muted-foreground mb-1">Host Controls</p>
                    <p className="text-xs mb-2">As host, you can promote listeners to speakers.</p>
                  </div>
                )}
                
                <ParticipantList 
                  participants={room.participants.filter(p => !p.isSpeaker)} 
                  showName
                  compact
                  currentUserId={currentUserId}
                  hostId={host?.id}
                  onPromoteUser={promoteToSpeaker}
                />
              </TabsContent>
              
              <TabsContent value="chat" className="flex-1 flex flex-col animate-fade-in">
                <div className="flex-1 p-4 overflow-auto">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Chat
                  </h3>
                  
                  <div className="space-y-4">
                    {messages.map((chat) => (
                      <div key={chat.id} className={cn(
                        "flex gap-2",
                        chat.userId === currentUserId ? "opacity-80" : ""
                      )}>
                        <div className="h-6 w-6 rounded-full bg-voice-primary/20 flex items-center justify-center text-xs font-medium text-white">
                          {chat.userName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">
                              {chat.userId === currentUserId ? "You" : chat.userName}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(chat.timestamp).toLocaleTimeString([], {
                                hour: "2-digit", 
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80">{chat.message}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomOfChat} />
                  </div>
                </div>
                
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 bg-muted/50 border border-white/10 rounded-lg px-3 py-2 text-sm" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="bg-voice-primary hover:bg-voice-primary/90">
                    Send
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

declare global {
  interface Document {
    microphoneActive: boolean;
  }
}

document.microphoneActive = false;

export default Room;
