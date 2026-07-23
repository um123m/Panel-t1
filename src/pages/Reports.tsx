import { useState, useRef, useEffect } from "react";
import { useGetState, useSendReportMessage, getGetStateQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, Input, Button, Badge } from "@/components/ui/common";
import { Send, CheckCircle, Flag } from "lucide-react";

export default function Reports() {
  const { data: state } = useGetState();
  const queryClient = useQueryClient();
  const sendMessage = useSendReportMessage();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [msgText, setMsgText] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state, selectedReportId]);

  if (!state) return <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  const reports = state.reports || [];
  const selectedReport = reports.find(r => r.id === selectedReportId);

  const handleSend = () => {
    if (!selectedReportId || !msgText.trim()) return;
    
    sendMessage.mutate({ data: { reportId: selectedReportId, text: msgText } }, {
      onSuccess: () => {
        setMsgText("");
        queryClient.invalidateQueries({ queryKey: getGetStateQueryKey() });
      }
    });
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 -mt-2">
      
      {/* Users Sidebar (Right, 380px) */}
      <Card className="w-[380px] flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-border bg-panel">
          <h3 className="font-bold">قائمة الريبورتات</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {reports.map(r => (
            <div 
              key={r.id} 
              onClick={() => setSelectedReportId(r.id)}
              className={`p-3 rounded-md cursor-pointer transition-colors border ${
                selectedReportId === r.id 
                  ? 'bg-primary/10 border-primary/30 text-primary' 
                  : 'bg-transparent border-transparent hover:bg-secondary'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm truncate">{r.name}</span>
                <Badge variant={r.status === 'open' ? 'success' : 'secondary'} className="text-[10px] shrink-0">
                  {r.status === 'open' ? 'مفتوح' : 'مغلق'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate w-full">
                {r.messages[r.messages.length - 1]?.text || 'لا يوجد رسائل'}
              </p>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="p-6 text-center text-muted-foreground text-sm">لا يوجد ريبورتات حالياً</div>
          )}
        </div>
      </Card>

      {/* Chat Panel (Flex/Left) */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-panel">
        {selectedReport ? (
          <>
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  ريبورت #{selectedReport.id}
                  <Badge variant={selectedReport.status === 'open' ? 'success' : 'secondary'} className="text-[10px]">
                    {selectedReport.status === 'open' ? 'مفتوح' : 'مغلق'}
                  </Badge>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">بواسطة {selectedReport.name}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-success">
                <CheckCircle size={14} /> إغلاق الريبورت
              </Button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedReport.messages.map((msg, i) => {
                const isStaff = msg.from === 'admin' || msg.from === 'staff';
                return (
                  <div key={i} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-xs font-bold">{isStaff ? 'الإدارة' : selectedReport.name}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(msg.time).toLocaleTimeString('ar-SA')}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                      isStaff 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-secondary text-foreground rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 border-t border-border bg-secondary/20 shrink-0">
              <div className="flex gap-2 relative">
                <Input 
                  placeholder="اكتب ردك هنا..." 
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  disabled={selectedReport.status !== 'open'}
                  className="bg-background pr-4"
                />
                <Button 
                  onClick={handleSend} 
                  disabled={selectedReport.status !== 'open' || !msgText.trim() || sendMessage.isPending}
                  className="px-6 shrink-0"
                >
                  {sendMessage.isPending ? 'جاري الإرسال...' : <Send size={18} />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
            <Flag size={48} className="opacity-20" />
            <p>اختر ريبورت من القائمة لعرض المحادثة</p>
          </div>
        )}
      </Card>

    </div>
  );
}
