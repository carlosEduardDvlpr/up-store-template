export function createQueryString(
  filters: Record<string, string | string[]>,
  additionalParams?: Record<string, string | number>,
) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(","));
    } else if (typeof value === "string" && value.trim() !== "") {
      params.set(key, value);
    }
  });

  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.set(key, String(value));
    });
  }

  return `?${params.toString()}`;
}
