import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpertForm } from "@/components/experts/ExpertForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Expert {
  id: string;
  expert_name: string;
  full_name: string | null;
  expertise_area: string | null;
  experience_years: number | null;
  bio: string | null;
  is_in_core_group: boolean;
  starting_ref_id: number | null;
}

export default function Experts() {
  console.log("Experts component rendering");
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const fetchExperts = async () => {
    try {
      console.log("Fetching experts...");
      
      const { data, error } = await supabase
        .from('experts')
        .select(`
          id,
          expert_name,
          full_name,
          email_address,
          expertise_area,
          experience_years,
          bio,
          is_in_core_group,
          starting_ref_id
        `)
        .order('expert_name');

      console.log("Experts query result:", { data, error });

      if (error) throw error;
      setExperts(data || []);
    } catch (error) {
      console.error("Error fetching experts:", error);
      toast({
        title: "Error",
        description: "Failed to load experts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleFormSuccess = () => {
    setShowAddForm(false);
    fetchExperts();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Our Experts</h1>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : "Add Expert"}
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Expert</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpertForm onSuccess={handleFormSuccess} />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experts.map((expert) => (
            <Card key={expert.id}>
              <CardHeader>
                <CardTitle className="text-xl">{expert.expert_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expert.full_name && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Full Name:</span> {expert.full_name}
                    </p>
                  )}
                  {expert.expertise_area && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Expertise:</span> {expert.expertise_area}
                    </p>
                  )}
                  {expert.experience_years && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Experience:</span> {expert.experience_years} years
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}