
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoomCard from "@/components/ui-custom/RoomCard";
import { Search, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";

// Mock data - in a real app this would come from an API
const allRooms = [
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
  {
    id: "room-6",
    title: "Language Exchange - Spanish/English",
    topic: "Languages",
    participantCount: 42,
    speakerCount: 8,
    hosts: [
      { id: "user-9", name: "Carlos Rodriguez", avatarUrl: "" },
    ],
    isLive: true,
  },
  {
    id: "room-7",
    title: "Photography Tips & Tricks",
    topic: "Arts & Crafts",
    participantCount: 75,
    speakerCount: 3,
    hosts: [
      { id: "user-10", name: "Diana Wu", avatarUrl: "" },
    ],
    isLive: true,
  },
  {
    id: "room-8",
    title: "Crypto Market Analysis",
    topic: "Finance",
    participantCount: 201,
    speakerCount: 4,
    hosts: [
      { id: "user-11", name: "Robert Kim", avatarUrl: "" },
    ],
    isLive: true,
  },
];

const categories = [
  "All", "Technology", "Business", "Wellness", "Music", 
  "Arts", "Sports", "Gaming", "Education", "Social"
];

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("trending");

  // Filter rooms based on search query and category
  const filteredRooms = allRooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.topic.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || room.topic === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Filter rooms based on active tab
  const displayedRooms = activeTab === "trending" 
    ? filteredRooms.sort((a, b) => b.participantCount - a.participantCount)
    : activeTab === "newest" 
      ? [...filteredRooms].sort(() => Math.random() - 0.5) // Simulating newest rooms
      : filteredRooms;
  
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gradient">Explore Rooms</h1>
        
        {/* Search and filters */}
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search rooms by title or topic..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((category) => (
                <Button 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={selectedCategory === category ? "bg-voice-primary hover:bg-voice-primary/90" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </Card>
        
        {/* Room listing */}
        <Tabs 
          defaultValue="trending" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="newest" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Newest</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {displayedRooms.length > 0 ? (
                displayedRooms.map((room) => (
                  <RoomCard key={room.id} {...room} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No rooms found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="newest" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {displayedRooms.length > 0 ? (
                displayedRooms.map((room) => (
                  <RoomCard key={room.id} {...room} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No rooms found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ExplorePage;
