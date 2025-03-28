
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock, Mic, Users } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const topics = [
  "Technology", "Business", "Wellness", "Music", "Arts", 
  "Sports", "Gaming", "Education", "Social", "Politics",
  "Science", "Travel", "Food", "Fashion", "Movies",
  "Books & Literature", "Languages", "Finance", "Health",
];

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    description: "",
    isScheduled: false,
    scheduledDate: "",
    scheduledTime: "",
    isPrivate: false,
    recordSession: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateRoom = () => {
    // Validate form
    if (!formData.title || !formData.topic) {
      toast.error("Please provide a title and topic for your room");
      return;
    }

    // Show loading state
    setIsLoading(true);

    // In a real app, we would make an API call to create the room
    setTimeout(() => {
      setIsLoading(false);
      // Simulate success
      toast.success("Room created successfully!");
      // Navigate to the new room (would use the actual room ID from API response)
      navigate("/room/new-room");
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gradient">Create a Room</h1>
        
        <Card className="glass-card p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Room Title</Label>
              <Input 
                id="title"
                placeholder="Give your room a catchy title..."
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="bg-muted/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Select
                value={formData.topic}
                onValueChange={(value) => handleChange("topic", value)}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="What will you talk about in this room?"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="bg-muted/50 min-h-32"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="schedule">Schedule for later</Label>
                  <p className="text-sm text-muted-foreground">
                    Create a room that will start at a specific time
                  </p>
                </div>
                <Switch 
                  id="schedule"
                  checked={formData.isScheduled}
                  onCheckedChange={(checked) => handleChange("isScheduled", checked)}
                />
              </div>
              
              {formData.isScheduled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2" htmlFor="date">
                      <CalendarIcon className="h-4 w-4" />
                      Date
                    </Label>
                    <Input 
                      id="date"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => handleChange("scheduledDate", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2" htmlFor="time">
                      <Clock className="h-4 w-4" />
                      Time
                    </Label>
                    <Input 
                      id="time"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => handleChange("scheduledTime", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="private">Private Room</Label>
                <p className="text-sm text-muted-foreground">
                  Only people with the link can join
                </p>
              </div>
              <Switch 
                id="private"
                checked={formData.isPrivate}
                onCheckedChange={(checked) => handleChange("isPrivate", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="record">Record Session</Label>
                <p className="text-sm text-muted-foreground">
                  Save this session for listeners to replay later
                </p>
              </div>
              <Switch 
                id="record"
                checked={formData.recordSession}
                onCheckedChange={(checked) => handleChange("recordSession", checked)}
              />
            </div>
            
            <div className="pt-4 flex gap-4">
              <Button
                className={cn(
                  "flex-1 bg-voice-primary hover:bg-voice-primary/90 gap-2",
                  formData.isScheduled ? "bg-voice-accent hover:bg-voice-accent/90" : ""
                )}
                disabled={isLoading}
                onClick={handleCreateRoom}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {formData.isScheduled ? (
                      <>
                        <CalendarIcon className="h-5 w-5" />
                        Schedule Room
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5" />
                        Start Room Now
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Room Preview */}
        {(formData.title || formData.topic || formData.description) && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Room Preview</h2>
            <Card className="glass-card p-6 border border-white/10">
              <div className="space-y-3">
                <h3 className="text-xl font-bold">{formData.title || "Untitled Room"}</h3>
                {formData.topic && <p className="text-sm text-muted-foreground">{formData.topic}</p>}
                {formData.description && <p className="text-foreground/80">{formData.description}</p>}
                
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">0 participants</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">1 speaker</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CreateRoomPage;
