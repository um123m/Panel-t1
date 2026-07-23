import React, { useState } from "react";
import { useGetState } from "@workspace/api-client-react";
import { Card, Button, Badge } from "@/components/ui/common";
import { ShieldAlert, ChevronDown, ChevronUp, MapPin, Briefcase } from "lucide-react";
import { Link } from "wouter";

export default function Weapons() {
  const { data: state } = useGetState();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!state) return <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  const weapons = [...state.weapons].sort((a, b) => b.editCount - a.editCount);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black mb-1 flex items-center gap-2">
            <ShieldAlert className="text-destructive" /> قائمة الأسلحة المعدنية
          </h2>
          <p className="text-muted-foreground">مراقبة الأسلحة التي تم التعديل على سيريالها بشكل متكرر (Metagaming Tracking)</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium">السلاح</th>
                <th className="px-6 py-4 font-medium">السيريال الأساسي</th>
                <th className="px-6 py-4 font-medium">عدد التعديلات</th>
                <th className="px-6 py-4 font-medium">تاريخ آخر تعديل</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {weapons.map(w => {
                const isExpanded = expandedId === w.id;
                const player = state.players.find(p => p.id === w.playerId);
                
                return (
                  <React.Fragment key={w.id}>
                    <tr 
                      className={`hover:bg-secondary/30 transition cursor-pointer ${isExpanded ? 'bg-secondary/20' : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : w.id)}
                    >
                      <td className="px-6 py-4 font-bold text-lg">{w.weapon}</td>
                      <td className="px-6 py-4 font-mono font-bold text-primary">{w.serial}</td>
                      <td className="px-6 py-4">
                        <Badge variant={w.editCount > 3 ? 'destructive' : 'warning'} className="font-bold">
                          {w.editCount} مرات
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono">
                        {new Date(w.date).toLocaleString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </Button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-secondary/10 border-b border-border">
                        <td colSpan={5} className="p-0">
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-2">
                            
                            <div className="space-y-3">
                              <h4 className="text-sm font-bold text-muted-foreground mb-2 border-b border-border pb-1">معلومات الحامل الحالي</h4>
                              {player ? (
                                <div className="flex items-center gap-3 bg-background p-3 rounded-lg border border-border">
                                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                                    {player.avatar || '👤'}
                                  </div>
                                  <div>
                                    <div className="font-bold">{player.nickname} <span className="text-muted-foreground text-xs">(ID: {player.id})</span></div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                      <Briefcase size={12} /> {player.job || 'لا يوجد'}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-muted-foreground text-sm">السلاح غير مملوك للاعب محدد حالياً</div>
                              )}
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-sm font-bold text-muted-foreground mb-2 border-b border-border pb-1">موقع السلاح</h4>
                              <div className="flex items-center gap-2 text-sm bg-background p-3 rounded-lg border border-border h-[66px]">
                                <MapPin className="text-primary" size={18} />
                                <span className="font-bold text-foreground">{w.place || 'حقيبة اللاعب'}</span>
                              </div>
                            </div>

                            <div className="space-y-3 flex flex-col">
                              <h4 className="text-sm font-bold text-muted-foreground mb-2 border-b border-border pb-1">الإجراءات</h4>
                              <div className="flex gap-2 mt-auto h-[66px] items-center">
                                {player && (
                                  <Link href={`/player-admin?id=${player.id}`} className="flex-1">
                                    <Button className="w-full gap-2">إدارة اللاعب</Button>
                                  </Link>
                                )}
                                <Button variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white">
                                  سحب السلاح
                                </Button>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {weapons.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">لا يوجد أسلحة معدلة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
