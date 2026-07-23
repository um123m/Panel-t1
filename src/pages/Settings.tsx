import { useGetState } from "@workspace/api-client-react";
import { Card, Button } from "@/components/ui/common";
import { Settings, Save, Server, Activity, Database, Key } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: state } = useGetState();
  const [isSaving, setIsSaving] = useState(false);

  if (!state) return <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("تم حفظ الإعدادات بنجاح");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black mb-1 flex items-center gap-2">
            <Settings className="text-primary" /> الإعدادات العامة
          </h2>
          <p className="text-muted-foreground">إعدادات النظام والسيرفر وسجل الأحداث</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save size={16} /> {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="p-6">
            <h3 className="font-bold flex items-center gap-2 mb-6 border-b border-border pb-4">
              <Server size={18} /> إعدادات السيرفر
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">اسم السيرفر</label>
                  <input type="text" defaultValue={state.settings?.siteName || "MS Roleplay"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">IP السيرفر</label>
                  <input type="text" defaultValue="play.ms-rp.com:30120" dir="ltr" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">رسالة الترحيب (Dashboard)</label>
                <textarea 
                  defaultValue={state.settings?.welcome || "مرحباً بك في Ms!"}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold flex items-center gap-2 mb-6 border-b border-border pb-4 text-warning">
              <Key size={18} /> إعدادات الـ Webhooks والداتا بيز
            </h3>
            
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4 text-sm text-warning-foreground flex gap-3 items-start">
              <Database className="shrink-0 mt-0.5 text-warning" size={18} />
              <p>
                <strong>تنويه:</strong> النظام الحالي متصل بقاعدة بيانات تجريبية (db.json). يرجى ربط النظام بقاعدة بيانات السيرفر الحقيقية (MySQL/MariaDB) من خلال إعدادات الباك إند قبل إطلاقه للاستخدام الفعلي.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Discord Webhook (Logs)</label>
                <input type="password" placeholder="https://discord.com/api/webhooks/..." dir="ltr" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                <p className="text-xs text-muted-foreground mt-1">يستخدم لإرسال إشعارات الأوامر الإدارية لغرفة المراقبة في الدسكورد.</p>
              </div>
            </div>
          </Card>

        </div>

        {/* Action Logs */}
        <div className="lg:col-span-1">
          <Card className="flex flex-col h-full">
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              <h3 className="font-bold">سجل الأحداث الأخير (Logs)</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[600px]">
              {state.logs.slice(0, 15).map((log, i) => (
                <div key={i} className="flex gap-3 relative before:absolute before:right-[9px] before:top-6 before:bottom-[-16px] before:w-px before:bg-border last:before:hidden">
                  <div className="w-5 h-5 rounded-full bg-secondary border-2 border-background flex-shrink-0 mt-0.5 z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      <span className="text-primary">{log.by}</span> قام بـ {log.action} <span className="text-warning">{log.target}</span>
                    </p>
                    <span className="text-xs text-muted-foreground font-mono">{new Date(log.at).toLocaleString('ar-SA')}</span>
                  </div>
                </div>
              ))}
              {state.logs.length === 0 && (
                <div className="text-center text-muted-foreground py-8">لا يوجد أحداث مسجلة</div>
              )}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
