import { Card, CardContent } from "@/components/ui/common";
import { useLocation } from "wouter";

export default function Placeholder() {
  const [location] = useLocation();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">هذه الصفحة قيد التطوير ({location})</h2>
      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-64 flex items-center justify-center border-dashed">
            <span className="text-muted-foreground font-medium">محتوى تجريبي {i}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
