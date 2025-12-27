import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin, Building2, Wifi, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { JobMatch } from "@shared/schema";

interface MatchCardProps {
  match: JobMatch;
  index?: number;
}

export function MatchCard({ match, index = 0 }: MatchCardProps) {
  const matchColor = match.matchPercentage >= 80 
    ? "text-green-600 dark:text-green-400" 
    : match.matchPercentage >= 50 
    ? "text-yellow-600 dark:text-yellow-400" 
    : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-200" data-testid={`card-match-${match.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-lg truncate">{match.title}</h3>
                {match.remote && (
                  <Badge variant="secondary" className="gap-1">
                    <Wifi className="w-3 h-3" />
                    Remote
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm flex-wrap">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {match.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {match.location}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${matchColor}`} data-testid={`text-match-percentage-${match.id}`}>
                {match.matchPercentage}%
              </div>
              <div className="text-xs text-muted-foreground">Match</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Skills Match</span>
              <span className={matchColor}>{match.matchedSkills.length} of {match.skills.length}</span>
            </div>
            <Progress value={match.matchPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Matched Skills</p>
            <div className="flex flex-wrap gap-2">
              {match.matchedSkills.map((skill) => (
                <Badge key={skill.id} variant="default" className="gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  {skill.name}
                </Badge>
              ))}
              {match.matchedSkills.length === 0 && (
                <span className="text-xs text-muted-foreground">No skills matched yet</span>
              )}
            </div>
          </div>

          {match.skills.filter(s => !match.matchedSkills.find(m => m.id === s.id)).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Skills to Learn</p>
              <div className="flex flex-wrap gap-2">
                {match.skills
                  .filter(s => !match.matchedSkills.find(m => m.id === s.id))
                  .slice(0, 3)
                  .map((skill) => (
                    <Badge key={skill.id} variant="outline" className="text-xs">
                      {skill.name}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link href={`/jobs/${match.id}`}>
              <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-match-${match.id}`}>
                View Job Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
