import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const expertSchema = z.object({
  expert_name: z.string().min(2, "Expert name must be at least 2 characters"),
  full_name: z.string().optional(),
  expertise_area: z.string().optional(),
  experience_years: z.coerce.number().min(0).optional(),
  bio: z.string().optional(),
  is_in_core_group: z.boolean().default(false),
  starting_ref_id: z.coerce.number().optional(),
});

type ExpertFormValues = z.infer<typeof expertSchema>;

interface ExpertFormProps {
  expert?: {
    id: string;
    expert_name: string;
    full_name: string | null;
    expertise_area: string | null;
    experience_years: number | null;
    bio: string | null;
    is_in_core_group: boolean;
    starting_ref_id: number | null;
  };
  onSuccess: () => void;
}

export function ExpertForm({ expert, onSuccess }: ExpertFormProps) {
  const { toast } = useToast();
  const form = useForm<ExpertFormValues>({
    resolver: zodResolver(expertSchema),
    defaultValues: {
      expert_name: expert?.expert_name || "",
      full_name: expert?.full_name || "",
      expertise_area: expert?.expertise_area || "",
      experience_years: expert?.experience_years || undefined,
      bio: expert?.bio || "",
      is_in_core_group: expert?.is_in_core_group || false,
      starting_ref_id: expert?.starting_ref_id || undefined,
    },
  });

  async function onSubmit(data: ExpertFormValues) {
    try {
      if (expert) {
        const { error } = await supabase
          .from("experts")
          .update(data)
          .eq("id", expert.id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Expert updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("experts")
          .insert([{
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Expert created successfully",
        });
      }
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error saving expert:", error);
      toast({
        title: "Error",
        description: "Failed to save expert",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="expert_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expert Name*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expertise_area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area of Expertise</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience_years"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_in_core_group"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4"
                />
              </FormControl>
              <FormLabel className="mt-0">Core Group Member</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="starting_ref_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Reference ID</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {expert ? "Update Expert" : "Add Expert"}
        </Button>
      </form>
    </Form>
  );
}