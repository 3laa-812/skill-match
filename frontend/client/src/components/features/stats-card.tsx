import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  index?: number;
  loading?: boolean;
}

export function StatsCard({ title, value, description, icon: Icon, index = 0, loading = false }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card data-testid={`card-stats-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{title}</p>
              {loading ? (
                <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
              ) : (
                <p className="text-3xl font-bold" data-testid={`text-stats-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {value}
                </p>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="p-3 rounded-md bg-primary/10">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
