import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Briefcase, Loader2, MapPin, Wifi } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobCard } from "@/components/features/job-card";
import type { JobWithSkills } from "@shared/schema";

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobType, setJobType] = useState<string>("all");
  const [remoteFilter, setRemoteFilter] = useState<string>("all");

  const { data: jobs, isLoading } = useQuery<JobWithSkills[]>({
    queryKey: ["/api/jobs"],
  });

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = jobType === "all" || job.jobType === jobType;
    const matchesRemote = 
      remoteFilter === "all" || 
      (remoteFilter === "remote" && job.remote) ||
      (remoteFilter === "onsite" && !job.remote);

    return matchesSearch && matchesType && matchesRemote;
  }) || [];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" data-testid="text-jobs-title">
            Browse Jobs
          </h1>
          <p className="text-muted-foreground">
            Discover opportunities that match your skills and interests.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs, companies, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-jobs"
                  />
                </div>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="w-full sm:w-[160px]" data-testid="select-job-type">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={remoteFilter} onValueChange={setRemoteFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]" data-testid="select-remote-filter">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote Only</SelectItem>
                    <SelectItem value="onsite">On-site Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground" data-testid="text-jobs-count">
            {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
          </p>
          {(searchQuery || jobType !== "all" || remoteFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setJobType("all");
                setRemoteFilter("all");
              }}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent className="py-16 text-center">
                <Briefcase className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" />
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchQuery || jobType !== "all" || remoteFilter !== "all"
                    ? "Try adjusting your filters or search terms."
                    : "No jobs are available at the moment. Check back soon!"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
