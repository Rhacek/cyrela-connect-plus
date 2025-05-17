
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  brokerSettingsService, 
  BrokerProfileSettings,
  BrokerNotificationSettings
} from "@/services/broker-settings.service";
import { toast } from "sonner";
import { ProfileSettingsForm } from "@/components/broker/settings/ProfileSettingsForm";
import { NotificationSettingsForm } from "@/components/broker/settings/NotificationSettingsForm";

const BrokerSettings = () => {
  const [loading, setLoading] = useState({
    profile: true,
    notifications: true
  });
  
  const [activeTab, setActiveTab] = useState("profile");
  const [profileSettings, setProfileSettings] = useState<BrokerProfileSettings | undefined>();
  const [notificationSettings, setNotificationSettings] = useState<BrokerNotificationSettings | undefined>();

  // Load profile settings
  useEffect(() => {
    const loadProfileSettings = async () => {
      try {
        setLoading((prev) => ({ ...prev, profile: true }));
        const settings = await brokerSettingsService.getBrokerProfileSettings();
        setProfileSettings(settings);
      } catch (error) {
        console.error("Erro ao carregar configurações de perfil:", error);
        toast.error("Erro ao carregar configurações de perfil");
      } finally {
        setLoading((prev) => ({ ...prev, profile: false }));
      }
    };

    loadProfileSettings();
  }, []);

  // Load notification settings
  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        setLoading((prev) => ({ ...prev, notifications: true }));
        const settings = await brokerSettingsService.getBrokerNotificationSettings();
        setNotificationSettings(settings);
      } catch (error) {
        console.error("Erro ao carregar configurações de notificações:", error);
        toast.error("Erro ao carregar configurações de notificações");
      } finally {
        setLoading((prev) => ({ ...prev, notifications: false }));
      }
    };

    loadNotificationSettings();
  }, []);

  const refreshProfileSettings = async () => {
    try {
      const settings = await brokerSettingsService.getBrokerProfileSettings();
      setProfileSettings(settings);
    } catch (error) {
      console.error("Erro ao atualizar configurações de perfil:", error);
    }
  };

  const refreshNotificationSettings = async () => {
    try {
      const settings = await brokerSettingsService.getBrokerNotificationSettings();
      setNotificationSettings(settings);
    } catch (error) {
      console.error("Erro ao atualizar configurações de notificações:", error);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas preferências de perfil e notificações.
        </p>
      </div>

      <Tabs 
        defaultValue="profile" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileSettingsForm 
                loading={loading.profile} 
                initialData={profileSettings}
                onSuccess={refreshProfileSettings}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationSettingsForm 
                loading={loading.notifications} 
                initialData={notificationSettings}
                onSuccess={refreshNotificationSettings}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrokerSettings;
