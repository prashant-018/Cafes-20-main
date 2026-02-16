import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";
import socketService from "@/services/socket";

/**
 * Debug component to verify real-time settings synchronization
 * Add this to any page to test: <SettingsDebug />
 */
export function SettingsDebug() {
  const { settings, loading, refresh } = useSettings();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const socket = socketService.connect();

    const checkConnection = () => {
      setIsConnected(socketService.isConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    socketService.onSettingsUpdate((event) => {
      setLastUpdate(new Date(event.timestamp).toLocaleTimeString());
    });

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 bg-card/95 backdrop-blur-sm border-white/10 shadow-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span>Settings Sync Active</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span>Disconnected</span>
              </>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {lastUpdate && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Last Update:</span>
              <span className="text-white">{lastUpdate}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Loading:</span>
            <Badge variant={loading ? "secondary" : "outline"} className="text-xs">
              {loading ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        <div className="border-t border-white/10 pt-3 space-y-2">
          <div className="font-medium text-white">Current Settings:</div>

          <div className="space-y-1 pl-2 border-l-2 border-primary/30">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="text-white font-mono text-xs">
                {settings?.whatsappNumber || "N/A"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Hours:</span>
              <span className="text-white font-mono text-xs">
                {settings?.openingTime || "N/A"} - {settings?.closingTime || "N/A"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={settings?.isManuallyOpen ? "default" : "secondary"}
                className="text-xs"
              >
                {settings?.isManuallyOpen ? "Open" : "Closed"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t border-white/10">
          💡 Update settings in Admin Dashboard to see real-time sync
        </div>
      </CardContent>
    </Card>
  );
}
