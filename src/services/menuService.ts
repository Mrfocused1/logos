import { supabase } from '../lib/supabase';

export interface MenuLink {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  url: string;
  display_order: number;
  is_active: boolean;
}

export interface CreateMenuLinkData {
  title: string;
  url: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateMenuLinkData {
  title?: string;
  url?: string;
  display_order?: number;
  is_active?: boolean;
}

// Helper to ensure URL has a protocol
const ensureProtocol = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export const menuService = {
  // Get all active links (public)
  async getActiveLinks(): Promise<MenuLink[]> {
    const { data, error } = await supabase
      .from('menu_links')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching menu links:', error);
      throw error;
    }

    return data || [];
  },

  // Get all links (admin)
  async getAllLinks(): Promise<MenuLink[]> {
    const { data, error } = await supabase
      .from('menu_links')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching all menu links:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new link
  async createLink(linkData: CreateMenuLinkData): Promise<MenuLink> {
    const { data, error } = await supabase
      .from('menu_links')
      .insert([{
        ...linkData,
        url: ensureProtocol(linkData.url),
        display_order: linkData.display_order ?? 0,
        is_active: linkData.is_active ?? true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating menu link:', error);
      throw error;
    }

    return data;
  },

  // Update a link
  async updateLink(id: string, linkData: UpdateMenuLinkData): Promise<MenuLink> {
    const updateData = {
      ...linkData,
      updated_at: new Date().toISOString()
    };
    if (linkData.url) {
      updateData.url = ensureProtocol(linkData.url);
    }
    const { data, error } = await supabase
      .from('menu_links')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating menu link:', error);
      throw error;
    }

    return data;
  },

  // Delete a link
  async deleteLink(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_links')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu link:', error);
      throw error;
    }
  },

  // Reorder links
  async reorderLinks(links: { id: string; display_order: number }[]): Promise<void> {
    const updates = links.map(link =>
      supabase
        .from('menu_links')
        .update({ display_order: link.display_order, updated_at: new Date().toISOString() })
        .eq('id', link.id)
    );

    await Promise.all(updates);
  }
};
