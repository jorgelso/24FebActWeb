import { useEffect, useState } from "react";

const API_KEY = "bf3dfb4a99bb46ad88a190424252402";
const API_URL = "http://api.weatherapi.com/v1/current.json";

interface WeatherData {
    location: {
      name: string;
      country: string;
    };
    current: {
      temp_c: number;
      condition: {
        text: string;
      };
      humidity: number;
      precip_mm: number;
      wind_kph: number;
      wind_dir: string;
    };
  }

export const useFetchData = (cityName: string | null) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityName) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(cityName)}&key=${API_KEY}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json: WeatherData = await response.json();
        setData(json);
      } catch (err) {
        setError((err as Error).message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityName]);

  return { data, loading, error };
};
