import { useGetState } from "@workspace/api-client-react";
import { Card, Button, Badge } from "@/components/ui/common";
import { Settings2 } from "lucide-react";

export default function Vehicles() {
  const { data: state } = useGetState();

  if (!state) return <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  // Flatten all vehicles from players
  const allVehicles = state.players.flatMap(p => 
    (p.vehicles || []).map(v => ({ ...v, owner: p }))
  );

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium">رقم اللوحة</th>
                <th className="px-6 py-4 font-medium">المركبة</th>
                <th className="px-6 py-4 font-medium">الكراج</th>
                <th className="px-6 py-4 font-medium">الحالة</th>
                <th className="px-6 py-4 font-medium">المالك</th>
                <th className="px-6 py-4 font-medium text-center">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allVehicles.map((v, i) => (
                <tr key={`${v.plate}-${i}`} className="hover:bg-secondary/30 transition">
                  <td className="px-6 py-4 font-mono font-bold text-primary">{v.plate}</td>
                  <td className="px-6 py-4 font-bold capitalize">{v.model}</td>
                  <td className="px-6 py-4 text-muted-foreground">{v.garage}</td>
                  <td className="px-6 py-4">
                    {v.state === 'in' ? (
                      <Badge variant="success">داخل الكراج</Badge>
                    ) : (
                      <Badge variant="warning">خارج الكراج</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{v.owner.avatar || '👤'}</span>
                      <span className="font-bold">{v.owner.nickname}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings2 size={14} />
                      تعديل
                    </Button>
                  </td>
                </tr>
              ))}
              {allVehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">لا يوجد مركبات مسجلة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
