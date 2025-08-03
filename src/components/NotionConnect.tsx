import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Zap, Database, CheckCircle } from "lucide-react";

interface NotionConnectProps {
  onConnect: (token: string) => void;
  isConnected: boolean;
}

export function NotionConnect({ onConnect, isConnected }: NotionConnectProps) {
  const [token, setToken] = useState("");
  const [open, setOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!token.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Notion API token",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    // Simulate API validation
    setTimeout(() => {
      onConnect(token);
      setOpen(false);
      setIsConnecting(false);
      toast({
        title: "Connected to Notion!",
        description: "NeuroTracker is now synced with your workspace",
      });
    }, 1500);
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-success">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Connected to Notion</span>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="lg" className="animate-pulse-glow">
          <Database className="h-5 w-5" />
          Connect to Notion
          <Zap className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            Connect to Notion
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium text-muted-foreground">
              Notion API Token
            </label>
            <Input
              id="token"
              type="password"
              placeholder="secret_xxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Go to <span className="text-primary">notion.so/my-integrations</span></p>
            <p>• Create a new integration</p>
            <p>• Copy the Internal Integration Token</p>
          </div>
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="w-full"
            variant="hero"
          >
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}