import { useState, useEffect, useCallback } from 'react';
import { 
  getScholarships, 
  getScholarshipById,
  createScholarship, 
  updateScholarship, 
  deleteScholarship, 
  saveScholarship,
  unsaveScholarship,
  isScholarshipSaved,
  getSavedScholarships
} from '../services/scholarshipService';
import { Scholarship, ScholarshipFilters, ScholarshipFormData } from '../types/scholarship';
import { useAuth } from '../contexts/AuthContext';

export const useScholarships = () => {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [totalScholarships, setTotalScholarships] = useState(0);
  const [currentScholarship, setCurrentScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ScholarshipFilters>({
    page: 1,
    limit: 12,
    sortBy: 'deadline'
  });

  // Fetch scholarships with filters
  const fetchScholarships = useCallback(async (newFilters?: ScholarshipFilters) => {
    try {
      setLoading(true);
      setError(null);
      const currentFilters = newFilters || filters;

      const response = await getScholarships(currentFilters);
      setScholarships(response.data);
      setTotalScholarships(response.total);
      
      // If user is logged in, check which scholarships are saved
      if (user) {
        try {
          const savedScholarships = await getSavedScholarships(user.id);
          const savedIds = new Set(savedScholarships.map(s => s.id));
          
          setScholarships(prevScholarships => 
            prevScholarships.map(scholarship => ({
              ...scholarship,
              isSaved: savedIds.has(scholarship.id)
            }))
          );
        } catch (err) {
          console.error("Error checking saved scholarships:", err);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scholarships');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  // Fetch a single scholarship by ID
  const fetchScholarshipById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const scholarship = await getScholarshipById(id);
      
      // If user is logged in, check if scholarship is saved
      if (user) {
        try {
          const saved = await isScholarshipSaved(id, user.id);
          scholarship.isSaved = saved;
        } catch (err) {
          console.error("Error checking if scholarship is saved:", err);
        }
      }
      
      setCurrentScholarship(scholarship);
      return scholarship;
    } catch (err: any) {
      setError(err.message || `Failed to fetch scholarship with ID ${id}`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new scholarship
  const addScholarship = async (scholarshipData: ScholarshipFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newScholarship = await createScholarship(scholarshipData);
      setScholarships(prev => [newScholarship, ...prev]);
      
      return newScholarship;
    } catch (err: any) {
      setError(err.message || 'Failed to create scholarship');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing scholarship
  const editScholarship = async (id: string, scholarshipData: Partial<ScholarshipFormData>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedScholarship = await updateScholarship(id, scholarshipData);
      
      setScholarships(prev => 
        prev.map(scholarship => 
          scholarship.id === id ? updatedScholarship : scholarship
        )
      );
      
      if (currentScholarship?.id === id) {
        setCurrentScholarship(updatedScholarship);
      }
      
      return updatedScholarship;
    } catch (err: any) {
      setError(err.message || `Failed to update scholarship with ID ${id}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a scholarship
  const removeScholarship = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteScholarship(id);
      setScholarships(prev => prev.filter(scholarship => scholarship.id !== id));
      
      if (currentScholarship?.id === id) {
        setCurrentScholarship(null);
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || `Failed to delete scholarship with ID ${id}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Save a scholarship for the current user
  const saveScholarshipForUser = async (scholarshipId: string) => {
    if (!user) throw new Error('User must be logged in to save a scholarship');
    
    try {
      setLoading(true);
      setError(null);
      
      await saveScholarship(scholarshipId, user.id);
      
      setScholarships(prev => 
        prev.map(scholarship => 
          scholarship.id === scholarshipId ? { ...scholarship, isSaved: true } : scholarship
        )
      );
      
      if (currentScholarship?.id === scholarshipId) {
        setCurrentScholarship({ ...currentScholarship, isSaved: true });
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || `Failed to save scholarship with ID ${scholarshipId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Unsave a scholarship for the current user
  const unsaveScholarshipForUser = async (scholarshipId: string) => {
    if (!user) throw new Error('User must be logged in to unsave a scholarship');
    
    try {
      setLoading(true);
      setError(null);
      
      await unsaveScholarship(scholarshipId, user.id);
      
      setScholarships(prev => 
        prev.map(scholarship => 
          scholarship.id === scholarshipId ? { ...scholarship, isSaved: false } : scholarship
        )
      );
      
      if (currentScholarship?.id === scholarshipId) {
        setCurrentScholarship({ ...currentScholarship, isSaved: false });
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || `Failed to unsave scholarship with ID ${scholarshipId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle saved status
  const toggleSaveScholarship = async (scholarshipId: string) => {
    if (!user) throw new Error('User must be logged in to save/unsave scholarships');
    
    const scholarshipToToggle = scholarships.find(s => s.id === scholarshipId) || currentScholarship;
    if (!scholarshipToToggle) throw new Error(`Scholarship with ID ${scholarshipId} not found`);
    
    if (scholarshipToToggle.isSaved) {
      return unsaveScholarshipForUser(scholarshipId);
    } else {
      return saveScholarshipForUser(scholarshipId);
    }
  };

  // Fetch saved scholarships for current user
  const fetchSavedScholarships = async () => {
    if (!user) throw new Error('User must be logged in to fetch saved scholarships');
    
    try {
      setLoading(true);
      setError(null);
      
      const savedScholarships = await getSavedScholarships(user.id);
      setScholarships(savedScholarships);
      setTotalScholarships(savedScholarships.length);
      
      return savedScholarships;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch saved scholarships');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update filters and refetch scholarships
  const updateFilters = (newFilters: Partial<ScholarshipFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchScholarships(updatedFilters);
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  return {
    scholarships,
    totalScholarships,
    currentScholarship,
    loading,
    error,
    filters,
    fetchScholarships,
    fetchScholarshipById,
    addScholarship,
    editScholarship,
    removeScholarship,
    toggleSaveScholarship,
    fetchSavedScholarships,
    updateFilters
  };
};