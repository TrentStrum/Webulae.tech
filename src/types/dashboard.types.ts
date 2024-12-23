export interface Activity {
  id: string;
  type: string;
  timestamp: string;
  // ... other activity fields
}

export interface ActivityParams {
  limit?: number;
  offset?: number;
  // ... other params
}

export interface SearchResult {
  id: string;
  title: string;
  type: string;
  // ... other search result fields
} 