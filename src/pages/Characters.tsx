import { useGetState } from "@workspace/api-client-react";
import { Card, Input, Button } from "@/components/ui/common";
import { Search, Mail, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function Characters() {
  const { data: state } = useGetState();
  const [searchTerm, setSearchTerm] = useState("");

  if (!state) return <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  let filtered = state.players;
  if (searchTerm) {
    filtered = filtered.filter(p => 
      p.nickname.includes(searchTerm) || 
      (p.character && p.character.includes(searchTerm))
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-2.5 text-muted-foreground" size={18} />
          <Input 
            placeholder="بحث عن شخصية..." 
            className="pr-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium">رقم الهوية</th>
                <th className="px-6 py-4 font-medium">اسم الشخصية</th>
                <th className="px-6 py-4 font-medium">الوظيفة</th>
                <th className="px-6 py-4 font-medium">طرق التواصل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-secondary/30 transition">
                  <td className="px-6 py-4 font-bold">#{p.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold">{p.character || p.nickname}</div>
                    <div className="text-xs text-muted-foreground">{p.nickname}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary px-2 py-1 rounded text-xs">{p.job || 'لا يوجد'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Phone size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue">
                        <MessageSquare size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-warning">
                        <Mail size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
