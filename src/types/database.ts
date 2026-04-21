/**
 * Types générés manuellement pour ResaKit.
 * À regénérer quand le schéma change :
 *   npx supabase gen types typescript --local > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type BookingStatus =
  | 'pending'
  | 'deposit_paid'
  | 'fully_paid'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type ExperienceCategory =
  | 'escape_game'
  | 'atelier_cocktail'
  | 'atelier_cuisine'
  | 'atelier_oenologie'
  | 'sport_loisir'
  | 'bar_privatisation'
  | 'atelier_creatif'
  | 'karaoke'
  | 'experience_insolite'
  | 'bien_etre'

export type Occasion =
  | 'EVJF'
  | 'EVG'
  | 'Anniversaire'
  | 'Team building'
  | 'Soirée'
  | 'Entre amis'
  | 'Pot de départ'
  | 'Séminaire'

export interface Database {
  public: {
    Tables: {
      providers: {
        Row: {
          id: string
          name: string
          slug: string
          category: ExperienceCategory
          subcategory: string | null
          city: string
          address: string | null
          latitude: number | null
          longitude: number | null
          description: string | null
          short_description: string | null
          photos: string[]
          logo_url: string | null
          stripe_account_id: string | null
          stripe_onboarding_complete: boolean
          contact_name: string | null
          contact_email: string | null
          contact_phone: string | null
          website: string | null
          instagram: string | null
          facebook: string | null
          commission_rate: number
          is_active: boolean
          is_featured: boolean
          rating_average: number
          rating_count: number
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['providers']['Row']> & {
          name: string
          slug: string
          category: ExperienceCategory
        }
        Update: Partial<Database['public']['Tables']['providers']['Row']>
      }
      experiences: {
        Row: {
          id: string
          provider_id: string
          title: string
          slug: string
          description: string | null
          short_description: string | null
          duration_minutes: number | null
          min_people: number
          max_people: number
          price_per_person: number | null
          price_fixed: number | null
          deposit_percent: number
          cancellation_policy: string
          what_included: string | null
          what_to_bring: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          photos: string[]
          tags: string[]
          occasions: Occasion[]
          is_active: boolean
          seo_title: string | null
          seo_description: string | null
          rating_average: number
          rating_count: number
          bookings_count: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['experiences']['Row']> & {
          provider_id: string
          title: string
          slug: string
        }
        Update: Partial<Database['public']['Tables']['experiences']['Row']>
      }
      slots: {
        Row: {
          id: string
          experience_id: string
          date: string
          time_start: string
          time_end: string | null
          total_capacity: number
          booked_capacity: number
          is_blocked: boolean
          notes: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['slots']['Row']> & {
          experience_id: string
          date: string
          time_start: string
          total_capacity: number
        }
        Update: Partial<Database['public']['Tables']['slots']['Row']>
      }
      bookings: {
        Row: {
          id: string
          booking_ref: string
          experience_id: string
          slot_id: string
          provider_id: string
          organizer_name: string
          organizer_email: string
          organizer_phone: string | null
          occasion: string | null
          message_to_provider: string | null
          group_size: number
          total_amount: number
          deposit_amount: number | null
          commission_amount: number
          provider_amount: number
          payment_intent_id: string | null
          stripe_session_id: string | null
          stripe_transfer_id: string | null
          status: BookingStatus
          split_payment_enabled: boolean
          split_payment_code: string | null
          split_payment_deadline: string | null
          confirmed_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['bookings']['Row']> & {
          experience_id: string
          slot_id: string
          provider_id: string
          organizer_name: string
          organizer_email: string
          group_size: number
          total_amount: number
          commission_amount: number
          provider_amount: number
        }
        Update: Partial<Database['public']['Tables']['bookings']['Row']>
      }
      participants: {
        Row: {
          id: string
          booking_id: string
          name: string
          email: string
          amount_due: number
          amount_paid: number
          payment_status: PaymentStatus
          payment_intent_id: string | null
          paid_at: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['participants']['Row']> & {
          booking_id: string
          name: string
          email: string
          amount_due: number
        }
        Update: Partial<Database['public']['Tables']['participants']['Row']>
      }
      reviews: {
        Row: {
          id: string
          booking_id: string | null
          experience_id: string
          provider_id: string
          author_name: string
          author_email: string | null
          rating: number
          comment: string | null
          occasion: string | null
          is_published: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['reviews']['Row']> & {
          experience_id: string
          provider_id: string
          author_name: string
          rating: number
        }
        Update: Partial<Database['public']['Tables']['reviews']['Row']>
      }
      waitlist: {
        Row: {
          id: string
          email: string
          city: string | null
          source: string | null
          created_at: string
        }
        Insert: {
          email: string
          city?: string | null
          source?: string | null
        }
        Update: Partial<Database['public']['Tables']['waitlist']['Row']>
      }
    }
  }
}

// Type helpers
export type Provider = Database['public']['Tables']['providers']['Row']
export type Experience = Database['public']['Tables']['experiences']['Row']
export type Slot = Database['public']['Tables']['slots']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Participant = Database['public']['Tables']['participants']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type WaitlistEntry = Database['public']['Tables']['waitlist']['Row']

export type ExperienceWithProvider = Experience & {
  provider: Provider
}

export type ExperienceFull = ExperienceWithProvider & {
  slots?: Slot[]
  reviews?: Review[]
}
