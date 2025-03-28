import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import RoomList from "@/components/rooms/RoomList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, Mic, TrendingUp, Sparkles, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const featuredTopics = [
  { name: "Technology", category: "tech" },
  { name: "Music", category: "entertainment" },
  { name: "Business", category: "business" },
  { name: "Art", category: "creative" },
  { name: "Gaming", category: "entertainment" },
  { name: "Sports", category: "lifestyle" },
  { name: "Health", category: "lifestyle" },
  { name: "Education", category: "education" },
  { name: "Politics", category: "news" },
  { name: "Entertainment", category: "entertainment" }
];

const stats = [
  { label: "Active Rooms", value: 42, icon: Mic, color: "text-voice-primary" },
  { label: "Live Participants", value: 1247, icon: Users, color: "text-voice-accent" },
  { label: "Ongoing Discussions", value: 87, icon: TrendingUp, color: "text-green-400" },
];

const upcomingEvents = [
  {
    id: "event-1",
    title: "Tech Talk: AI Revolution",
    date: "Tomorrow, 7:00 PM",
    attendees: 348,
    host: "Sarah Johnson"
  },
  {
    id: "event-2",
    title: "Music Production Masterclass",
    date: "Sat, 3:30 PM",
    attendees: 215,
    host: "DJ Maxwell"
  },
  {
    id: "event-3",
    title: "Startup Funding Strategies",
    date: "Sun, 10:00 AM",
    attendees: 124,
    host: "Mark Ventures"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("trending");
  const [animatedStats, setAnimatedStats] = useState(stats.map(stat => ({ ...stat, value: 0 })));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats(current => {
        const allComplete = current.every((stat, index) => stat.value >= stats[index].value);
        
        if (allComplete) {
          clearInterval(interval);
          return current;
        }
        
        return current.map((stat, index) => {
          const targetValue = stats[index].value;
          const increment = Math.ceil(targetValue / 30);
          const newValue = Math.min(stat.value + increment, targetValue);
          return { ...stat, value: newValue };
        });
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? "all" : category);
  };

  const filteredTopics = selectedCategory === "all" 
    ? featuredTopics 
    : featuredTopics.filter(topic => topic.category === selectedCategory);

  return (
    <AppLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-2xl glass-card p-8 mb-8 animated-bg">
          <div className="hero-glow" />
          <div className="animated-dots" />
          <div className="relative z-10">
            <motion.h1 
              className="text-5xl font-bold tracking-tight mb-3 text-gradient"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Join the Conversation
            </motion.h1>
            <motion.p 
              className="text-lg text-foreground/80 max-w-2xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover live voice rooms on topics you care about. Connect with speakers,
              share ideas, and join the discussion in real-time.
            </motion.p>
            
            <motion.div 
              className="flex gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                size="lg" 
                className="bg-voice-primary hover:bg-voice-primary/90 btn-shine"
                onClick={() => navigate("/explore")}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Explore Rooms
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-voice-primary/30 hover:bg-voice-primary/10 btn-shine"
                onClick={() => navigate("/create-room")}
              >
                <Mic className="mr-2 h-5 w-5" />
                Create a Room
              </Button>
            </motion.div>
            
            <div className="mt-8">
              <div className="flex items-center mb-3">
                <h3 className="text-sm font-medium text-foreground/70">Browse Topics:</h3>
                <div className="ml-auto flex gap-2">
                  {["tech", "entertainment", "business", "lifestyle", "education"].map((category) => (
                    <Button 
                      key={category}
                      variant="ghost" 
                      size="sm" 
                      className={`text-xs px-2 py-1 h-auto ${selectedCategory === category ? 'bg-voice-primary/20 text-white' : 'text-foreground/60'}`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {filteredTopics.map((topic, i) => (
                  <motion.span 
                    key={i} 
                    className="bg-voice-primary/20 px-3 py-1 rounded-full text-sm hover:bg-voice-primary/30 cursor-pointer transition-colors duration-200 border border-voice-primary/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    {topic.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute -right-10 -bottom-10 h-48 w-48 opacity-20 flex items-center justify-center">
            <Headphones className="w-full h-full text-voice-accent/40" />
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {animatedStats.map((stat, index) => (
            <Card key={index} className="glass-card p-5 text-center card-scale overflow-hidden animated-bg">
              <div className="animated-dots" />
              <div className="flex flex-col items-center justify-center">
                <div className={`rounded-full p-3 mb-3 ${stat.color} bg-white/5`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-gradient">{stat.value.toLocaleString()}</p>
              </div>
            </Card>
          ))}
        </section>
        
        <section className="glass-card overflow-hidden rounded-xl border border-white/10">
          <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex rounded-none border-b border-white/10 bg-card/60 p-0">
              <TabsTrigger 
                value="trending" 
                className="flex-1 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none border-r border-white/10"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Trending Rooms
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming" 
                className="flex-1 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Upcoming Events
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="p-6 animate-fade-in">
              <RoomList />
            </TabsContent>
            
            <TabsContent value="upcoming" className="p-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gradient">Scheduled Events</h3>
                  <Button variant="ghost" size="sm" className="text-voice-accent hover:text-voice-accent/80">
                    View All
                  </Button>
                </div>
                
                {upcomingEvents.map((event, index) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glass-card p-4 hover:border-voice-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <div className="bg-voice-primary/20 rounded-lg p-3 mr-4">
                        <Calendar className="h-6 w-6 text-voice-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                          <p className="text-sm">
                            <span className="text-voice-accent">{event.attendees}</span> attending
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className="ml-4 bg-voice-primary hover:bg-voice-primary/90">
                        Remind me
                      </Button>
                    </div>
                  </motion.div>
                ))}
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline" className="w-full border-voice-primary/20 hover:bg-voice-primary/10">
                    View All Events
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;
