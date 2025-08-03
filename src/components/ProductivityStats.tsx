import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, CheckCircle, Brain, Calendar, Trophy } from "lucide-react";

interface StatsData {
  tasksCompleted: number;
  totalTasks: number;
  weeklyProgress: number;
  streakDays: number;
  focusScore: number;
  weeklyData: { day: string; completed: number; total: number }[];
}

interface ProductivityStatsProps {
  stats: StatsData;
}

export function ProductivityStats({ stats }: ProductivityStatsProps) {
  const completionRate = stats.totalTasks > 0 ? (stats.tasksCompleted / stats.totalTasks) * 100 : 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-success">
                {stats.tasksCompleted}
              </div>
              <p className="text-xs text-muted-foreground">
                of {stats.totalTasks} total tasks
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">
                {completionRate.toFixed(0)}%
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-accent">
                {stats.streakDays}
              </div>
              <p className="text-xs text-muted-foreground">
                consecutive days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-secondary" />
              Focus Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className={`text-2xl font-bold ${getScoreColor(stats.focusScore)}`}>
                {stats.focusScore}
              </div>
              <Badge variant="outline" className="text-xs">
                {stats.focusScore >= 80 ? "Excellent" : stats.focusScore >= 60 ? "Good" : "Needs Focus"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Week Overview</span>
              <Badge variant="secondary">
                {stats.weeklyProgress}% complete
              </Badge>
            </div>
            
            <div className="space-y-3">
              {stats.weeklyData.map((day, index) => {
                const dayProgress = day.total > 0 ? (day.completed / day.total) * 100 : 0;
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-muted-foreground">
                        {day.completed}/{day.total}
                      </span>
                    </div>
                    <Progress value={dayProgress} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {stats.streakDays >= 7 && (
        <Card className="bg-gradient-secondary border-border shadow-elegant">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Trophy className="h-12 w-12 text-accent mx-auto animate-float" />
              <h3 className="text-lg font-semibold">Achievement Unlocked!</h3>
              <p className="text-sm text-muted-foreground">
                7+ day productivity streak! You're on fire! 🔥
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}