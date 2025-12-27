import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Target, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MatchCard } from "@/components/features/match-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { JobMatch, UserWithSkills } from "@shared/schema";

export default function Matching() {
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery<UserWithSkills>({
    queryKey: ["/api/users/me"],
  });

  const { data: matches, isLoading: matchesLoading, error: matchesError } = useQuery<JobMatch[]>({
    queryKey: ["/api/matching"],
  });

  const userSkills = profile?.skills || [];
  const hasSkills = userSkills.length > 0;

  const matchesArray = Array.isArray(matches) ? matches : (matches && Array.isArray((matches as any).jobs) ? (matches as any).jobs : []);
  const userSkillNames = userSkills.map((s: any) => String(s.name || "").toLowerCase()).filter(Boolean);
  const normalizedMatches: JobMatch[] = matchesArray.map((m: any, idx: number) => {
    const jobSkillsRaw = Array.isArray(m.skills) ? m.skills : [];
    const jobSkills =
      jobSkillsRaw.length > 0 && typeof jobSkillsRaw[0] === "string"
        ? jobSkillsRaw.map((s: string, i: number) => ({ id: `skill-${idx}-${i}-${s}`, name: s }))
        : jobSkillsRaw;
    const matchedSkills = jobSkills.filter((s: any) => userSkillNames.includes(String(s.name || "").toLowerCase()));
    const computedPercentage = jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 0;
    const matchPercentage = typeof m.matchPercentage === "number" ? m.matchPercentage : computedPercentage;
    return {
      ...m,
      id: m.id ?? m._id ?? `job-${idx}-${m.title ?? "unknown"}`,
      skills: jobSkills,
      matchedSkills,
      matchPercentage,
    } as JobMatch;
  });
  const excellentMatches = normalizedMatches.filter((m) => m.matchPercentage >= 80);
  const goodMatches = normalizedMatches.filter((m) => m.matchPercentage >= 50 && m.matchPercentage < 80);
  const partialMatches = normalizedMatches.filter((m) => m.matchPercentage < 50);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(profileError || matchesError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>هناك مشكلة في تحميل البيانات</AlertTitle>
            <AlertDescription>
              {String(profileError || matchesError)}
            </AlertDescription>
          </Alert>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" data-testid="text-matching-title">
            Job Matches
          </h1>
          <p className="text-muted-foreground">
            Jobs that match your skills, sorted by compatibility.
          </p>
        </motion.div>

        {!hasSkills && !profileLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent className="py-16 text-center">
                <Zap className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" />
                <h3 className="text-xl font-semibold mb-2">Add Skills to See Matches</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  To see personalized job matches, you need to add skills to your profile first.
                </p>
                <Link href="/skills">
                  <Button data-testid="button-add-skills-from-matching">
                    Add Your Skills
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Excellent Matches</p>
                      {matchesLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="text-excellent-matches-count">
                            {excellentMatches.length}
                          </p>
                          <p className="text-xs text-muted-foreground">80%+ match</p>
                        </>
                      )}
                    </div>
                    <div className="p-3 rounded-md bg-green-100 dark:bg-green-900/30">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Good Matches</p>
                      {matchesLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400" data-testid="text-good-matches-count">
                            {goodMatches.length}
                          </p>
                          <p className="text-xs text-muted-foreground">50-79% match</p>
                        </>
                      )}
                    </div>
                    <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                      <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Partial Matches</p>
                      {matchesLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-muted-foreground" data-testid="text-partial-matches-count">
                            {partialMatches.length}
                          </p>
                          <p className="text-xs text-muted-foreground">Below 50% match</p>
                        </>
                      )}
                    </div>
                    <div className="p-3 rounded-md bg-muted">
                      <AlertCircle className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {matchesLoading ? (
              <div className="space-y-8">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            ) : normalizedMatches.length > 0 ? (
              <div className="space-y-8">
                {excellentMatches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Excellent Matches
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {excellentMatches.map((match, index) => (
                        <MatchCard key={match.id} match={match} index={index} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {goodMatches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      Good Matches
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {goodMatches.map((match, index) => (
                        <MatchCard key={match.id} match={match} index={index} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {partialMatches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                      Partial Matches
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {partialMatches.map((match, index) => (
                        <MatchCard key={match.id} match={match} index={index} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Card>
                  <CardContent className="py-16 text-center">
                    <Target className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" />
                    <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      We couldn't find any job matches based on your current skills.
                      Try adding more skills or check back later for new opportunities.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
