
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/ui-custom/UserAvatar";
import RoomCard from "@/components/ui-custom/RoomCard";
import { Users, Calendar, Settings, Edit } from "lucide-react";

// Mock user data
const currentUser = {
  id: "current-user",
  name: "Alex Johnson",
  username: "@alexj",
  bio: "Tech enthusiast, AI researcher, and avid podcast listener. I host rooms about the future of technology and its impact on society.",
  followersCount: 1243,
  followingCount: 387,
  avatarUrl: "",
};

// Mock rooms data
const hostedRooms = [
  {
    id: "room-1",
    title: "Tech Talk: Future of AI",
    topic: "Technology",
    participantCount: 324,
    speakerCount: 5,
    hosts: [{ id: "current-user", name: "Alex Johnson", avatarUrl: "" }],
    isLive: true,
  },
  {
    id: "room-5",
    title: "Startup Founders Networking",
    topic: "Business",
    participantCount: 156,
    speakerCount: 6,
    hosts: [{ id: "current-user", name: "Alex Johnson", avatarUrl: "" }],
    isLive: false,
  },
];

const joinedRooms = [
  {
    id: "room-2",
    title: "Morning Meditation & Mindfulness",
    topic: "Wellness",
    participantCount: 128,
    speakerCount: 2,
    hosts: [{ id: "user-3", name: "Sam Taylor", avatarUrl: "" }],
    isLive: true,
  },
  {
    id: "room-3",
    title: "Indie Music Showcase",
    topic: "Music",
    participantCount: 253,
    speakerCount: 4,
    hosts: [
      { id: "user-4", name: "Jamie Smith", avatarUrl: "" },
      { id: "user-5", name: "Taylor Wong", avatarUrl: "" },
    ],
    isLive: true,
  },
];

const ProfilePage = () => {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* Profile header */}
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <UserAvatar 
              user={currentUser} 
              size="lg" 
              className="md:mt-2"
            />
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                <p className="text-muted-foreground">{currentUser.username}</p>
              </div>
              
              <p className="mb-4 text-foreground/80">{currentUser.bio}</p>
              
              <div className="flex justify-center md:justify-start gap-6 mb-4">
                <div>
                  <p className="text-lg font-semibold">{currentUser.followersCount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{currentUser.followingCount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Rooms tabs */}
        <Tabs defaultValue="hosted" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="hosted" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Hosted Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="joined" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Joined Rooms</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hosted" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {hostedRooms.length > 0 ? (
                hostedRooms.map((room) => (
                  <RoomCard key={room.id} {...room} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">You haven't hosted any rooms yet.</p>
                  <Button variant="default" className="mt-4 bg-voice-primary hover:bg-voice-primary/90">
                    Host Your First Room
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="joined" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {joinedRooms.length > 0 ? (
                joinedRooms.map((room) => (
                  <RoomCard key={room.id} {...room} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">You haven't joined any rooms yet.</p>
                  <Button variant="default" className="mt-4 bg-voice-primary hover:bg-voice-primary/90">
                    Explore Rooms
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
