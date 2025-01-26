class ApiStore {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async callApi(method?: string, params?: unknown) {
    try {
      const options: RequestInit = {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (method && method !== "GET") {
        options.body = JSON.stringify(params);
      }

      const response = await fetch(this.endpoint, options);
      const data = await response.json();

      if (!response.ok) {
        const error = JSON.stringify(data) || response.status.toString();
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      return { success: false, error: errorMessage };
    }
  }
}

export const aiRecommendStore = new ApiStore("/api/ai-recommend");
export const recommendationStore = new ApiStore("/api/recommendations");
export const restaurantsStore = new ApiStore("/api/restaurants");
