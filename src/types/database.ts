/**
 * Tipos generados a partir del esquema de Supabase.
 *
 * En el futuro se pueden regenerar automáticamente con:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 *
 * Por ahora los mantenemos a mano para no agregar otra dependencia.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "super_admin" | "comercial" | "operaciones" | "apoyo";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "super_admin" | "comercial" | "operaciones" | "apoyo";
          avatar_url?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          role?: "super_admin" | "comercial" | "operaciones" | "apoyo";
          avatar_url?: string | null;
        };
      };

      team_members: {
        Row: {
          id: string;
          slug: string;
          name: string;
          role_es: string;
          role_en: string;
          bio_es: string;
          bio_en: string;
          image_url: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          role_es: string;
          role_en: string;
          bio_es: string;
          bio_en: string;
          image_url?: string | null;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
      };

      gallery_assets: {
        Row: {
          id: string;
          image_url: string;
          alt_es: string;
          alt_en: string;
          tag: string;
          sort_order: number;
          featured: boolean;
          published: boolean;
          event_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          alt_es: string;
          alt_en: string;
          tag: string;
          sort_order?: number;
          featured?: boolean;
          published?: boolean;
          event_id?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["gallery_assets"]["Insert"]
        >;
      };

      event_types: {
        Row: {
          id: string;
          slug: string;
          title_es: string;
          title_en: string;
          short_es: string;
          short_en: string;
          description_es: string;
          description_en: string;
          highlights_es: string[];
          highlights_en: string[];
          body_es: string;
          body_en: string;
          whatsapp_message_es: string | null;
          whatsapp_message_en: string | null;
          image_url: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_es: string;
          title_en: string;
          short_es: string;
          short_en: string;
          description_es: string;
          description_en: string;
          highlights_es?: string[];
          highlights_en?: string[];
          body_es?: string;
          body_en?: string;
          whatsapp_message_es?: string | null;
          whatsapp_message_en?: string | null;
          image_url?: string | null;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["event_types"]["Insert"]>;
      };

      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title_es: string;
          title_en: string | null;
          excerpt_es: string | null;
          excerpt_en: string | null;
          body_es: string;
          body_en: string | null;
          cover_url: string | null;
          category: string | null;
          tags: string[];
          author_name: string;
          published: boolean;
          published_at: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_es: string;
          title_en?: string | null;
          excerpt_es?: string | null;
          excerpt_en?: string | null;
          body_es?: string;
          body_en?: string | null;
          cover_url?: string | null;
          category?: string | null;
          tags?: string[];
          author_name?: string;
          published?: boolean;
          published_at?: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };

      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_email: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          payload?: Json | null;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
      };

      clients: {
        Row: {
          id: string;
          full_name: string;
          identification_type: string | null;
          identification: string | null;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          birthday: string | null;
          source: string | null;
          notes: string | null;
          marketing_consent: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          identification_type?: string | null;
          identification?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          birthday?: string | null;
          source?: string | null;
          notes?: string | null;
          marketing_consent?: boolean;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
      };

      spaces: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          capacity_min: number | null;
          capacity_max: number | null;
          active: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          capacity_min?: number | null;
          capacity_max?: number | null;
          active?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["spaces"]["Insert"]>;
      };

      catalog_categories: {
        Row: {
          id: string;
          slug: string;
          name_es: string;
          name_en: string;
          sort_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_es: string;
          name_en: string;
          sort_order?: number;
          active?: boolean;
        };
        Update: Partial<
          Database["public"]["Tables"]["catalog_categories"]["Insert"]
        >;
      };

      events: {
        Row: {
          id: string;
          client_id: string | null;
          event_type_id: string | null;
          space_id: string | null;
          title: string;
          event_date: string | null;
          start_time: string | null;
          end_time: string | null;
          guests: number | null;
          status:
            | "lead"
            | "propuesta"
            | "hold"
            | "reservado"
            | "contratado"
            | "en_ejecucion"
            | "cerrado"
            | "cancelado";
          source: string | null;
          notes_public: string | null;
          notes_internal: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          event_type_id?: string | null;
          space_id?: string | null;
          title: string;
          event_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          guests?: number | null;
          status?: Database["public"]["Tables"]["events"]["Row"]["status"];
          source?: string | null;
          notes_public?: string | null;
          notes_internal?: string | null;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };

      quotes: {
        Row: {
          id: string;
          number: number;
          event_id: string | null;
          client_id: string | null;
          issued_at: string;
          valid_until: string | null;
          currency: string;
          subtotal: number;
          tax_rate: number;
          tax: number;
          discount: number;
          total: number;
          status:
            | "borrador"
            | "enviada"
            | "aceptada"
            | "rechazada"
            | "expirada";
          notes_public: string | null;
          notes_internal: string | null;
          origin: string;
          pdf_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          client_id?: string | null;
          valid_until?: string | null;
          currency?: string;
          subtotal?: number;
          tax_rate?: number;
          tax?: number;
          discount?: number;
          total?: number;
          status?: Database["public"]["Tables"]["quotes"]["Row"]["status"];
          notes_public?: string | null;
          notes_internal?: string | null;
          origin?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["quotes"]["Insert"]>;
      };

      quote_lines: {
        Row: {
          id: string;
          quote_id: string;
          catalog_item_id: string | null;
          description: string;
          quantity: number;
          unit_price: number;
          unit_cost: number | null;
          subtotal: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote_id: string;
          catalog_item_id?: string | null;
          description: string;
          quantity?: number;
          unit_price: number;
          unit_cost?: number | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["quote_lines"]["Insert"]>;
      };

      date_holds: {
        Row: {
          id: string;
          event_id: string | null;
          space_id: string | null;
          hold_date: string;
          status: "hold" | "reserved" | "blocked";
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          space_id?: string | null;
          hold_date: string;
          status?: "hold" | "reserved" | "blocked";
          reason?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["date_holds"]["Insert"]>;
      };

      catalog_items: {
        Row: {
          id: string;
          category_id: string | null;
          slug: string;
          name_es: string;
          name_en: string;
          description_es: string | null;
          description_en: string | null;
          unit_type: string;
          sale_price: number;
          cost_price: number | null;
          active: boolean;
          public_visible: boolean;
          sort_order: number;
          valid_from: string | null;
          valid_until: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          slug: string;
          name_es: string;
          name_en: string;
          description_es?: string | null;
          description_en?: string | null;
          unit_type?: string;
          sale_price: number;
          cost_price?: number | null;
          active?: boolean;
          public_visible?: boolean;
          sort_order?: number;
          valid_from?: string | null;
          valid_until?: string | null;
          image_url?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["catalog_items"]["Insert"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "super_admin" | "comercial" | "operaciones" | "apoyo";
    };
  };
}
