
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PropertyHeader } from "@/components/client/property/property-header";
import { PropertyGallery } from "@/components/client/property/property-gallery";
import { PropertyDetails } from "@/components/client/property/property-details";
import { PropertyAmenities } from "@/components/client/property/property-amenities";
import { PropertyLocation } from "@/components/client/property/property-location";
import { PropertyActions } from "@/components/client/property/property-actions";
import { PropertyNotFound } from "@/components/client/property/property-not-found";
import { PropertyFeatures } from "@/components/client/property/property-features";
import { Skeleton } from "@/components/ui/skeleton";
import { propertiesService } from "@/services/properties.service";
import { Property } from "@/types";
import { useBrokerReferral } from "@/hooks/use-broker-referral";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { brokerId } = useBrokerReferral();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Fetch property from Supabase
        const fetchedProperty = await propertiesService.getById(id);
        
        if (fetchedProperty) {
          setProperty(fetchedProperty);
          
          // Increment view count
          try {
            // This could be an edge function or direct DB call
            await propertiesService.incrementViews(id);
          } catch (viewError) {
            console.error("Error incrementing view count:", viewError);
            // Don't set error state for view count failures
          }
        } else {
          setError("Imóvel não encontrado");
        }
      } catch (err) {
        console.error("Error loading property:", err);
        setError("Erro ao carregar dados do imóvel");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cyrela-gray-lightest">
        <PropertyHeader />
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-60 w-full rounded-lg" />
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-60 w-full rounded-lg" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-80 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error or not found state
  if (error || !property) {
    return <PropertyNotFound message={error || "Imóvel não encontrado"} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cyrela-gray-lightest">
      <PropertyHeader />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col gap-6">
          {/* Gallery Section */}
          <PropertyGallery property={property} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2/3 width on desktop */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Details */}
              <PropertyDetails property={property} />
              
              {/* Property Features */}
              <PropertyFeatures property={property} />
              
              {/* Property Amenities */}
              <PropertyAmenities property={property} />
              
              {/* Property Location */}
              <PropertyLocation property={property} />
            </div>
            
            {/* Sidebar - 1/3 width on desktop */}
            <div className="lg:col-span-1">
              <PropertyActions property={property} brokerId={brokerId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
