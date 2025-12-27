import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Zap, Target, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/features/stats-card";
import { JobCard } from "@/components/features/job-card";
import { SkillTag } from "@/components/features/skill-tag";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getStoredUser, getAuthHeaders } from "@/lib/auth";
import type { UserWithSkills, JobWithSkills, JobMatch } from "@shared/schema";

export default function Dashboard() {
  const storedUser = getStoredUser();

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery<UserWithSkills>({
    queryKey: ["/api/users/me"],
  });

  const { data: recentJobs, isLoading: jobsLoading, error: jobsError } = useQuery<JobWithSkills[]>({
    queryKey: ["/api/jobs"],
  });

  const { data: matches, isLoading: matchesLoading, error: matchesError } = useQuery<JobMatch[]>({
    queryKey: ["/api/matching"],
  });

  const user = profile || storedUser;
  const userSkills = profile?.skills || [];
  const topMatches = Array.isArray(matches) ? matches.slice(0, 3) : [];
  const latestJobs = recentJobs?.slice(0, 2) || [];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(profileError || jobsError || matchesError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>هناك مشكلة في تحميل البيانات</AlertTitle>
            <AlertDescription>
              {String(profileError || jobsError || matchesError)}
            </AlertDescription>
          </Alert>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-welcome">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your job matching journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Your Skills"
            value={userSkills.length}
            description="Skills in your profile"
            icon={Zap}
            index={0}
            loading={profileLoading}
          />
          <StatsCard
            title="Job Matches"
            value={Array.isArray(matches) ? matches.length : 0}
            description="Based on your skills"
            icon={Target}
            index={1}
            loading={matchesLoading}
          />
          <StatsCard
            title="Available Jobs"
            value={recentJobs?.length || 0}
            description="Open positions"
            icon={Briefcase}
            index={2}
            loading={jobsLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Your Skills</CardTitle>
                    <CardDescription>
                      Skills that define your expertise
                    </CardDescription>
                  </div>
                  <Link href="/skills">
                    <Button size="sm" className="gap-2" data-testid="button-manage-skills">
                      <Plus className="w-4 h-4" />
                      Manage
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {profileLoading ? (
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  ) : userSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userSkills.map((skill, index) => (
                        <SkillTag key={skill.id} skill={skill} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Zap className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground mb-4">
                        You haven't added any skills yet.
                      </p>
                      <Link href="/skills">
                        <Button size="sm" data-testid="button-add-first-skill">
                          Add Your First Skill
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold">Latest Jobs</h2>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm" className="gap-2" data-testid="link-view-all-jobs">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              {jobsLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardContent className="py-6 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-6 space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                  </Card>
                </div>
              ) : latestJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {latestJobs.map((job, index) => (
                    <JobCard key={job.id} job={job} index={index} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      No jobs available at the moment.
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/skills">
                    <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-quick-add-skills">
                      <Zap className="w-4 h-4" />
                      Add Skills
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-quick-browse-jobs">
                      <Briefcase className="w-4 h-4" />
                      Browse Jobs
                    </Button>
                  </Link>
                  <Link href="/matching">
                    <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-quick-view-matches">
                      <Target className="w-4 h-4" />
                      View Matches
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle className="text-lg">Top Matches</CardTitle>
                  <Link href="/matching">
                    <Button variant="ghost" size="sm" className="gap-1" data-testid="link-view-all-matches">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {matchesLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : topMatches.length > 0 ? (
                    <div className="space-y-3">
                      {topMatches.map((match) => (
                        <Link key={match.id} href={`/jobs/${match.id}`}>
                          <div className="p-3 rounded-md bg-muted/50 hover-elevate cursor-pointer" data-testid={`card-top-match-${match.id}`}>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="font-medium text-sm truncate">{match.title}</p>
                              <span className="text-sm font-semibold text-primary">
                                {match.matchPercentage}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {match.company}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Add skills to see job matches
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
