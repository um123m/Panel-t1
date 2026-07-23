import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useGetState, useDoPlayerAction, getGetStateQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, Button, Input, Badge } from "@/components/ui/common";
import { ActionModal } from "@/components/ui/ActionModal";
import { 
  Search, AlertTriangle, Trash2, Plus, 
  Shirt, Wallet, HeartPulse, Hammer, Send, Skull, UserCog, UserMinus, ShieldBan, MapPin, CheckCircle,
  Car,
  Settings2
} from "lucide-react";
import { toast } from "sonner";

export default function PlayerAdmin() {
  const [location, setLocation] = useLocation();
  const searchStr = useSearch();
  const queryParams = new URLSearchParams(searchStr);
  const playerIdParam = queryParams.get("id");

  const [searchId, setSearchId] = useState("");
  const { data: state } = useGetState();
  const queryClient = useQueryClient();
  const doAction = useDoPlayerAction();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    kind: string;
    title: string;
    label: string;
    placeholder: string;
  }>({ isOpen: false, kind: "", title: "", label: "", placeholder: "" });

  if (!state) return <div className="p-8 text-center">جاري التحميل...</div>;

  const player = state.players.find(p => p.id.toString() === playerIdParam);

  const handleSearch = () => {
    if (searchId) {
      setLocation(`/player-admin?id=${searchId}`);
    }
  };

  const handleAction = (kind: string, needsValue: boolean = false, title = "", label = "", placeholder = "") => {
    if (!player) return;
    if (needsValue) {
      setModalState({ isOpen: true, kind, title, label, placeholder });
    } else {
      doAction.mutate({ data: { playerId: player.id, kind } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetStateQueryKey() });
          toast.success("تم تنفيذ الإجراء بنجاح");
        }
      });
    }
  };

  const submitModal = (value: string) => {
    if (!player) return;
    doAction.mutate({ data: { playerId: player.id, kind: modalState.kind, value } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetStateQueryKey() });
        toast.success("تم تنفيذ الإجراء بنجاح");
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <Card className="p-4 flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-2.5 text-muted-foreground" size={18} />
          <Input 
            placeholder="أدخل رقم الهوية (ID)..." 
            className="pr-10"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>بحث</Button>
      </Card>

      {!player && playerIdParam && (
        <div className="p-8 text-center text-destructive font-bold bg-destructive/10 rounded-lg border border-destructive/20">
          لم يتم العثور على لاعب بهذا الـ ID
        </div>
      )}

      {player && (
        <>
          {/* Alert Bar */}
          {state.weapons.some(w => w.playerId === player.id) && (
            <div className="bg-destructive/10 border-r-4 border-destructive text-destructive p-4 rounded-md flex items-center gap-3 font-bold">
              <AlertTriangle size={20} />
              تنبيه: هذا اللاعب مشارك في عملية تعديل سلاح
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Inventory Card */}
            <Card className="flex flex-col h-[500px]">
              <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
                <h3 className="font-bold flex items-center gap-2"><Wallet size={18}/> حقيبة داخل السيرفر</h3>
                <Button size="sm" onClick={() => handleAction("give_item", true, "إعطاء عنصر", "اسم العنصر", "مثال: water")} className="gap-2">
                  <Plus size={14}/> إعطاء
                </Button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-2">
                {(player.inventory || []).map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-secondary/20 rounded-md hover:bg-secondary/40 transition">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-bold">{item.name}</span>
                      <Badge variant="outline" className="text-xs">x{item.qty}</Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/20 hover:text-destructive">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                {!(player.inventory?.length) && <div className="text-center text-muted-foreground mt-10">الحقيبة فارغة</div>}
              </div>
            </Card>

            {/* Player Info & Actions Card */}
            <Card className="flex flex-col h-[500px]">
              <div className="p-6 border-b border-border flex items-start justify-between bg-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{player.avatar || '👤'}</div>
                  <div>
                    <h2 className="text-2xl font-black">{player.nickname}</h2>
                    <p className="text-muted-foreground">{player.character}</p>
                  </div>
                </div>
                <Badge variant={player.status === 'online' ? 'success' : 'secondary'} className="px-3 py-1">
                  {player.status === 'online' ? 'متصل' : 'غير متصل'}
                </Badge>
              </div>

              <div className="p-6 flex-1 overflow-y-auto grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div><span className="text-muted-foreground block mb-1">ID</span><span className="font-bold">{player.id}</span></div>
                <div><span className="text-muted-foreground block mb-1">الهاتف</span><span className="font-bold">{player.phone || '—'}</span></div>
                <div><span className="text-muted-foreground block mb-1">Steam</span><span className="font-mono text-xs">{player.steam || '—'}</span></div>
                <div><span className="text-muted-foreground block mb-1">License</span><span className="font-mono text-xs">{player.license || '—'}</span></div>
                <div><span className="text-muted-foreground block mb-1">الوظيفة</span><span className="font-bold">{player.job || '—'}</span></div>
                <div><span className="text-muted-foreground block mb-1">الرصيد الكاش</span><span className="font-mono text-success font-bold">${(player.cash || 0).toLocaleString()}</span></div>
                <div><span className="text-muted-foreground block mb-1">الرصيد البنكي</span><span className="font-mono text-success font-bold">${(player.bank || 0).toLocaleString()}</span></div>
              </div>

              <div className="p-4 border-t border-border grid grid-cols-4 sm:grid-cols-7 gap-2 bg-secondary/20">
                <ActionBtn icon={<Shirt size={16}/>} label="الملابس" onClick={() => handleAction('clothes')} />
                <ActionBtn icon={<Wallet size={16}/>} label="إعطاء مال" onClick={() => handleAction('give_money', true, 'إعطاء مال', 'المبلغ')} />
                <ActionBtn icon={<Trash2 size={16}/>} label="سحب مال" onClick={() => handleAction('remove_money', true, 'سحب مال', 'المبلغ')} />
                <ActionBtn icon={<Hammer size={16}/>} label="إصلاح مركبة" onClick={() => handleAction('fix_car')} />
                <ActionBtn icon={<MapPin size={16}/>} label="انتقال" onClick={() => handleAction('teleport')} />
                <ActionBtn icon={<Send size={16}/>} label="إرسال رسالة" onClick={() => handleAction('message', true, 'إرسال رسالة', 'الرسالة')} />
                <ActionBtn icon={<HeartPulse size={16}/>} label="إنعاش" onClick={() => handleAction('revive')} />
                
                <ActionBtn icon={<UserCog size={16}/>} label="تغيير الرتبة" onClick={() => handleAction('change_rank', true, 'تغيير الرتبة', 'الرتبة')} />
                <ActionBtn icon={<UserCog size={16}/>} label="تغيير الوظيفة" onClick={() => handleAction('change_job', true, 'تغيير الوظيفة', 'الوظيفة')} />
                <ActionBtn icon={<CheckCircle size={16}/>} label="تصفير العصابة" onClick={() => handleAction('reset_gang')} />
                <ActionBtn icon={<Settings2 size={16}/>} label="تعديل بيانات" onClick={() => handleAction('change_data')} />
                <ActionBtn icon={<UserMinus size={16}/>} label="طرد" onClick={() => handleAction('kick', true, 'طرد اللاعب', 'السبب')} className="text-warning hover:text-warning" />
                <ActionBtn icon={<ShieldBan size={16}/>} label="باند" onClick={() => handleAction('ban', true, 'حظر اللاعب', 'السبب')} className="text-destructive hover:text-destructive" />
                <ActionBtn icon={<Skull size={16}/>} label="قتل" onClick={() => handleAction('kill')} className="text-destructive hover:text-destructive" />
              </div>
            </Card>

            {/* Background Image Card */}
            <Card className="relative overflow-hidden h-[300px] border-transparent">
              <img src="/player_scene.jpg" alt="Scene" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">الموقع الحالي</h3>
                  <p className="text-white/70 text-sm">Los Santos City</p>
                </div>
              </div>
            </Card>

            {/* Vehicles Table */}
            <Card className="h-[300px] flex flex-col">
              <div className="p-4 border-b border-border bg-secondary/30">
                <h3 className="font-bold flex items-center gap-2"><Car size={18}/> مركبات اللاعب</h3>
              </div>
              <div className="overflow-x-auto flex-1 p-0">
                <table className="w-full text-sm text-right">
                  <thead>
                    <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                      <th className="px-6 py-3 font-medium">اللوحة</th>
                      <th className="px-6 py-3 font-medium">المركبة</th>
                      <th className="px-6 py-3 font-medium">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(player.vehicles || []).map((v, i) => (
                      <tr key={i} className="hover:bg-secondary/30 transition">
                        <td className="px-6 py-3 font-mono font-bold text-primary">{v.plate}</td>
                        <td className="px-6 py-3 font-bold capitalize">{v.model}</td>
                        <td className="px-6 py-3">
                          {v.state === 'in' ? <Badge variant="success">في الكراج</Badge> : <Badge variant="warning">بالخارج</Badge>}
                        </td>
                      </tr>
                    ))}
                    {!(player.vehicles?.length) && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">لا يملك مركبات</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>
        </>
      )}

      <ActionModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        fieldLabel={modalState.label}
        placeholder={modalState.placeholder}
        onSubmit={submitModal}
      />

    </div>
  );
}

function ActionBtn({ icon, label, onClick, className }: { icon: React.ReactNode, label: string, onClick: () => void, className?: string }) {
  return (
    <Button 
      variant="outline" 
      onClick={onClick}
      className={`h-auto flex-col py-3 px-1 gap-2 text-xs hover:bg-secondary ${className || 'text-muted-foreground hover:text-foreground'}`}
    >
      {icon}
      <span className="truncate w-full text-center">{label}</span>
    </Button>
  );
}
