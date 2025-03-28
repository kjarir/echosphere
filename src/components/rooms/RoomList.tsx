
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoomCard from "../ui-custom/RoomCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Mock data
const mockRooms = [
  {
    id: "room-1",
    title: "Tech Talk: Future of AI",
    topic: "Technology",
    participantCount: 324,
    speakerCount: 5,
    hosts: [
      { id: "user-1", name: "Alex Johnson", avatarUrl: "" },
      { id: "user-2", name: "Maria Garcia", avatarUrl: "" },
    ],
    isLive: true,
  },
  {
    id: "room-2",
    title: "Morning Meditation & Mindfulness",
    topic: "Wellness",
    participantCount: 128,
    speakerCount: 2,
    hosts: [
      { id: "user-3", name: "Sam Taylor", avatarUrl: "" },
    ],
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
  {
    id: "room-4",
    title: "Book Club: 'The Midnight Library'",
    topic: "Books & Literature",
    participantCount: 86,
    speakerCount: 3,
    hosts: [
      { id: "user-6", name: "Olivia Chen", avatarUrl: "" },
    ],
    isLive: true,
  },
  {
    id: "room-5",
    title: "Startup Founders Networking",
    topic: "Business",
    participantCount: 156,
    speakerCount: 6,
    hosts: [
      { id: "user-7", name: "Michael Brown", avatarUrl: "" },
      { id: "user-8", name: "Emma Davis", avatarUrl: "" },
    ],
    isLive: false,
    startTime: "Tomorrow, 3:00 PM",
  },
];

const RoomList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("trending");
  
  const liveRooms = mockRooms.filter(room => room.isLive);
  const upcomingRooms = mockRooms.filter(room => !room.isLive);
  
  const handleCreateRoom = () => {
    // Would navigate to room creation page, for now just creates a demo room
    navigate("/room/new-room");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gradient">Discover Rooms</h2>
        <Button 
          onClick={handleCreateRoom}
          className="bg-voice-primary hover:bg-voice-primary/90 flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create Room</span>
        </Button>
      </div>
      
      <Tabs 
        defaultValue="trending" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {mockRooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="live" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {liveRooms.length > 0 ? (
              liveRooms.map((room) => (
                <RoomCard key={room.id} {...room} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No live rooms at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {upcomingRooms.length > 0 ? (
              upcomingRooms.map((room) => (
                <RoomCard key={room.id} {...room} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No upcoming rooms scheduled.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomList;
