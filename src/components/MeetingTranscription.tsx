import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Download, Brain, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TranscriptionSegment {
  timestamp: string;
  speaker: string;
  text: string;
}

export function MeetingTranscription() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionSegment[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      mediaRecorder.current.start();
      
      toast({
        title: "Recording Started",
        description: "NeuroTracker is capturing your meeting audio",
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }

      // Simulate AI transcription processing
      setTimeout(() => {
        const mockTranscription: TranscriptionSegment[] = [
          {
            timestamp: "00:01",
            speaker: "Speaker 1",
            text: "Let's start today's meeting. We need to discuss the project timeline and deliverables."
          },
          {
            timestamp: "00:15",
            speaker: "Speaker 2", 
            text: "I'll need to complete the design mockups by Friday. Should we schedule a review session?"
          },
          {
            timestamp: "00:32",
            speaker: "Speaker 1",
            text: "Yes, let's set up a review for Monday. Also, we need to update the client on our progress."
          }
        ];
        
        setTranscription(mockTranscription);
        setIsProcessing(false);
        
        toast({
          title: "Transcription Complete! 🎙️",
          description: "Meeting has been transcribed and analyzed",
        });
      }, 3000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const exportTranscription = () => {
    const content = transcription.map(segment => 
      `[${segment.timestamp}] ${segment.speaker}: ${segment.text}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-transcription-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Transcription saved to your downloads",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Meeting Transcription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Record and transcribe meetings with AI-powered analysis
              </p>
              {isRecording && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-destructive rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-destructive">
                    Recording: {formatTime(recordingTime)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isRecording ? (
                <Button onClick={startRecording} variant="hero" disabled={isProcessing}>
                  <Mic className="h-4 w-4" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="destructive">
                  <Square className="h-4 w-4" />
                  Stop Recording
                </Button>
              )}
            </div>
          </div>
          
          {isProcessing && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  AI is processing your meeting...
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {transcription.length > 0 && (
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Transcription Results
              </CardTitle>
              <Button onClick={exportTranscription} variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transcription.map((segment, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {segment.timestamp}
                    </Badge>
                    <span className="text-sm font-medium text-primary">
                      {segment.speaker}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {segment.text}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}