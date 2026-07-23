import { useState } from "react";
import { useGetPriorityList, useAddPriorityEntry, useDeletePriorityEntry, getGetPriorityListQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, Button, Badge, Input } from "@/components/ui/common";
import { Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function Priority() {
  const { data: priorities } = useGetPriorityList();
  const queryClient = useQueryClient();
  const addPriority = useAddPriorityEntry();
  const deletePriority = useDeletePriorityEntry();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    discord: "",
    license: "",
    priority: 1,
    note: ""
  });

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من إزالة الأولوية؟")) {
      deletePriority.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetPriorityListQueryKey() });
          toast.success("تم إزالة الأولوية بنجاح");
        }
      });
    }
  };

  const handleAdd = () => {
    if (!formData.name) {
      toast.error("يرجى تعبئة الاسم");
      return;
    }
    
    addPriority.mutate({ data: { ...formData, priority: Number(formData.priority) } }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ name: "", discord: "", license: "", priority: 1, note: "" });
        queryClient.invalidateQueries({ queryKey: getGetPriorityListQueryKey() });
        toast.success("تم إضافة الأولوية بنجاح");
      }
    });
  };

  if (!priorities) return <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center bg-panel p-4 rounded-lg border border-border">
        <div>
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <Star className="text-purple" /> قائمة الأولويات
          </h2>
          <p className="text-sm text-muted-foreground">اللاعبين الذين يملكون أولوية دخول للسيرفر</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-purple/20 text-purple border-purple/30 text-sm px-3 py-1 font-bold">
            العدد الإجمالي: {priorities.length}
          </Badge>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus size={16} /> إضافة أولوية
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium w-16">#</th>
                <th className="px-6 py-4 font-medium">الاسم</th>
                <th className="px-6 py-4 font-medium">الدسكورد</th>
                <th className="px-6 py-4 font-medium">License</th>
                <th className="px-6 py-4 font-medium">مستوى الأولوية</th>
                <th className="px-6 py-4 font-medium">ملاحظة</th>
                <th className="px-6 py-4 font-medium">أضيف بواسطة</th>
                <th className="px-6 py-4 font-medium">التاريخ</th>
                <th className="px-6 py-4 font-medium text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {priorities.map((p, i) => (
                <tr key={p.id} className="hover:bg-secondary/30 transition">
                  <td className="px-6 py-4 font-bold text-muted-foreground">{i + 1}</td>
                  <td className="px-6 py-4 font-bold">{p.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground" dir="ltr">{p.discord || '—'}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground" dir="ltr">{p.license || '—'}</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-purple text-white border-transparent">
                      المستوى {p.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground max-w-[200px] truncate">{p.note || '—'}</td>
                  <td className="px-6 py-4 text-xs">{p.addedBy || '—'}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString('ar-SA') : '—'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(p.id.toString())}
                      className="text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                      disabled={deletePriority.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {priorities.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">لا يوجد أولويات مسجلة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Priority Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 bg-panel border-border shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star size={20} className="text-purple" /> إضافة أولوية جديدة
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">اسم اللاعب *</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="الاسم" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">مستوى الأولوية</label>
                  <Input type="number" min="1" max="100" value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Discord ID</label>
                  <Input value={formData.discord} onChange={e => setFormData({...formData, discord: e.target.value})} dir="ltr" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">License</label>
                <Input value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} dir="ltr" placeholder="license:..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">ملاحظة</label>
                <Input value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} placeholder="ملاحظات إضافية" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
              <Button onClick={handleAdd} disabled={addPriority.isPending}>
                {addPriority.isPending ? 'جاري الإضافة...' : 'إضافة'}
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
