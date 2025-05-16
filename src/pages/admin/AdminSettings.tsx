
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  settingsService, 
  GeneralSettings, 
  EmailSettings, 
  FeatureSettings 
} from "@/services/settings.service";
import { toast } from "sonner";
import { GeneralSettingsForm } from "@/components/admin/settings/GeneralSettingsForm";
import { EmailSettingsForm } from "@/components/admin/settings/EmailSettingsForm";
import { FeaturesSettingsForm } from "@/components/admin/settings/FeaturesSettingsForm";

const AdminSettings = () => {
  const [loading, setLoading] = useState({
    general: true,
    email: true,
    features: true
  });
  
  const [activeTab, setActiveTab] = useState("general");
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | undefined>();
  const [emailSettings, setEmailSettings] = useState<EmailSettings | undefined>();
  const [featureSettings, setFeatureSettings] = useState<FeatureSettings | undefined>();

  // Load general settings
  useEffect(() => {
    const loadGeneralSettings = async () => {
      try {
        setLoading((prev) => ({ ...prev, general: true }));
        const settings = await settingsService.getGeneralSettings();
        setGeneralSettings(settings);
      } catch (error) {
        console.error("Erro ao carregar configurações gerais:", error);
        toast.error("Erro ao carregar configurações gerais");
      } finally {
        setLoading((prev) => ({ ...prev, general: false }));
      }
    };

    loadGeneralSettings();
  }, []);

  // Load email settings
  useEffect(() => {
    const loadEmailSettings = async () => {
      try {
        setLoading((prev) => ({ ...prev, email: true }));
        const settings = await settingsService.getEmailSettings();
        setEmailSettings(settings);
      } catch (error) {
        console.error("Erro ao carregar configurações de email:", error);
        toast.error("Erro ao carregar configurações de email");
      } finally {
        setLoading((prev) => ({ ...prev, email: false }));
      }
    };

    loadEmailSettings();
  }, []);

  // Load feature settings
  useEffect(() => {
    const loadFeatureSettings = async () => {
      try {
        setLoading((prev) => ({ ...prev, features: true }));
        const settings = await settingsService.getFeatureSettings();
        setFeatureSettings(settings);
      } catch (error) {
        console.error("Erro ao carregar configurações de funcionalidades:", error);
        toast.error("Erro ao carregar configurações de funcionalidades");
      } finally {
        setLoading((prev) => ({ ...prev, features: false }));
      }
    };

    loadFeatureSettings();
  }, []);

  const refreshGeneralSettings = async () => {
    try {
      const settings = await settingsService.getGeneralSettings();
      setGeneralSettings(settings);
    } catch (error) {
      console.error("Erro ao atualizar configurações gerais:", error);
    }
  };

  const refreshEmailSettings = async () => {
    try {
      const settings = await settingsService.getEmailSettings();
      setEmailSettings(settings);
    } catch (error) {
      console.error("Erro ao atualizar configurações de email:", error);
    }
  };

  const refreshFeatureSettings = async () => {
    try {
      const settings = await settingsService.getFeatureSettings();
      setFeatureSettings(settings);
    } catch (error) {
      console.error("Erro ao atualizar configurações de funcionalidades:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações gerais do sistema.
        </p>
      </div>

      <Tabs 
        defaultValue="general" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <GeneralSettingsForm 
                loading={loading.general} 
                initialData={generalSettings}
                onSuccess={refreshGeneralSettings}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
            </CardHeader>
            <CardContent>
              <EmailSettingsForm 
                loading={loading.email} 
                initialData={emailSettings}
                onSuccess={refreshEmailSettings}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <FeaturesSettingsForm 
                loading={loading.features} 
                initialData={featureSettings}
                onSuccess={refreshFeatureSettings}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
