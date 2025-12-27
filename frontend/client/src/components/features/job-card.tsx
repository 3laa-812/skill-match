import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin, Clock, DollarSign, Building2, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JobWithSkills } from "@shared/schema";

interface JobCardProps {
  job: JobWithSkills;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-200" data-testid={`card-job-${job.id}`}>
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-lg truncate" data-testid={`text-job-title-${job.id}`}>
                {job.title}
              </h3>
              {job.remote && (
                <Badge variant="secondary" className="gap-1">
                  <Wifi className="w-3 h-3" />
                  Remote
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-sm flex-wrap">
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
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm line-clamp-2" data-testid={`text-job-description-${job.id}`}>
            {job.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm flex-wrap">
            {job.salary && (
              <span className="flex items-center gap-1 text-foreground">
                <DollarSign className="w-4 h-4 text-accent-foreground" />
                {job.salary}
              </span>
            )}
            {job.jobType && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {job.jobType}
              </span>
            )}
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 4).map((skill) => (
                <Badge key={skill.id} variant="outline" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
              {job.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 4} more
                </Badge>
              )}
            </div>
          )}

          <div className="pt-2">
            <Link href={`/jobs/${job.id}`}>
              <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-job-${job.id}`}>
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
