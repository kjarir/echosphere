
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Clock, Users, Tag, CalendarPlus, Filter } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, eachDayOfInterval } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { 
  Checkbox
} from "@/components/ui/checkbox";
import { toast } from "sonner";

// Mock data for upcoming events
const events = [
  {
    id: "event-1",
    title: "Tech Talk: AI Revolution",
    description: "Join us for an in-depth discussion on how AI is transforming industries and what the future holds.",
    date: addDays(new Date(), 1).toISOString(),
    time: "19:00",
    duration: "1 hour",
    host: "Sarah Johnson",
    attendees: 348,
    category: "Technology",
    tags: ["AI", "Tech", "Future"]
  },
  {
    id: "event-2",
    title: "Music Production Masterclass",
    description: "Learn the ins and outs of music production from industry veterans.",
    date: addDays(new Date(), 3).toISOString(),
    time: "15:30",
    duration: "2 hours",
    host: "DJ Maxwell",
    attendees: 215,
    category: "Music",
    tags: ["Production", "Music", "Creative"]
  },
  {
    id: "event-3",
    title: "Startup Funding Strategies",
    description: "Experts share their insights on securing funding for your startup venture.",
    date: addDays(new Date(), 4).toISOString(),
    time: "10:00",
    duration: "1.5 hours",
    host: "Mark Ventures",
    attendees: 124,
    category: "Business",
    tags: ["Startup", "Funding", "Venture Capital"]
  },
  {
    id: "event-4",
    title: "Digital Art Workshop",
    description: "A hands-on workshop exploring digital art techniques and tools.",
    date: addDays(new Date(), 5).toISOString(),
    time: "14:00",
    duration: "3 hours",
    host: "Elena Creative",
    attendees: 89,
    category: "Art",
    tags: ["Digital", "Art", "Workshop"]
  },
  {
    id: "event-5",
    title: "Gaming Industry Insights",
    description: "Discussion on the latest trends and future of the gaming industry.",
    date: addDays(new Date(), 7).toISOString(),
    time: "20:00",
    duration: "1 hour",
    host: "GameDev Pro",
    attendees: 276,
    category: "Gaming",
    tags: ["Games", "Industry", "Development"]
  },
  {
    id: "event-6",
    title: "Fitness Nutrition Q&A",
    description: "Ask professional trainers and nutritionists your fitness and diet questions.",
    date: addDays(new Date(), 2).toISOString(),
    time: "18:00",
    duration: "1 hour",
    host: "FitLife Coach",
    attendees: 137,
    category: "Health",
    tags: ["Fitness", "Nutrition", "Wellness"]
  },
  {
    id: "event-7",
    title: "Cryptocurrency Explained",
    description: "Demystifying cryptocurrency and blockchain technology for beginners.",
    date: addDays(new Date(), 10).toISOString(),
    time: "17:00",
    duration: "1.5 hours",
    host: "Crypto Expert",
    attendees: 312,
    category: "Finance",
    tags: ["Crypto", "Blockchain", "Finance"]
  }
];

// Categories for filtering
const categories = [
  "Technology", "Music", "Business", "Art", "Gaming", "Health", "Finance", "Education", "Entertainment"
];

