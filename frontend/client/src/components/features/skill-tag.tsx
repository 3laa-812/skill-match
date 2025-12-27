import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Skill } from "@shared/schema";

interface SkillTagProps {
  skill: Skill;
  onRemove?: (skillId: string) => void;
  isMatched?: boolean;
  index?: number;
}

export function SkillTag({ skill, onRemove, isMatched = false, index = 0 }: SkillTagProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
    >
      <Badge
        variant={isMatched ? "default" : "secondary"}
        className={`gap-1 ${onRemove ? "pr-1" : ""}`}
        data-testid={`badge-skill-${skill.id}`}
      >
        {skill.name}
        {onRemove && (
          <button
            onClick={() => onRemove(skill.id)}
            className="ml-1 rounded-full p-0.5 hover:bg-background/20 transition-colors"
            data-testid={`button-remove-skill-${skill.id}`}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </Badge>
    </motion.div>
  );
}
