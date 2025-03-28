
import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  User, 
  LogOut, 
  PlusCircle, 
  Mic, 
  Bell, 
  Calendar, 
  MessageSquare,
  Settings,
  Crown,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

interface AppLayoutProps {
  children: ReactNode;
}

interface Notification {
  id: string;
  type: 'mention' | 'invite' | 'announcement' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'mention',
    title: 'New Mention',
    message: 'Alex mentioned you in "Tech Talk: Future of AI"',
    timestamp: '5 min ago',
    read: false
  },
  {
    id: 'notif-2',
    type: 'invite',
    title: 'Room Invitation',
    message: 'Maria invited you to join "Music Production Basics"',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-3',
    type: 'announcement',
    title: 'New Feature',
    message: 'Voice filters are now available for all speakers!',
    timestamp: 'Yesterday',
    read: true
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Account Update',
    message: 'Your profile was successfully updated',
    timestamp: '3 days ago',
    read: true
  }
];

const NavItem = ({ 
  icon: Icon, 
  to, 
  label,
  badge,
  onClick
}: { 
  icon: React.ElementType; 
  to: string; 
  label: string;
  badge?: number;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className="w-full"
      onClick={onClick}
    >
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start gap-3 text-lg font-medium transition-all duration-300",
          isActive 
            ? "bg-voice-primary/20 text-white hover:bg-voice-primary/30" 
            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
        )}
      >
        <Icon 
          className={cn(
            "h-5 w-5 transition-transform duration-300", 
            isActive && "text-voice-accent"
          )} 
        />
        <span className="transition-all duration-300">{label}</span>
        {badge && badge > 0 && (
          <Badge variant="default" className="ml-auto bg-voice-accent text-white">
            {badge > 99 ? "99+" : badge}
          </Badge>
        )}
      </Button>
    </Link>
  );
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Calculate unread notifications
    const count = notifications.filter(notif => !notif.read).length;
    setUnreadCount(count);
  }, [notifications]);
  
  const handleCreateRoom = () => {
    navigate("/create-room");
  };
  
  const handleLogout = () => {
    // In a real app, this would handle actual logout logic
    toast.success("Logged out successfully");
    navigate("/");
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Notification icon for each type
  const notificationIcons = {
    mention: MessageSquare,
    invite: Users,
    announcement: Crown,
    system: Settings
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col gap-6 bg-muted p-4 z-10">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-voice-primary shadow-lg">
            <Mic className="h-5 w-5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-voice-primary/30 animate-pulse-ring" />
          </div>
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold text-gradient">EchoSphere</h1>
          </Link>
        </div>
        
        <div className="flex-1 space-y-2 py-4">
          <NavItem icon={Home} to="/" label="Discover" />
          <NavItem icon={Users} to="/explore" label="Explore" />
          <NavItem icon={Calendar} to="/events" label="Events" />
          <NavItem icon={User} to="/profile" label="Profile" />
        </div>
        
        <div className="mt-auto">
          <Button 
            variant="default" 
            className="w-full gap-2 bg-voice-primary hover:bg-voice-primary/90 btn-shine mb-4"
            onClick={handleCreateRoom}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Room</span>
          </Button>
          
          <div className="px-2 py-3 border-t border-white/10 mt-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10 border-2 border-voice-primary/50">
                <AvatarImage src="" />
                <AvatarFallback className="bg-voice-primary/20 text-white">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Jane Doe</p>
                <p className="text-xs text-muted-foreground truncate">@janedoe</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" /> 
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-20 bg-muted/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-voice-primary shadow-lg">
              <Mic className="h-4 w-4 text-white" />
            </div>
            <Link to="/">
              <h1 className="text-lg font-bold text-gradient">EchoSphere</h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-voice-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Notifications</h3>
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto py-1 px-2 text-xs">
                      Mark all as read
                    </Button>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div>
                      {notifications.map((notif) => {
                        const NotifIcon = notificationIcons[notif.type];
                        return (
                          <div 
                            key={notif.id} 
                            className={cn(
                              "p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors",
                              !notif.read && "bg-voice-primary/5"
                            )}
                            onClick={() => markAsRead(notif.id)}
                          >
                            <div className="flex gap-3">
                              <div className={cn(
                                "rounded-full p-2 h-8 w-8 flex items-center justify-center",
                                !notif.read ? "bg-voice-primary text-white" : "bg-muted"
                              )}>
                                <NotifIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{notif.title}</p>
                                <p className="text-xs text-muted-foreground">{notif.message}</p>
                                <p className="text-xs text-voice-accent mt-1">{notif.timestamp}</p>
                              </div>
                              {!notif.read && (
                                <div className="h-2 w-2 rounded-full bg-voice-accent self-start mt-2" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            <Drawer>
              <DrawerTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <NavItem icon={Home} to="/" label="Discover" onClick={() => setIsMobileMenuOpen(false)} />
                  <NavItem icon={Users} to="/explore" label="Explore" onClick={() => setIsMobileMenuOpen(false)} />
                  <NavItem icon={Calendar} to="/events" label="Events" onClick={() => setIsMobileMenuOpen(false)} />
                  <NavItem icon={User} to="/profile" label="Profile" onClick={() => setIsMobileMenuOpen(false)} />
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <Button 
                    className="w-full bg-voice-primary hover:bg-voice-primary/90 btn-shine"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleCreateRoom();
                    }}
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Create Room
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-voice-primary/50">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-voice-primary/20 text-white">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Jane Doe</p>
                      <p className="text-xs text-muted-foreground">@janedoe</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 mt-4 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-5 w-5" /> 
                    <span>Logout</span>
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
      
      {/* Desktop notification panel */}
      <div className="hidden md:block absolute top-4 right-4 z-20">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="bg-muted/80 backdrop-blur-md relative border border-white/10">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-voice-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto py-1 px-2 text-xs">
                  Mark all as read
                </Button>
              </div>
            </div>
            <div className="max-h-[300px] overflow-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No notifications</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notif) => {
                    const NotifIcon = notificationIcons[notif.type];
                    return (
                      <div 
                        key={notif.id} 
                        className={cn(
                          "p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors",
                          !notif.read && "bg-voice-primary/5"
                        )}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex gap-3">
                          <div className={cn(
                            "rounded-full p-2 h-8 w-8 flex items-center justify-center",
                            !notif.read ? "bg-voice-primary text-white" : "bg-muted"
                          )}>
                            <NotifIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notif.title}</p>
                            <p className="text-xs text-muted-foreground">{notif.message}</p>
                            <p className="text-xs text-voice-accent mt-1">{notif.timestamp}</p>
                          </div>
                          {!notif.read && (
                            <div className="h-2 w-2 rounded-full bg-voice-accent self-start mt-2" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Main content */}
      <main className="flex-1 md:p-6 p-4 pt-20 md:pt-6 overflow-auto">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
