
import { useParams } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { BasicInfoTab } from "@/components/admin/property-form/BasicInfoTab";
import { DetailsTab } from "@/components/admin/property-form/DetailsTab";
import { MediaTab } from "@/components/admin/property-form/MediaTab";
import { BrokerInfoTab } from "@/components/admin/property-form/BrokerInfoTab";
import { FormHeader } from "@/components/admin/property-form/FormHeader";
import { FormTabs } from "@/components/admin/property-form/FormTabs";
import { FormActions } from "@/components/admin/property-form/FormActions";
import { PropertyFormLoader } from "@/components/admin/property-form/PropertyFormLoader";
import { usePropertyForm } from "@/hooks/use-property-form";
import { useAuth } from "@/context/auth-context";
import { TabsContent } from "@/components/ui/tabs";

const AdminPropertyForm = () => {
  const { id } = useParams();
  const { session } = useAuth();
  
  const { 
    form, 
    currentTab, 
    setCurrentTab, 
    isSubmitting, 
    isLoading, 
    isEditing,
    onSubmit 
  } = usePropertyForm({
    propertyId: id,
    userId: session?.id || ""
  });
  
  if (isLoading) {
    return <PropertyFormLoader />;
  }
  
  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <FormHeader isEditing={isEditing} />

      <FormTabs currentTab={currentTab} onTabChange={setCurrentTab}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6 w-full">
            <TabsContent value="basic" className="w-full">
              <BasicInfoTab form={form} />
            </TabsContent>

            <TabsContent value="details" className="w-full">
              <DetailsTab form={form} />
            </TabsContent>

            <TabsContent value="media" className="w-full">
              <MediaTab 
                form={form} 
                initialImages={[]} 
                propertyId={isEditing ? id : undefined}
              />
            </TabsContent>
            
            <TabsContent value="broker" className="w-full">
              <BrokerInfoTab form={form} />
            </TabsContent>

            <FormActions isSubmitting={isSubmitting} isEditing={isEditing} />
          </form>
        </Form>
      </FormTabs>
    </div>
  );
};

export default AdminPropertyForm;
