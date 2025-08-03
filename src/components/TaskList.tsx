import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, Brain, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  completed: boolean;
  dueDate?: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
}

export function TaskList({ tasks, onTaskComplete }: TaskListProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const handleTaskToggle = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
      toast({
        title: "Task Completed! 🎉",
        description: "Great job staying productive!",
      });
    }
    setCompletedTasks(newCompleted);
    onTaskComplete(taskId);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "medium":
        return <Clock className="h-4 w-4 text-primary" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-success" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-success/10 text-success border-success/20";
    }
  };

  if (tasks.length === 0) {
    return (
      <Card className="bg-gradient-card border-border shadow-card">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Brain className="h-16 w-16 text-muted-foreground animate-float" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No tasks yet</h3>
              <p className="text-muted-foreground">
                Connect to Notion and read your notes to extract AI-powered tasks
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">AI-Generated Tasks</h2>
        <Badge variant="secondary" className="ml-auto">
          {tasks.filter(t => !completedTasks.has(t.id)).length} pending
        </Badge>
      </div>
      
      {tasks.map((task) => (
        <Card 
          key={task.id} 
          className={`bg-gradient-card border-border shadow-card transition-all duration-300 hover:shadow-elegant ${
            completedTasks.has(task.id) ? "opacity-60 scale-98" : ""
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={completedTasks.has(task.id)}
                onCheckedChange={() => handleTaskToggle(task.id)}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${completedTasks.has(task.id) ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(task.priority)}
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <CardDescription className={completedTasks.has(task.id) ? "line-through" : ""}>
                  {task.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {task.category}
              </Badge>
              {task.dueDate && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Due {task.dueDate}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}