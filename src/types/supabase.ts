
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          title: string
          developmentName: string | null
          description: string
          type: string
          price: number
          promotionalPrice: number | null
          area: number
          bedrooms: number
          bathrooms: number
          suites: number
          parkingSpaces: number
          address: string
          neighborhood: string
          city: string
          state: string
          zipCode: string
          latitude: number | null
          longitude: number | null
          constructionStage: string | null
          youtubeUrl: string | null
          createdAt: string
          updatedAt: string
          createdById: string
          isActive: boolean
          isHighlighted: boolean
          viewCount: number
          shareCount: number
        }
        Insert: {
          id?: string
          title: string
          developmentName?: string | null
          description: string
          type: string
          price: number
          promotionalPrice?: number | null
          area: number
          bedrooms: number
          bathrooms: number
          suites: number
          parkingSpaces: number
          address: string
          neighborhood: string
          city: string
          state: string
          zipCode: string
          latitude?: number | null
          longitude?: number | null
          constructionStage?: string | null
          youtubeUrl?: string | null
          createdAt?: string
          updatedAt?: string
          createdById: string
          isActive?: boolean
          isHighlighted?: boolean
          viewCount?: number
          shareCount?: number
        }
        Update: {
          id?: string
          title?: string
          developmentName?: string | null
          description?: string
          type?: string
          price?: number
          promotionalPrice?: number | null
          area?: number
          bedrooms?: number
          bathrooms?: number
          suites?: number
          parkingSpaces?: number
          address?: string
          neighborhood?: string
          city?: string
          state?: string
          zipCode?: string
          latitude?: number | null
          longitude?: number | null
          constructionStage?: string | null
          youtubeUrl?: string | null
          createdAt?: string
          updatedAt?: string
          createdById?: string
          isActive?: boolean
          isHighlighted?: boolean
          viewCount?: number
          shareCount?: number
        }
      }
      property_images: {
        Row: {
          id: string
          propertyId: string
          url: string
          description: string | null
          isMain: boolean
          order: number
        }
        Insert: {
          id?: string
          propertyId: string
          url: string
          description?: string | null
          isMain?: boolean
          order?: number
        }
        Update: {
          id?: string
          propertyId?: string
          url?: string
          description?: string | null
          isMain?: boolean
          order?: number
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          status: string
          notes: string | null
          source: string
          isManual: boolean
          createdAt: string
          updatedAt: string
          createdById: string
          assignedToId: string | null
          propertyId: string | null
          budget: number | null
          desiredLocation: string | null
          preferredBedrooms: number | null
          preferredBathrooms: number | null
          targetMoveDate: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          status: string
          notes?: string | null
          source: string
          isManual: boolean
          createdAt?: string
          updatedAt?: string
          createdById: string
          assignedToId?: string | null
          propertyId?: string | null
          budget?: number | null
          desiredLocation?: string | null
          preferredBedrooms?: number | null
          preferredBathrooms?: number | null
          targetMoveDate?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          status?: string
          notes?: string | null
          source?: string
          isManual?: boolean
          createdAt?: string
          updatedAt?: string
          createdById?: string
          assignedToId?: string | null
          propertyId?: string | null
          budget?: number | null
          desiredLocation?: string | null
          preferredBedrooms?: number | null
          preferredBathrooms?: number | null
          targetMoveDate?: string | null
        }
      }
      shares: {
        Row: {
          id: string
          brokerId: string
          propertyId: string
          code: string
          url: string
          createdAt: string
          expiresAt: string | null
          clicks: number
          lastClickedAt: string | null
          isActive: boolean
          notes: string | null
        }
        Insert: {
          id?: string
          brokerId: string
          propertyId: string
          code: string
          url: string
          createdAt?: string
          expiresAt?: string | null
          clicks?: number
          lastClickedAt?: string | null
          isActive?: boolean
          notes?: string | null
        }
        Update: {
          id?: string
          brokerId?: string
          propertyId?: string
          code?: string
          url?: string
          createdAt?: string
          expiresAt?: string | null
          clicks?: number
          lastClickedAt?: string | null
          isActive?: boolean
          notes?: string | null
        }
      }
      performance: {
        Row: {
          id: string
          brokerId: string
          month: number
          year: number
          shares: number
          leads: number
          schedules: number
          visits: number
          sales: number
        }
        Insert: {
          id?: string
          brokerId: string
          month: number
          year: number
          shares: number
          leads: number
          schedules: number
          visits: number
          sales: number
        }
        Update: {
          id?: string
          brokerId?: string
          month?: number
          year?: number
          shares?: number
          leads?: number
          schedules?: number
          visits?: number
          sales?: number
        }
      }
      targets: {
        Row: {
          id: string
          brokerId: string
          month: number
          year: number
          shareTarget: number
          leadTarget: number
          scheduleTarget: number
          visitTarget: number
          saleTarget: number
        }
        Insert: {
          id?: string
          brokerId: string
          month: number
          year: number
          shareTarget: number
          leadTarget: number
          scheduleTarget: number
          visitTarget: number
          saleTarget: number
        }
        Update: {
          id?: string
          brokerId?: string
          month?: number
          year?: number
          shareTarget?: number
          leadTarget?: number
          scheduleTarget?: number
          visitTarget?: number
          saleTarget?: number
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          features: Json
          isActive: boolean
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          features: Json
          isActive?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          features?: Json
          isActive?: boolean
        }
      }
    }
  }
}
