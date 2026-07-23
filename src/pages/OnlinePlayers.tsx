import { useGetState } from "@workspace/api-client-react";
import { Card, Button, Badge } from "@/components/ui/common";
import { Settings2, Flag, Video } from "lucide-react";
import { Link } from "wouter";

export default function OnlinePlayers() {
  const { data: state } = useGetState();

  if (!state) return <div className="p-8 text-center text-muted-foreground animate-pulse">جاري التحميل...</div>;

  const onlinePlayers = state.players.filter(p => p.status === 'online');

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center bg-panel p-4 rounded-lg border border-border">
        <h2 className="text-xl font-bold">اللاعبين المتصلين</h2>
        <Badge variant="success" className="text-sm px-3 py-1">{onlinePlayers.length} متصل</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {onlinePlayers.map(p => (
          <Card key={p.id} className="flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
            {/* Top decorative gradient */}
            <div className="h-1 w-full bg-gradient-to-r from-success to-transparent absolute top-0 left-0" />
            
            <div className="p-5 flex gap-4 items-start border-b border-border bg-secondary/10">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl shadow-inner border border-border">
                {p.avatar || '👤'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg truncate">{p.nickname}</h3>
                  <Badge variant="outline" className="font-mono bg-background">ID: {p.id}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{p.character || p.nickname}</p>
                <div className="text-xs text-muted-foreground mt-1 truncate" dir="ltr">
                  {p.discord || 'لا يوجد دسكورد'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-background flex justify-between gap-2 mt-auto">
              <Link href={`/player-admin?id=${p.id}`} className="flex-1">
                <Button variant="secondary" className="w-full gap-2 text-xs h-9">
                  <Settings2 size={14} /> إدارة
                </Button>
              </Link>
              <Button variant="outline" className="w-10 h-9 p-0 text-muted-foreground hover:text-primary">
                <Flag size={14} />
              </Button>
              <Button variant="outline" className="w-10 h-9 p-0 text-muted-foreground hover:text-success">
                <Video size={14} />
              </Button>
            </div>
          </Card>
        ))}

        {onlinePlayers.length === 0 && (
          <div className="col-span-full p-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
            لا يوجد لاعبين متصلين حالياً
          </div>
        )}
      </div>

    </div>
  );
}
