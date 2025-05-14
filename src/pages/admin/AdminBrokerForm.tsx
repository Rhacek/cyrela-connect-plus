
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  brokerCode: z.string().min(1, "Código do corretor é obrigatório"),
  brokerage: z.string().min(1, "Imobiliária é obrigatória"),
  status: z.enum(["active", "inactive"]),
});

const mockBrokers = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@cyrela.com.br",
    phone: "(11) 99876-5432",
    brokerCode: "BR001",
    brokerage: "Cyrela Imóveis",
    status: "active",
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@cyrela.com.br",
    phone: "(11) 98765-4321",
    brokerCode: "BR002",
    brokerage: "Cyrela Lançamentos",
    status: "active",
  },
];

const AdminBrokerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      brokerCode: "",
      brokerage: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      const broker = mockBrokers.find(b => b.id === id);
      if (broker) {
        form.reset({
          name: broker.name,
          email: broker.email,
          phone: broker.phone,
          brokerCode: broker.brokerCode,
          brokerage: broker.brokerage,
          status: broker.status as "active" | "inactive",
        });
      }
    }
  }, [id, isEditing, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success(
      isEditing 
        ? "Corretor atualizado com sucesso!" 
        : "Corretor cadastrado com sucesso!"
    );
    navigate("/admin/brokers");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Editar Corretor" : "Novo Corretor"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditing 
            ? "Atualize as informações do corretor conforme necessário." 
            : "Preencha as informações para cadastrar um novo corretor."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do corretor" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="email@exemplo.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(00) 00000-0000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brokerCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código do Corretor</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: BR001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brokerage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imobiliária</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome da imobiliária" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/brokers")}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Atualizar Corretor" : "Cadastrar Corretor"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminBrokerForm;
