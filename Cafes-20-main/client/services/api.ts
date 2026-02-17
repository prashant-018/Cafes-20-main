// Ensure API_BASE_URL always ends with /api and doesn't have double slashes
const normalizeApiUrl = (url: string): string => {
  // Remove trailing slash
  let normalized = url.replace(/\/$/, '');

  // Ensure it ends with /api
  if (!normalized.endsWith('/api')) {
    normalized = `${normalized}/api`;
  }

  return normalized;
};

const API_BASE_URL = normalizeApiUrl(
  import.meta.env.VITE_API_URL || 'https://cafes-20-main-6.onrender.com'
);

// Log API configuration (development only)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:');
  console.log('   VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('   Base URL:', API_BASE_URL);
  console.log('   Mode:', import.meta.env.MODE);
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
  admin?: any;
  errors?: any[];
}

export interface SettingsDto {
  id: string;
  whatsappNumber: string;
  openingTime: string;
  closingTime: string;
  isManuallyOpen: boolean;
  brandStory: string;
  offersText: string;
  createdAt: string;
  updatedAt: string;
}

// Shape of a menu image as returned by the backend API
export interface MenuImage {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Get token from localStorage
   * Checks both adminToken and userToken
   */
  private getToken(): string | null {
    return localStorage.getItem('adminToken') || localStorage.getItem('userToken');
  }

  /**
   * Handle token expiration - auto logout
   */
  private handleTokenExpiration(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('user');

    // Redirect to login page (admin vs user)
    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/login';
    } else {
      window.location.href = '/';
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      ...options.headers,
    };

    // Automatically add Authorization header if token exists
    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    // Only set JSON content type when we're not sending FormData
    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)['Content-Type'] =
        (headers as Record<string, string>)['Content-Type'] ?? 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Important for CORS with credentials
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        console.warn('Authentication failed:', data.message);

        // Check if it's a token expiration issue
        if (data.message?.includes('expired') || data.message?.includes('Invalid token')) {
          this.handleTokenExpiration();
        }

        throw new Error(data.message || 'Authentication failed');
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async adminLogin(email: string, password: string) {
    const response = await this.request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('adminToken', response.token);
      if (response.admin) {
        localStorage.setItem('admin', JSON.stringify(response.admin));
      }
    }

    return response;
  }

  async userLogin(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('userToken', response.token);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    }

    return response;
  }

  async register(name: string, email: string, password: string, role?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async getProfile() {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  /**
   * Logout - clear tokens and redirect
   */
  logout(isAdmin: boolean = false): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('user');

    if (isAdmin) {
      window.location.href = '/admin/login';
    } else {
      window.location.href = '/login';
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Simple health check endpoint (for debugging).
   * Expects a route like GET /api/health on the server.
   */
  async healthCheck() {
    return this.request<{ message: string; success?: boolean }>('/health', {
      method: 'GET',
    });
  }

  // Menu image endpoints

  /**
   * Get active menu images for public site.
   */
  async getMenuImages() {
    return this.request<MenuImage[]>('/menu-simple', {
      method: 'GET',
    });
  }

  /**
   * Get all menu images for admin (includes inactive ones).
   * Requires authentication.
   */
  async getAllMenuImages(params?: { page?: number; limit?: number }) {
    return this.request<MenuImage[]>('/menu-simple', {
      method: 'GET',
    });
  }

  /**
   * Upload one or more menu images (admin).
   * Requires authentication.
   */
  async uploadMenuImages(files: FileList) {
    console.log('📤 Uploading menu images:', files.length);

    const formData = new FormData();
    Array.from(files).forEach((file, index) => {
      console.log(`📁 Adding file ${index + 1}:`, {
        name: file.name,
        type: file.type,
        size: file.size
      });
      formData.append('menuImages', file);
    });

    console.log('🚀 Sending upload request to:', `${this.baseURL}/menu-simple/upload`);

    try {
      const response = await this.request<MenuImage[]>('/menu-simple/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('✅ Upload response:', response);
      return response;
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  }

  /**
   * Delete a menu image by id (admin).
   * Requires authentication.
   */
  async deleteMenuImage(id: string) {
    return this.request<{ id: string }>(`/menu-simple/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Update menu image metadata (admin).
   * Requires authentication.
   */
  async updateMenuImage(
    id: string,
    data: { name?: string; isActive?: boolean }
  ) {
    return this.request<MenuImage>(`/menu-simple/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();

// Alias specifically for menu-related calls used in hooks
export const menuAPI = apiService;

// Alias for health-related tests/debug components
export const healthAPI = {
  check: () => apiService.healthCheck(),
};

// Settings API helpers (used by Admin Business Settings)
export const settingsAPI = {
  get: () => apiService.request<SettingsDto | null>('/settings', { method: 'GET' }),
  update: (payload: {
    whatsappNumber: string;
    openingTime: string;
    closingTime: string;
    isManuallyOpen: boolean;
    brandStory: string;
    offersText: string;
  }) => {
    return apiService.request<SettingsDto>('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};

export default apiService;