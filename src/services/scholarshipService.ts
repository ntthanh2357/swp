import supabase from './supabaseClient';
import { Scholarship, ScholarshipFilters, ScholarshipFormData, PaginatedResponse } from '../types/scholarship';

// Convert database row to Scholarship object
const transformScholarship = (row: any): Scholarship => {
  return {
    id: row.id,
    title: row.title,
    provider: row.provider,
    amount: row.amount,
    currency: row.currency,
    deadline: new Date(row.deadline),
    country: row.country,
    fieldOfStudy: row.field_of_study,
    academicLevel: row.academic_level,
    requirements: row.requirements,
    description: row.description,
    applicationUrl: row.application_url,
    tags: row.tags || [],
    featured: row.featured || false,
    createdAt: new Date(row.created_at),
    createdBy: row.created_by,
    isSaved: false // Will be populated if needed
  };
};

// Get all scholarships with filtering, sorting, and pagination
export const getScholarships = async (filters?: ScholarshipFilters): Promise<PaginatedResponse<Scholarship>> => {
  try {
    let query = supabase
      .from('scholarships')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,provider.ilike.%${filters.search}%`);
    }

    if (filters?.country) {
      query = query.eq('country', filters.country);
    }

    if (filters?.fieldOfStudy) {
      query = query.contains('field_of_study', [filters.fieldOfStudy]);
    }

    if (filters?.academicLevel) {
      query = query.contains('academic_level', [filters.academicLevel]);
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'deadline':
          query = query.order('deadline', { ascending: true });
          break;
        case 'amount':
          query = query.order('amount', { ascending: false });
          break;
        case 'featured':
          query = query.order('featured', { ascending: false }).order('deadline', { ascending: true });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
      }
    } else {
      // Default sort by deadline
      query = query.order('deadline', { ascending: true });
    }

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const start = (page - 1) * limit;
    
    query = query.range(start, start + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Transform the data to match our interface
    const scholarships = data.map(transformScholarship);

    return {
      data: scholarships,
      total: count || 0,
      page,
      limit
    };
  } catch (error: any) {
    console.error('Error fetching scholarships:', error.message);
    throw error;
  }
};

// Get a scholarship by ID
export const getScholarshipById = async (id: string): Promise<Scholarship> => {
  try {
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Scholarship not found');
    }

    return transformScholarship(data);
  } catch (error: any) {
    console.error(`Error fetching scholarship with id ${id}:`, error.message);
    throw error;
  }
};

// Create a new scholarship
export const createScholarship = async (scholarshipData: ScholarshipFormData): Promise<Scholarship> => {
  try {
    // Transform to database schema
    const dbData = {
      title: scholarshipData.title,
      provider: scholarshipData.provider,
      amount: scholarshipData.amount,
      currency: scholarshipData.currency,
      deadline: scholarshipData.deadline,
      country: scholarshipData.country,
      field_of_study: scholarshipData.fieldOfStudy,
      academic_level: scholarshipData.academicLevel,
      requirements: scholarshipData.requirements,
      description: scholarshipData.description,
      application_url: scholarshipData.applicationUrl,
      tags: scholarshipData.tags,
      featured: scholarshipData.featured || false
    };

    const { data, error } = await supabase
      .from('scholarships')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return transformScholarship(data);
  } catch (error: any) {
    console.error('Error creating scholarship:', error.message);
    throw error;
  }
};

// Update an existing scholarship
export const updateScholarship = async (id: string, scholarshipData: Partial<ScholarshipFormData>): Promise<Scholarship> => {
  try {
    // Transform to database schema
    const dbData: any = {};
    
    if (scholarshipData.title !== undefined) dbData.title = scholarshipData.title;
    if (scholarshipData.provider !== undefined) dbData.provider = scholarshipData.provider;
    if (scholarshipData.amount !== undefined) dbData.amount = scholarshipData.amount;
    if (scholarshipData.currency !== undefined) dbData.currency = scholarshipData.currency;
    if (scholarshipData.deadline !== undefined) dbData.deadline = scholarshipData.deadline;
    if (scholarshipData.country !== undefined) dbData.country = scholarshipData.country;
    if (scholarshipData.fieldOfStudy !== undefined) dbData.field_of_study = scholarshipData.fieldOfStudy;
    if (scholarshipData.academicLevel !== undefined) dbData.academic_level = scholarshipData.academicLevel;
    if (scholarshipData.requirements !== undefined) dbData.requirements = scholarshipData.requirements;
    if (scholarshipData.description !== undefined) dbData.description = scholarshipData.description;
    if (scholarshipData.applicationUrl !== undefined) dbData.application_url = scholarshipData.applicationUrl;
    if (scholarshipData.tags !== undefined) dbData.tags = scholarshipData.tags;
    if (scholarshipData.featured !== undefined) dbData.featured = scholarshipData.featured;

    const { data, error } = await supabase
      .from('scholarships')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return transformScholarship(data);
  } catch (error: any) {
    console.error(`Error updating scholarship with id ${id}:`, error.message);
    throw error;
  }
};

// Delete a scholarship
export const deleteScholarship = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scholarships')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error: any) {
    console.error(`Error deleting scholarship with id ${id}:`, error.message);
    throw error;
  }
};

// Save scholarship for a user
export const saveScholarship = async (scholarshipId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_scholarships')
      .insert({
        user_id: userId,
        scholarship_id: scholarshipId
      });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation - already saved
        return true;
      }
      throw new Error(error.message);
    }

    return true;
  } catch (error: any) {
    console.error(`Error saving scholarship ${scholarshipId} for user ${userId}:`, error.message);
    throw error;
  }
};

// Unsave a scholarship
export const unsaveScholarship = async (scholarshipId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_scholarships')
      .delete()
      .eq('scholarship_id', scholarshipId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error: any) {
    console.error(`Error removing saved scholarship ${scholarshipId} for user ${userId}:`, error.message);
    throw error;
  }
};

// Check if a scholarship is saved by a user
export const isScholarshipSaved = async (scholarshipId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('saved_scholarships')
      .select('id')
      .eq('scholarship_id', scholarshipId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "not found" error code
      throw new Error(error.message);
    }

    return !!data;
  } catch (error: any) {
    console.error(`Error checking if scholarship ${scholarshipId} is saved by user ${userId}:`, error.message);
    throw error;
  }
};

// Get all saved scholarships for a user
export const getSavedScholarships = async (userId: string): Promise<Scholarship[]> => {
  try {
    const { data, error } = await supabase
      .from('saved_scholarships')
      .select(`
        scholarship_id,
        scholarships:scholarship_id (*)
      `)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return data.map((item: any) => {
      const scholarship = transformScholarship(item.scholarships);
      scholarship.isSaved = true;
      return scholarship;
    });
  } catch (error: any) {
    console.error(`Error fetching saved scholarships for user ${userId}:`, error.message);
    throw error;
  }
};

// Get scholarships by creator (advisor or admin)
export const getScholarshipsByCreator = async (creatorId: string): Promise<Scholarship[]> => {
  try {
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('created_by', creatorId);

    if (error) {
      throw new Error(error.message);
    }

    return data.map(transformScholarship);
  } catch (error: any) {
    console.error(`Error fetching scholarships created by ${creatorId}:`, error.message);
    throw error;
  }
};