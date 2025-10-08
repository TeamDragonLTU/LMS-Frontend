import { useState, useEffect, useCallback } from "react";
import { ActivityType } from "../interfaces";
import { fetchWithToken } from "../utilities";

export function useFetchActivityTypes(shouldFetch: boolean = true) {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityTypes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithToken<ActivityType[]>(
        "https://localhost:7213/api/activityType"
      );
      setActivityTypes(data);
    } catch (error: any) {
      setError(`Failed to fetch activity types: ${error}`);
      setActivityTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      fetchActivityTypes();
    }
  }, [shouldFetch, fetchActivityTypes]);

  const clearErrors = () => setError(null);

  return {
    activityTypes,
    loading,
    error,
    refetch: fetchActivityTypes,
    clearErrors,
  };
}
