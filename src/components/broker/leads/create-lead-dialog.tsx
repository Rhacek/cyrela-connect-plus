
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadStatus } from "@/types";
import { useAuth } from "@/context/auth-context";
import { leadsService } from "@/services/leads.service";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Create lead form schema
const createLeadSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }),
  status: z.nativeEnum(LeadStatus, { 
    required_error: "Selecione um status" 
  }),
  source: z.string().min(2, { message: "Informe a origem do lead" }),
  notes: z.string().optional(),
});

type CreateLeadFormValues = z.infer<typeof createLeadSchema>;

interface CreateLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadCreated: () => void;
}

export function CreateLeadDialog({ open, onOpenChange, onLeadCreated }: CreateLeadDialogProps) {
  const { session } = useAuth();
  const form = useForm<CreateLeadFormValues>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: LeadStatus.NEW,
      source: "Manual",
      notes: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: CreateLeadFormValues) => {
    if (!session?.id) {
      toast.error("Você precisa estar logado para criar um lead");
      return;
    }

    try {
      const newLead = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        status: values.status,
        source: values.source,
        notes: values.notes || "",
        isManual: true,
        createdById: session.id,
        assignedToId: session.id,
      };

      const createdLead = await leadsService.createLead(newLead);
      
      if (createdLead) {
        toast.success("Lead criado com sucesso");
        form.reset();
        onOpenChange(false);
        onLeadCreated();
      } else {
        toast.error("Erro ao criar lead. Tente novamente.");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Erro ao criar lead. Tente novamente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo lead. Todos os campos com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
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
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 98765-4321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={LeadStatus.NEW}>Novo</SelectItem>
                        <SelectItem value={LeadStatus.CONTACTED}>Contatado</SelectItem>
                        <SelectItem value={LeadStatus.INTERESTED}>Interessado</SelectItem>
                        <SelectItem value={LeadStatus.SCHEDULED}>Agendado</SelectItem>
                        <SelectItem value={LeadStatus.VISITED}>Visitou</SelectItem>
                        <SelectItem value={LeadStatus.CONVERTED}>Convertido</SelectItem>
                        <SelectItem value={LeadStatus.LOST}>Perdido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origem *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Site, Indicação, Ligação" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre o lead..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar Lead"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
