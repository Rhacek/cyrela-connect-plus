
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { propertiesService } from "@/services/properties.service";
import { PropertyFormValues, defaultPropertyValues, propertyFormSchema } from "@/components/admin/property-form/PropertyFormSchema";

interface UsePropertyFormProps {
  propertyId?: string;
  userId: string;
}

export const usePropertyForm = ({ propertyId, userId }: UsePropertyFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(propertyId);
  const [currentTab, setCurrentTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: defaultPropertyValues
  });
  
  useEffect(() => {
    if (isEditing && propertyId) {
      const fetchProperty = async () => {
        try {
          setIsLoading(true);
          const property = await propertiesService.getById(propertyId);
          
          if (property) {
            form.reset({
              title: property.title,
              developmentName: property.developmentName || "",
              description: property.description,
              type: property.type,
              price: property.price,
              promotionalPrice: property.promotionalPrice,
              area: property.area,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              suites: property.suites,
              parkingSpaces: property.parkingSpaces,
              address: property.address,
              neighborhood: property.neighborhood,
              city: property.city,
              state: property.state,
              zipCode: property.zipCode,
              constructionStage: property.constructionStage || "",
              youtubeUrl: property.youtubeUrl || "",
              isHighlighted: property.isHighlighted,
              brokerNotes: property.brokerNotes || "",
              commission: property.commission || 0
            });
          } else {
            toast.error("Imóvel não encontrado", {
              description: "O imóvel que você está tentando editar não foi encontrado."
            });
            navigate("/admin/properties");
          }
        } catch (error) {
          console.error("Error fetching property:", error);
          toast.error("Erro ao carregar imóvel", {
            description: "Ocorreu um erro ao carregar as informações do imóvel."
          });
          navigate("/admin/properties");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProperty();
    }
  }, [propertyId, isEditing, form, navigate, toast]);
  
  const onSubmit = async (values: PropertyFormValues) => {
    if (!userId) {
      toast.error("Não autenticado", {
        description: "Você precisa estar logado para cadastrar um imóvel."
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (isEditing && propertyId) {
        // Update existing property
        await propertiesService.update(propertyId, {
          ...values,
          createdById: userId
        });
        
        toast.success("Imóvel atualizado com sucesso!", {
          description: "As informações foram salvas no sistema."
        });
      } else {
        // Create new property - ensure all required fields are present
        const newProperty = await propertiesService.create({
          title: values.title,
          description: values.description,
          developmentName: values.developmentName || "",
          type: values.type,
          price: values.price,
          promotionalPrice: values.promotionalPrice,
          area: values.area,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          suites: values.suites,
          parkingSpaces: values.parkingSpaces,
          address: values.address,
          neighborhood: values.neighborhood,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          constructionStage: values.constructionStage || "",
          youtubeUrl: values.youtubeUrl || "",
          isHighlighted: values.isHighlighted,
          brokerNotes: values.brokerNotes || "",
          commission: values.commission || 0,
          createdById: userId,
          isActive: true,
          viewCount: 0,
          shareCount: 0
        });
        
        toast.success("Imóvel cadastrado com sucesso!", {
          description: "O novo imóvel foi adicionado ao sistema."
        });
      }
      
      navigate("/admin/properties");
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error("Erro ao salvar imóvel", {
        description: "Ocorreu um erro ao salvar as informações do imóvel. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    currentTab,
    setCurrentTab,
    isSubmitting,
    isLoading,
    isEditing,
    onSubmit
  };
};
