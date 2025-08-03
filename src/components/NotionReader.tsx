import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Loader2, FileText, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NotionPage {
  id: string;
  title: string;
  content: string;
  lastModified: string;
  extractedTasks: number;
}

interface NotionReaderProps {
  onTasksExtracted: (tasks: any[]) => void;
}

export function NotionReader({ onTasksExtracted }: NotionReaderProps) {
  const [isReading, setIsReading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());

  const readNotionNotes = async () => {
    setIsReading(true);
    
    // Simulate fetching from Notion API
    setTimeout(() => {
      const mockPages: NotionPage[] = [
        {
          id: "1",
          title: "Project Kickoff Meeting Notes",
          content: "Discussed timeline for Q1 delivery. Need to finalize mockups by Friday and schedule client review...",
          lastModified: "2024-01-10",
          extractedTasks: 3
        },
        {
          id: "2", 
          title: "Weekly Sprint Planning",
          content: "Backend API development priorities. Fix authentication bug, implement user dashboard, update documentation...",
          lastModified: "2024-01-09",
          extractedTasks: 4
        },
        {
          id: "3",
          title: "Client Feedback Summary", 
          content: "Client wants UI improvements: better navigation, mobile responsiveness, and faster loading times...",
          lastModified: "2024-01-08",
          extractedTasks: 5
        }
      ];
      
      setPages(mockPages);
      setIsReading(false);
      
      toast({
        title: "Notion Notes Retrieved! 📚",
        description: `Found ${mockPages.length} pages with actionable content`,
      });
    }, 2000);
  };

  const extractTasks = async () => {
    if (selectedPages.size === 0) {
      toast({
        title: "No pages selected",
        description: "Please select at least one page to extract tasks from",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI task extraction
    setTimeout(() => {
      const extractedTasks = [
        {
          id: "task-1",
          title: "Finalize design mockups",
          description: "Complete mockups for client review by Friday",
          priority: "high" as const,
          category: "Design",
          completed: false,
          dueDate: "Friday"
        },
        {
          id: "task-2", 
          title: "Schedule client review meeting",
          description: "Set up meeting with client to review project progress",
          priority: "medium" as const,
          category: "Meetings",
          completed: false,
          dueDate: "Next week"
        },
        {
          id: "task-3",
          title: "Fix authentication bug",
          description: "Resolve login issues reported in testing",
          priority: "high" as const,
          category: "Development",
          completed: false,
          dueDate: "ASAP"
        },
        {
          id: "task-4",
          title: "Implement user dashboard",
          description: "Build responsive dashboard with user analytics",
          priority: "medium" as const,
          category: "Development", 
          completed: false,
          dueDate: "Next sprint"
        },
        {
          id: "task-5",
          title: "Update project documentation",
          description: "Document new API endpoints and deployment process",
          priority: "low" as const,
          category: "Documentation",
          completed: false,
          dueDate: "End of month"
        }
      ];
      
      onTasksExtracted(extractedTasks);
      setIsProcessing(false);
      
      toast({
        title: "Tasks Extracted! 🤖",
        description: `Generated ${extractedTasks.length} actionable tasks from your notes`,
      });
    }, 3000);
  };

  const togglePageSelection = (pageId: string) => {
    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageId)) {
      newSelection.delete(pageId);
    } else {
      newSelection.add(pageId);
    }
    setSelectedPages(newSelection);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Notion Notes Reader
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Read your Notion workspace and extract actionable tasks using AI
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={readNotionNotes} 
              disabled={isReading}
              variant="hero"
            >
              {isReading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reading Notes...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Read Notion Notes
                </>
              )}
            </Button>
            
            {pages.length > 0 && (
              <Button 
                onClick={extractTasks}
                disabled={isProcessing || selectedPages.size === 0}
                variant="secondary"
              >
                {isProcessing ? (
                  <>
                    <Brain className="h-4 w-4 animate-spin" />
                    Extracting Tasks...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Extract Tasks ({selectedPages.size})
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {pages.length > 0 && (
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Retrieved Pages
              <Badge variant="secondary" className="ml-auto">
                {pages.length} found
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pages.map((page) => (
                <div 
                  key={page.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedPages.has(page.id) 
                      ? "border-primary bg-primary/5 shadow-glow" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => togglePageSelection(page.id)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{page.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {page.extractedTasks} potential tasks
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {page.lastModified}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {page.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {pages.length > 0 && (
              <div className="mt-4 text-xs text-muted-foreground">
                Click pages to select them for task extraction
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}