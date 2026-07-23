import { useState } from "react";
import { useGetBans, useAddBan, useDeleteBan, getGetBansQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, Button, Badge, Input } from "@/components/ui/common";
import { Plus, Trash2, Ban as BanIcon } from "lucide-react";
import { toast } from "sonner";

export default function Bans() {
  const { data: bans } = useGetBans();
  const queryClient = useQueryClient();
  const addBan = useAddBan();
  const deleteBan = useDeleteBan();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    license: "",
    steam: "",
    discord: "",
    reason: "",
    expire: ""
  });

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الباند؟")) {
      deleteBan.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetBansQueryKey() });
          toast.success("تم فك الباند بنجاح");
        }
      });
    }
  };

  const handleAdd = () => {
    if (!formData.name || !formData.reason) {
      toast.error("يرجى تعبئة الاسم والسبب على الأقل");
      return;
    }
    
    addBan.mutate({ data: formData }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ name: "", license: "", steam: "", discord: "", reason: "", expire: "" });
        queryClient.invalidateQueries({ queryKey: getGetBansQueryKey() });
        toast.success("تم إضافة الباند بنجاح");
      }
    });
  };

  if (!bans) return <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black mb-1 flex items-center gap-2">
            <BanIcon className="text-destructive" /> قائمة الباندات
          </h2>
          <p className="text-muted-foreground">اللاعبين المحظورين من الدخول للسيرفر</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-destructive text-white hover:bg-destructive/80">
          <Plus size={16} /> إضافة باند جديد
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium">Ban ID</th>
                <th className="px-6 py-4 font-medium">الاسم</th>
                <th className="px-6 py-4 font-medium">السبب</th>
                <th className="px-6 py-4 font-medium">المسؤول</th>
                <th className="px-6 py-4 font-medium">تاريخ الانتهاء</th>
                <th className="px-6 py-4 font-medium text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bans.map(b => (
                <tr key={b.id} className="hover:bg-secondary/30 transition">
                  <td className="px-6 py-4 font-mono text-primary font-bold">{b.banid}</td>
                  <td className="px-6 py-4 font-bold">{b.name}</td>
                  <td className="px-6 py-4">
                    <Badge variant="destructive" className="bg-destructive/20 text-destructive border-transparent font-normal text-xs px-2 py-1">
                      {b.reason}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{b.bannedBy}</td>
                  <td className="px-6 py-4 text-warning font-mono text-xs">{b.expire || 'دائم'}</td>
                  <td className="px-6 py-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(b.id.toString())}
                      className="text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                      disabled={deleteBan.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {bans.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">لا يوجد باندات مسجلة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Ban Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg p-6 bg-panel border-border shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-destructive">
              <BanIcon size={20} /> إضافة باند جديد
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">اسم اللاعب *</label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="الاسم" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">تاريخ الانتهاء</label>
                  <Input type="date" value={formData.expire} onChange={e => setFormData({...formData, expire: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">السبب *</label>
                <Input value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="سبب الباند" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">License</label>
                  <Input value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} placeholder="license:..." dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Steam</label>
                  <Input value={formData.steam} onChange={e => setFormData({...formData, steam: e.target.value})} placeholder="steam:..." dir="ltr" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Discord ID</label>
                <Input value={formData.discord} onChange={e => setFormData({...formData, discord: e.target.value})} placeholder="الآي دي" dir="ltr" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
              <Button onClick={handleAdd} className="bg-destructive hover:bg-destructive/80" disabled={addBan.isPending}>
                {addBan.isPending ? 'جاري الإضافة...' : 'إضافة'}
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
