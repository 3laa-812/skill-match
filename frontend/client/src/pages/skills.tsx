import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Zap, Loader2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkillTag } from "@/components/features/skill-tag";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Skill, UserWithSkills } from "@shared/schema";

const addSkillSchema = z.object({
  skillId: z.string().min(1, "Please select a skill"),
});

type AddSkillInput = z.infer<typeof addSkillSchema>;

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery<UserWithSkills>({
    queryKey: ["/api/users/me"],
  });

  const { data: allSkills, isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const userSkills = profile?.skills || [];
  const availableSkills = allSkills?.filter(
    (skill) => !userSkills.find((us) => us.id === skill.id)
  ) || [];

  const filteredAvailableSkills = availableSkills.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const form = useForm<AddSkillInput>({
    resolver: zodResolver(addSkillSchema),
    defaultValues: {
      skillId: "",
    },
  });

  const updateSkillsMutation = useMutation({
    mutationFn: async (newSkills: string[]) => {
      const response = await apiRequest("PUT", "/api/users/skills", { skills: newSkills });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matching"] });
      form.reset();
      toast({
        title: "Skills updated!",
        description: "Your profile has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update skills",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddSkillInput) => {
    const currentSkillIds = userSkills.map(s => s.id);
    updateSkillsMutation.mutate([...currentSkillIds, data.skillId]);
  };

  const handleRemoveSkill = (skillId: string) => {
    const currentSkillIds = userSkills.map(s => s.id);
    const newSkillIds = currentSkillIds.filter(id => id !== skillId);
    updateSkillsMutation.mutate(newSkillIds);
  };

  if (profileLoading || skillsLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" data-testid="text-skills-title">
            Manage Your Skills
          </h1>
          <p className="text-muted-foreground">
            Add and manage your skills to get better job matches.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Add a Skill</CardTitle>
                <CardDescription>
                  Select from available skills to add to your profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="skillId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Skill</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-skill">
                                <SelectValue placeholder="Choose a skill..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredAvailableSkills.length > 0 ? (
                                filteredAvailableSkills.map((skill) => (
                                  <SelectItem key={skill.id} value={skill.id}>
                                    {skill.name}
                                    {skill.category && (
                                      <span className="text-muted-foreground ml-2">
                                        ({skill.category})
                                      </span>
                                    )}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="p-2 text-sm text-muted-foreground text-center">
                                  No more skills available
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={updateSkillsMutation.isPending || availableSkills.length === 0}
                      data-testid="button-add-skill"
                    >
                      {updateSkillsMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Skill
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Your Skills
                  <span className="text-sm font-normal text-muted-foreground">
                    ({userSkills.length})
                  </span>
                </CardTitle>
                <CardDescription>
                  Click the X button to remove a skill from your profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence mode="popLayout">
                      {userSkills.map((skill, index) => (
                        <SkillTag
                          key={skill.id}
                          skill={skill}
                          onRemove={handleRemoveSkill}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Zap className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      You haven't added any skills yet.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add skills to improve your job matches.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Browse All Skills</CardTitle>
              <CardDescription>
                Explore the complete list of skills you can add to your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-skills"
                />
              </div>
              {availableSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {filteredAvailableSkills.map((skill, index) => (
                    <motion.button
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02, duration: 0.2 }}
                      onClick={() => {
                        const currentSkillIds = userSkills.map(s => s.id);
                        const isAdded = currentSkillIds.includes(skill.id);
                        if (!isAdded) {
                          updateSkillsMutation.mutate([...currentSkillIds, skill.id]);
                        }
                      }}
                      disabled={updateSkillsMutation.isPending}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted/50 text-sm hover-elevate active-elevate-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid={`button-quick-add-${skill.id}`}
                    >
                      <Plus className="w-3 h-3" />
                      {skill.name}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  You've added all available skills!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
