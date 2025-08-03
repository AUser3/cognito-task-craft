import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { NotionConnect } from "@/components/NotionConnect";
import { TaskList } from "@/components/TaskList";
import { MeetingTranscription } from "@/components/MeetingTranscription";
import { ProductivityStats } from "@/components/ProductivityStats";
import { NotionReader } from "@/components/NotionReader";
import { Brain, Zap, Settings, BarChart3, Mic, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-brain.jpg";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  completed: boolean;
  dueDate?: string;
}

const Index = () => {
  const [notionToken, setNotionToken] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const mockStats = {
    tasksCompleted: 12,
    totalTasks: 18,
    weeklyProgress: 67,
    streakDays: 8,
    focusScore: 85,
    weeklyData: [
      { day: "Monday", completed: 3, total: 4 },
      { day: "Tuesday", completed: 2, total: 3 },
      { day: "Wednesday", completed: 4, total: 4 },
      { day: "Thursday", completed: 1, total: 2 },
      { day: "Friday", completed: 2, total: 5 },
      { day: "Saturday", completed: 0, total: 0 },
      { day: "Sunday", completed: 0, total: 0 }
    ]
  };

  const handleNotionConnect = (token: string) => {
    setNotionToken(token);
    localStorage.setItem("neurotracker_notion_token", token);
  };

  const handleTasksExtracted = (extractedTasks: Task[]) => {
    setTasks(extractedTasks);
    setActiveTab("tasks");
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const isConnected = !!notionToken;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          
          <div className="relative container mx-auto px-4 py-20">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Brain className="h-8 w-8 text-primary animate-pulse-glow" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">
                    AI-Powered Productivity
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                  NeuroTracker
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Your intelligent productivity assistant that transforms meeting notes and documents 
                  into actionable tasks using advanced AI
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Badge variant="secondary" className="px-4 py-2">
                  <Zap className="h-4 w-4 mr-2" />
                  AI Task Generation
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <Mic className="h-4 w-4 mr-2" />
                  Meeting Transcription
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Notion Integration
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Productivity Analytics
                </Badge>
              </div>

              <div className="pt-8">
                <NotionConnect 
                  onConnect={handleNotionConnect}
                  isConnected={isConnected}
                />
              </div>

              <div className="text-xs text-muted-foreground mt-8">
                🔒 All data stored locally for maximum privacy
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary animate-pulse-glow" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  NeuroTracker
                </h1>
                <p className="text-xs text-muted-foreground">AI Productivity Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <NotionConnect 
                onConnect={handleNotionConnect}
                isConnected={isConnected}
              />
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="meetings" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Meetings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gradient-card border-border shadow-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Read Notes</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Extract actionable tasks from your Notion notes using AI
                    </p>
                    <NotionReader onTasksExtracted={handleTasksExtracted} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border shadow-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Current Tasks</h3>
                      <Badge variant="secondary" className="ml-auto">
                        {tasks.filter(t => !t.completed).length} active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your AI-generated task list from recent notes
                    </p>
                    <TaskList tasks={tasks.slice(0, 3)} onTaskComplete={handleTaskComplete} />
                    {tasks.length > 3 && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveTab("tasks")}
                      >
                        View All Tasks ({tasks.length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <TaskList tasks={tasks} onTaskComplete={handleTaskComplete} />
          </TabsContent>

          <TabsContent value="meetings">
            <MeetingTranscription />
          </TabsContent>

          <TabsContent value="analytics">
            <ProductivityStats stats={mockStats} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;