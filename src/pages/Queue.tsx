import { useGetState } from "@workspace/api-client-react";
import { Card, Button, Badge } from "@/components/ui/common";
import { UserMinus } from "lucide-react";

export default function Queue() {
  const { data: state } = useGetState();

  if (!state) return <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center bg-panel p-4 rounded-lg border border-border">
        <div>
          <h2 className="text-xl font-bold mb-1">إدارة الإنتظار</h2>
          <p className="text-sm text-muted-foreground">اللاعبين في طابور الدخول للسيرفر</p>
        </div>
        <Badge variant="warning" className="text-sm px-3 py-1 text-black font-bold">
          {state.queue.length} في الانتظار
        </Badge>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium w-24">الترتيب</th>
                <th className="px-6 py-4 font-medium">الاسم</th>
                <th className="px-6 py-4 font-medium">الدسكورد</th>
                <th className="px-6 py-4 font-medium">وقت الانتظار</th>
                <th className="px-6 py-4 font-medium">الأولوية</th>
                <th className="px-6 py-4 font-medium text-center">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {state.queue.map((q, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition">
                  <td className="px-6 py-4 font-black text-primary text-lg">#{i + 1}</td>
                  <td className="px-6 py-4 font-bold">{q.name}</td>
                  <td className="px-6 py-4 text-muted-foreground font-mono" dir="ltr">{q.discord || '—'}</td>
                  <td className="px-6 py-4 text-warning font-mono">{q.wait || '00:00'}</td>
                  <td className="px-6 py-4">
                    {q.priority ? (
                      <Badge className="bg-purple/20 text-purple border-purple/30">مستوى {q.priority}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">عادي</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2">
                      <UserMinus size={14} /> طرد من الطابور
                    </Button>
                  </td>
                </tr>
              ))}
              {state.queue.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">الطابور فارغ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
