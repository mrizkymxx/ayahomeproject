import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category_id?: string;
  description?: string;
  images: string[];
  is_best_seller?: boolean;
  is_featured?: boolean;
  specifications?: Record<string, string>;
  category?: Category;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author?: string;
  category?: string;
  read_time?: string;
  image_url?: string;
  is_featured?: boolean;
  published_at?: string;
}

// Custom hooks for data fetching

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (fetchError) throw fetchError;
        setCategories(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            category:categories(*)
          `);

        if (categorySlug) {
          // Get category ID first
          const { data: catData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single();

          if (catData) {
            query = query.eq('category_id', catData.id);
          }
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setProducts(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categorySlug]);

  return { products, loading, error };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('slug', slug)
          .single();

        if (fetchError) throw fetchError;
        setProduct(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data, error: fetchError } = await supabase
          .from('articles')
          .select('*')
          .order('published_at', { ascending: false });

        if (fetchError) throw fetchError;
        setArticles(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  return { articles, loading, error };
}

export function useBestSellers(limit: number = 6) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('is_best_seller', true)
          .limit(limit);

        if (fetchError) throw fetchError;
        setProducts(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching best sellers:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBestSellers();
  }, [limit]);

  return { products, loading, error };
}

// Form submission helpers

export async function submitInquiry(data: {
  type: 'contact' | 'catalog';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message?: string;
}) {
  try {
    const { error } = await supabase
      .from('inquiries')
      .insert([{
        type: data.type,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        message: data.message || '',
      }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return { success: false, error };
  }
}
