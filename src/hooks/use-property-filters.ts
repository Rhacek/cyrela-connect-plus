
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Property } from "@/types";
import { PropertyFilter as PropertyFilterType } from "@/services/properties/types";

export function usePropertyFilters(initialProperties: Property[] = []) {
  // URL search params for persisting filter state
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states with defaults from URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("priceMin")) || 500000,
    Number(searchParams.get("priceMax")) || 5000000
  ]);
  const [locations, setLocations] = useState<string[]>(
    searchParams.get("locations")?.split(",").filter(Boolean) || []
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    searchParams.get("features")?.split(",").filter(Boolean) || []
  );
  const [stages, setStages] = useState<string[]>(
    searchParams.get("stages")?.split(",").filter(Boolean) || []
  );
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (search) params.set("search", search);
    if (priceRange[0] !== 500000) params.set("priceMin", priceRange[0].toString());
    if (priceRange[1] !== 5000000) params.set("priceMax", priceRange[1].toString());
    if (locations.length > 0) params.set("locations", locations.join(","));
    if (selectedFeatures.length > 0) params.set("features", selectedFeatures.join(","));
    if (stages.length > 0) params.set("stages", stages.join(","));
    
    setSearchParams(params, { replace: true });
  }, [search, priceRange, locations, selectedFeatures, stages, setSearchParams]);

  // Apply filters to properties
  useEffect(() => {
    const filtered = initialProperties.filter((property) => {
      // Search filter
      const searchMatches = search === "" || 
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        property.description.toLowerCase().includes(search.toLowerCase()) ||
        property.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
        property.city.toLowerCase().includes(search.toLowerCase());

      // Price filter
      const priceMatches = property.price >= priceRange[0] && property.price <= priceRange[1];

      // Location filter (city and neighborhood)
      const locationMatches = locations.length === 0 || 
        locations.some(loc => property.neighborhood === loc || property.city === loc);

      // Features filter (based on bedrooms)
      const featureMatches = selectedFeatures.length === 0 || 
        selectedFeatures.some(feature => {
          if (feature === "1") return property.bedrooms === 1;
          if (feature === "2") return property.bedrooms === 2;
          if (feature === "3") return property.bedrooms === 3;
          if (feature === "4") return property.bedrooms >= 4;
          return false;
        });

      // Construction stage filter
      const stageMatches = stages.length === 0 || 
        (property.constructionStage && stages.includes(property.constructionStage));

      return searchMatches && priceMatches && locationMatches && featureMatches && stageMatches;
    });

    setFilteredProperties(filtered);
  }, [initialProperties, search, priceRange, locations, selectedFeatures, stages]);

  // Build filter object for API requests
  const getFilterObject = (): PropertyFilterType => ({
    search: search || undefined,
    priceMin: priceRange[0],
    priceMax: priceRange[1],
    locations: locations.length > 0 ? locations : undefined,
    bedrooms: selectedFeatures.length > 0 
      ? selectedFeatures.map(f => parseInt(f)).filter(n => !isNaN(n)) 
      : undefined,
    constructionStages: stages.length > 0 ? stages : undefined
  });

  return {
    filters: {
      search,
      priceRange,
      locations,
      selectedFeatures,
      stages
    },
    setFilters: {
      setSearch,
      setPriceRange,
      setLocations,
      setSelectedFeatures,
      setStages
    },
    filteredProperties,
    getFilterObject
  };
}
