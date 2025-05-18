
import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Property } from "@/types";
import { PropertyFilter } from "@/services/properties/types";
import { propertiesService } from "@/services/properties.service";

export function usePropertyFilters(initialProperties: Property[] = []) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // State for properties
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(true);
  
  // Filter states with defaults from URL params or location state
  const locationState = location.state as any;
  const searchFromForm = locationState?.searchParams || {};

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("priceMin")) || 500000,
    Number(searchParams.get("priceMax")) || 5000000
  ]);
  
  const initialLocations = searchParams.get("locations")?.split(",").filter(Boolean) || 
    (searchFromForm.neighborhoods?.length ? searchFromForm.neighborhoods : []) ||
    (searchFromForm.zone ? [searchFromForm.zone] : []);
    
  const [locations, setLocations] = useState<string[]>(initialLocations);
  
  // For bedrooms, use form data if available
  const initialBedrooms = searchFromForm.bedrooms ? 
    [searchFromForm.bedrooms] : 
    searchParams.get("features")?.split(",").filter(Boolean) || [];
    
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialBedrooms);
  
  const [stages, setStages] = useState<string[]>(
    searchParams.get("stages")?.split(",").filter(Boolean) || []
  );
  
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Fetch properties from Supabase on initial load
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Create filter object for API
        const filters: PropertyFilter = {
          isActive: true
        };
        
        // Add budget/price filter if from form
        if (searchFromForm.budget) {
          const budget = parseFloat(searchFromForm.budget);
          if (!isNaN(budget)) {
            filters.maxPrice = budget;
          }
        }
        
        // Fetch filtered properties
        const fetchedProperties = await propertiesService.getAllActiveProperties(filters);
        setProperties(fetchedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

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
    if (loading) return;
    
    const filtered = properties.filter((property) => {
      // Search filter
      const searchMatches = search === "" || 
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        property.description.toLowerCase().includes(search.toLowerCase()) ||
        property.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
        property.city.toLowerCase().includes(search.toLowerCase());

      // Price filter
      const priceMatches = property.price >= priceRange[0] && property.price <= priceRange[1];

      // Location filter (city, zone and neighborhood)
      const locationMatches = locations.length === 0 || 
        locations.some(loc => 
          property.neighborhood.toLowerCase() === loc.toLowerCase() || 
          property.city.toLowerCase() === loc.toLowerCase()
        );

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
  }, [properties, search, priceRange, locations, selectedFeatures, stages, loading]);

  // Build filter object for API requests
  const getFilterObject = (): PropertyFilter => {
    const filterObj: PropertyFilter = {
      isActive: true
    };
    
    if (search) {
      filterObj.search = search;
    }
    
    if (priceRange[0] !== 500000) {
      filterObj.minPrice = priceRange[0];
    }
    
    if (priceRange[1] !== 5000000) {
      filterObj.maxPrice = priceRange[1];
    }
    
    if (locations.length > 0) {
      // Assign first location as city (simplified)
      filterObj.city = locations[0];
      
      // Use all locations as potential neighborhoods
      filterObj.neighborhood = locations;
    }
    
    if (selectedFeatures.length > 0) {
      // Get minimum bedroom count from features
      const bedroomCounts = selectedFeatures
        .map(f => parseInt(f))
        .filter(n => !isNaN(n));
        
      if (bedroomCounts.length > 0) {
        filterObj.minBedrooms = Math.min(...bedroomCounts);
      }
    }
    
    return filterObj;
  };

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
    isLoading: loading,
    getFilterObject
  };
}
