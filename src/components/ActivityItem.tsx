interface ActivityItemProps {
  description: string;
  timestamp: string;
}

export const ActivityItem = ({ description, timestamp }: ActivityItemProps) => {
  return (
    <div className="flex items-start space-x-3 p-3">
      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
      <div className="flex-1">
        <p className="text-sm text-card-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
      </div>
    </div>
  );
};