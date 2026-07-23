import { useGetState } from "@workspace/api-client-react";
import { Card, Button, Badge } from "@/components/ui/common";
import { Swords, Settings2 } from "lucide-react";
import { Link } from "wouter";

export default function Gangs() {
  const { data: state } = useGetState();

  if (!state) return <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  const gangMembers = state.players.filter(p => p.gang && p.gang !== 'لا يوجد');

  return (
    <div className="space-y-8">
      
      {/* Gang Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {(state.gangs || []).map((g, i) => (
          <Card key={i} className="bg-secondary/20 border-border hover:bg-secondary/40 transition flex flex-col items-center justify-center p-4 gap-2">
            <Swords className="text-primary mb-1" size={24} />
            <span className="font-bold text-sm text-center">{g.name}</span>
            <Badge variant="outline" className="bg-background">{g.members} عضو</Badge>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-panel">
          <h3 className="font-bold">أعضاء العصابات ({gangMembers.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium">رقم الهوية</th>
                <th className="px-6 py-4 font-medium">اسم اللاعب</th>
                <th className="px-6 py-4 font-medium">العصابة</th>
                <th className="px-6 py-4 font-medium">الرتبة</th>
                <th className="px-6 py-4 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {gangMembers.map(p => (
                <tr key={p.id} className="hover:bg-secondary/30 transition">
                  <td className="px-6 py-4 font-bold">#{p.id}</td>
                  <td className="px-6 py-4 flex items-center gap-2 font-bold">
                    <span className="text-lg">{p.avatar || '👤'}</span>
                    {p.nickname}
                  </td>
                  <td className="px-6 py-4 text-primary font-bold">{p.gang}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.gangRank || 'عضو'}</td>
                  <td className="px-6 py-4 text-center">
                    <Link href={`/player-admin?id=${p.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Settings2 size={14} />
                        إدارة
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {gangMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">لا يوجد أعضاء عصابات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
