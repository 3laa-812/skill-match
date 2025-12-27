import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, Clock, DollarSign, Building2, Wifi, ArrowLeft, 
  Calendar, Briefcase, CheckCircle2, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { JobWithSkills } from "@shared/schema";

export default function JobDetails() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;

  const { data: job, isLoading } = useQuery<JobWithSkills>({
    queryKey: ["/api/jobs", jobId],
    enabled: !!jobId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-16 text-center">
              <Briefcase className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" />
              <h3 className="text-xl font-semibold mb-2">Job Not Found</h3>
              <p className="text-muted-foreground mb-6">
                The job you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/jobs">
                <Button data-testid="button-back-to-jobs">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
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
        >
          <Link href="/jobs">
            <Button variant="ghost" size="sm" className="mb-6 gap-2" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Button>
          </Link>

          <Card data-testid={`card-job-details-${job.id}`}>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-2xl" data-testid="text-job-detail-title">
                      {job.title}
                    </CardTitle>
                    {job.remote && (
                      <Badge variant="secondary" className="gap-1">
                        <Wifi className="w-3 h-3" />
                        Remote
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                  </div>
                </div>
                <Button size="lg" data-testid="button-apply-job">
                  Apply Now
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 py-4 border-y border-border">
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Salary</p>
                      <p className="font-medium" data-testid="text-job-salary">{job.salary}</p>
                    </div>
                  </div>
                )}
                {job.jobType && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium capitalize" data-testid="text-job-type">{job.jobType}</p>
                    </div>
                  </div>
                )}
                {job.postedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Posted</p>
                      <p className="font-medium" data-testid="text-job-posted">
                        {new Date(job.postedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-job-full-description">
                    {job.description}
                  </p>
                </div>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill.id} variant="outline" className="gap-1" data-testid={`badge-required-skill-${skill.id}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-sm text-muted-foreground">
                  Interested in this position? Apply now to get started.
                </p>
                <Button size="lg" data-testid="button-apply-job-bottom">
                  Apply for this Job
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
