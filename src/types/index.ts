export interface Destination {
  id: string;
  name: string;
  country: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  categories?: string[];
  gradient?: string;
}
export interface DailyForecast {
  date: string;
  code: number;
  max: number;
  min: number;
}
export interface WeatherSnapshot {
  temperature: number;
  weatherCode: number;
  windSpeed?: number;
  observedAt?: string;
  unit: string;
  daily: DailyForecast[];
}
export interface ItineraryItem {
  id: string;
  destinationId?: string;
  title: string;
  notes?: string;
  startTime?: string;
  order: number;
}
export interface TripDay {
  id: string;
  tripId: string;
  dayIndex: number;
  items: ItineraryItem[];
}
export interface Trip {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  days: TripDay[];
}
