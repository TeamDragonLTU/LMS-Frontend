import { useState } from "react";
import { fetchWithToken } from "../../shared/utilities";

interface UseCreateActivityOptions {
  onSuccess?: () => void;
  onError?: (errors: Record<string, string[]> | string) => void;
}

export function useCreateActivity(options?: UseCreateActivityOptions) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const postActivity = async (payload: any) => {
    setLoading(true);
    setErrors(null);

    try {
      await fetchWithToken("https://localhost:7213/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      options?.onSuccess?.();
      return { success: true };
    } catch (error: any) {
      if (
        error?.message &&
        error.message.includes("Unexpected end of JSON input")
      ) {
        options?.onSuccess?.();
        return { success: true };
      }

      const errorData = error?.errors || { general: ["Något gick fel."] };
      setErrors(errorData);
      options?.onError?.(errorData);
      return { success: false, error: errorData };
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => setErrors(null);

  return { postActivity, loading, errors, setErrors, clearErrors };
}
