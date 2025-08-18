import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
}

export const MetricCard = ({ title, value, icon: Icon, iconColor = "text-primary" }: MetricCardProps) => {
  return (
    <Card className="p-6 bg-metric-card border-metric-card-border hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-accent ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};