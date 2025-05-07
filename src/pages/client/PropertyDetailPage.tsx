
import { useParams } from "react-router-dom";
import { mockProperties } from "@/mocks/property-data";
import { PropertyHeader } from "@/components/client/property/property-header";
import { PropertyGallery } from "@/components/client/property/property-gallery";
import { PropertyDetails } from "@/components/client/property/property-details";
import { PropertyAmenities } from "@/components/client/property/property-amenities";
import { PropertyLocation } from "@/components/client/property/property-location";
import { PropertyActions } from "@/components/client/property/property-actions";
import { PropertyNotFound } from "@/components/client/property/property-not-found";
import { PropertyFeatures } from "@/components/client/property/property-features";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return <PropertyNotFound />;
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
              <PropertyActions property={property} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