const EventsPage = () => {
  const [currentView, setCurrentView] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentDateRange, setCurrentDateRange] = useState({
    start: startOfWeek(new Date()),
    end: addWeeks(startOfWeek(new Date()), 1)
  });
  
  // Filter events based on view, search and categories
  const filteredEvents = events.filter(event => {
    // Filter by view (all, today, this week)
    const eventDate = new Date(event.date);
    if (currentView === "today" && !isSameDay(eventDate, new Date())) {
      return false;
    }
    if (currentView === "thisWeek" && !isThisWeek(eventDate)) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.host.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0 && !selectedCategories.includes(event.category)) {
      return false;
    }
    
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Helper functions for date comparisons
  function isSameDay(date1: Date, date2: Date) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }
  
  function isThisWeek(date: Date) {
    const today = new Date();
    const startOfWeekDate = startOfWeek(today);
    const endOfWeekDate = addDays(startOfWeekDate, 6);
    
    return date >= startOfWeekDate && date <= endOfWeekDate;
  }
  
  // Handler for category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  // Generate array of dates for the calendar view
  const calendarDays = eachDayOfInterval({
    start: currentDateRange.start,
    end: addDays(currentDateRange.start, 13) // Show 2 weeks
  });
  
  // Handler for event reminders
  const handleRemindMe = (eventId: string, eventTitle: string) => {
    toast.success(`Reminder set for "${eventTitle}"`);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gradient">Upcoming Events</h1>
            <p className="text-muted-foreground">Discover and join scheduled voice rooms and events</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-voice-primary/30 hover:bg-voice-primary/10"
              onClick={() => toast.info("Calendar export feature coming soon!")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="bg-voice-primary hover:bg-voice-primary/90" onClick={() => toast.info("Create event feature coming soon!")}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with filters */}
          <div className="md:w-72">
            <Card className="glass-card sticky top-6">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Refine event results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input 
                    placeholder="Search events..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-muted/50"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Categories</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category}`} 
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label 
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSelectedCategories([]);
                      setSearchQuery("");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue="all" value={currentView} onValueChange={setCurrentView} className="w-full mb-6">
              <TabsList className="bg-muted/50 border border-white/10">
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="thisWeek">This Week</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {currentView === "calendar" ? (
              <div className="space-y-6">
                <div className="glass-card p-4 rounded-lg">
                  <div className="grid grid-cols-7 gap-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-sm font-medium py-2">
                        {day}
                      </div>
                    ))}
                    
                    {calendarDays.map((day) => {
                      const dayEvents = events.filter(event => {
                        const eventDate = new Date(event.date);
                        return isSameDay(eventDate, day);
                      });
                      
                      return (
                        <div 
                          key={day.toISOString()} 
                          className={`h-24 border border-white/10 rounded p-1 ${
                            isSameDay(day, new Date()) 
                              ? "bg-voice-primary/20 border-voice-primary/30" 
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div className="text-right text-sm mb-1">
                            {format(day, "d")}
                          </div>
                          
                          <div className="overflow-hidden space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div 
                                key={event.id} 
                                className="text-xs p-1 rounded bg-voice-primary/30 truncate cursor-pointer"
                                onClick={() => handleRemindMe(event.id, event.title)}
                              >
                                {event.time} {event.title}
                              </div>
                            ))}
                            
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-center text-voice-accent">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4">Upcoming in View</h3>
                  <div className="space-y-4">
                    {events
                      .filter(event => {
                        const eventDate = new Date(event.date);
                        return eventDate >= currentDateRange.start && 
                               eventDate <= addDays(currentDateRange.start, 13);
                      })
                      .slice(0, 3)
                      .map(event => (
                        <EventCard 
                          key={event.id} 
                          event={event} 
                          onRemind={handleRemindMe} 
                        />
                      ))
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <Card className="glass-card p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No events found</h3>
                      <p className="text-muted-foreground mb-4">
                        {selectedCategories.length > 0 || searchQuery
                          ? "Try adjusting your filters or search query"
                          : "There are no upcoming events in this time period"}
                      </p>
                      {(selectedCategories.length > 0 || searchQuery) && (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedCategories([]);
                            setSearchQuery("");
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </Card>
                ) : (
                  filteredEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onRemind={handleRemindMe} 
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Component for individual event cards
const EventCard = ({ 
  event, 
  onRemind 
}: { 
  event: any; 
  onRemind: (id: string, title: string) => void 
}) => {
  const eventDate = new Date(event.date);
  const isToday = isSameDay(eventDate, new Date());
  const isTomorrow = isSameDay(eventDate, addDays(new Date(), 1));
  
  // Format date display 
  const getDateDisplay = () => {
    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    return format(eventDate, "EEE, MMM d");
  };
  
  // Check if an event is happening soon (within 6 hours)
  const isSoon = isToday && 
    new Date().getHours() <= parseInt(event.time.split(':')[0]) &&
    parseInt(event.time.split(':')[0]) - new Date().getHours() <= 6;
  
  return (
    <Card className="glass-card overflow-hidden card-scale">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-40 lg:w-48 bg-voice-primary/10 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
          <Calendar className="h-8 w-8 text-voice-primary mb-2" />
          <div className="text-center">
            <p className="text-sm font-medium">{getDateDisplay()}</p>
            <p className="text-2xl font-bold">{event.time}</p>
            <p className="text-xs text-muted-foreground">{event.duration}</p>
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                {isSoon && (
                  <Badge className="bg-voice-accent text-white">Starting Soon</Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{event.attendees} attending</span>
                </div>
                <div className="flex items-center text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  <span>{event.category}</span>
                </div>
                <div className="flex items-center text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{event.duration}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {event.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="bg-muted/30 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col gap-2 justify-end">
              <Button 
                variant="default" 
                className="bg-voice-primary hover:bg-voice-primary/90"
                onClick={() => onRemind(event.id, event.title)}
              >
                Remind me
              </Button>
              <Button variant="outline" className="border-white/10">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Helper function for same day comparisons
function isSameDay(date1: Date, date2: Date) {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

export default EventsPage;
