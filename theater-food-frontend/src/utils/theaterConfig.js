import { useEffect, useState } from "react";

const STORAGE_KEY = "theater_configuration";

export const defaultTheaterConfig = {
  name: "CINÉMA Theater 01",
  code: "THEATER-001",
  city: "Kochi",
  logo: "/logo.png",
};

export function getTheaterConfig() {
  try {
    return { ...defaultTheaterConfig, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return defaultTheaterConfig;
  }
}

export function saveTheaterConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent("theater-config-updated", { detail: config }));
}

export function useTheaterConfig() {
  const [config, setConfig] = useState(getTheaterConfig);

  useEffect(() => {
    const refresh = () => setConfig(getTheaterConfig());
    window.addEventListener("theater-config-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("theater-config-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return config;
}
