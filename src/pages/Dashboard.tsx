import { useGetState } from "@workspace/api-client-react";
import { Card, Button, CardContent } from "@/components/ui/common";
import { Users, Car, HeartHandshake, ShieldAlert } from "lucide-react";

export default function Dashboard() {
  const { data: state } = useGetState();
  
  if (!state) return <div className="p-8 text-center text-muted-foreground animate-pulse">جاري التحميل...</div>;

  const onlinePlayers = state.players.filter(p => p.status === 'online');

  return (
    <div className="space-y-6">
      
      {/* Row 1: 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Welcome Box */}
        <Card className="bg-gradient-to-br from-primary to-purple2 border-transparent text-white overflow-hidden relative">
          <CardContent className="p-6 h-full flex flex-col justify-center relative z-10">
            <h2 className="text-2xl font-black mb-2">مرحباً بك في Ms!</h2>
            <p className="text-white/80 text-sm">لوحة تحكم الإدارة الشاملة</p>
          </CardContent>
          <div className="absolute left-0 bottom-0 opacity-20 transform translate-y-1/4 -translate-x-1/4">
            <ShieldAlert size={120} />
          </div>
        </Card>

        {/* Players Stat */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue/20 text-blue flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">عدد اللاعبين</p>
              <h3 className="text-2xl font-black">{state.stats.players}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Stat */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-warning/20 text-warning flex items-center justify-center">
              <Car size={24} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">المركبات المسجلة</p>
              <h3 className="text-2xl font-black">{state.stats.weapons * 4}</h3> {/* Mocked stat */}
            </div>
          </CardContent>
        </Card>

        {/* Suggestions Box */}
        <Card className="border-dashed border-2 border-primary/50 bg-primary/5">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
            <HeartHandshake className="text-primary" size={32} />
            <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/20">
              لديك إقتراحات تطورنا؟
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* Row 2: Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Jobs distribution */}
        <Card className="lg:col-span-1">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold">توزيع الوظائف</h3>
          </div>
          <CardContent className="p-6 space-y-4">
            {['police', 'ambulance', 'mechanic', 'taxi'].map((job) => {
              const count = state.players.filter(p => p.job === job).length;
              return (
                <div key={job} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">{job}</span>
                  <span className="font-bold bg-secondary px-2 py-1 rounded text-xs">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Smuggled Weapons */}
        <Card className="lg:col-span-2">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold">أحدث الأسلحة المعدلة</h3>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="bg-secondary/50 text-muted-foreground">
                  <th className="px-6 py-4 font-medium">السلاح</th>
                  <th className="px-6 py-4 font-medium">السيريال</th>
                  <th className="px-6 py-4 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {state.weapons.slice(0, 5).map(w => (
                  <tr key={w.id} className="hover:bg-secondary/30 transition">
                    <td className="px-6 py-4 font-bold">{w.weapon}</td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">{w.serial}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(w.date).toLocaleDateString('ar-SA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Online Players */}
        <Card className="lg:col-span-1">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="font-bold">المتصلين</h3>
            <span className="bg-success/20 text-success px-2 py-1 rounded text-xs font-bold">{onlinePlayers.length}</span>
          </div>
          <div className="p-4 space-y-3">
            {onlinePlayers.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-secondary/50 rounded-lg transition">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-lg">
                  {p.avatar || '👤'}
                </div>
                <div>
                  <div className="text-sm font-bold">{p.nickname}</div>
                  <div className="text-xs text-muted-foreground">{p.job}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}
