import { io, Socket } from 'socket.io-client';
import { MenuImage } from './api';

// Socket configuration
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://cafes-20-main-6.onrender.com';

// Log Socket.IO configuration (development only)
if (import.meta.env.DEV) {
  console.log('🔌 Socket.IO Configuration:');
  console.log('   URL:', SOCKET_URL);
  console.log('   Mode:', import.meta.env.MODE);
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
      withCredentials: true, // Important for CORS with credentials
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
    });
  }

  // Join admin room for real-time updates
  joinAdmin(): void {
    if (this.socket?.connected) {
      this.socket.emit('joinAdmin');
    }
  }

  // Join user room for real-time updates
  joinUser(): void {
    if (this.socket?.connected) {
      this.socket.emit('joinUser');
    }
  }

  // Listen for menu updates
  onMenuUpdate(callback: (data: MenuUpdateEvent) => void): void {
    if (this.socket) {
      this.socket.on('menuUpdate', callback);
    }
  }

  // Remove menu update listener
  offMenuUpdate(callback?: (data: MenuUpdateEvent) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('menuUpdate', callback);
      } else {
        this.socket.off('menuUpdate');
      }
    }
  }

  // Listen for settings updates
  onSettingsUpdate(callback: (data: SettingsUpdateEvent) => void): void {
    if (this.socket) {
      this.socket.on('settingsUpdate', callback);
    }
  }

  // Remove settings update listener
  offSettingsUpdate(callback?: (data: SettingsUpdateEvent) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('settingsUpdate', callback);
      } else {
        this.socket.off('settingsUpdate');
      }
    }
  }

  // Disconnect socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Menu update event types
export interface MenuUpdateEvent {
  event: 'imagesAdded' | 'imageDeleted' | 'imageUpdated';
  data: MenuImage[] | MenuImage | { id: string };
  timestamp: string;
}

export interface SettingsUpdateEvent {
  data: any;
  timestamp: string;
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;