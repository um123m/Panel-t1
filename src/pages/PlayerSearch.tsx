import { useState } from "react";
import { useGetState } from "@workspace/api-client-react";
import { Card, Input, Button } from "@/components/ui/common";
import { Search, SlidersHorizontal, Settings2 } from "lucide-react";
import { Link } from "wouter";

export default function PlayerSearch() {
  const { data: state } = useGetState();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"cash" | "bank">("cash");

  if (!state) return <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  let filtered = [...state.players];
  
  if (searchTerm) {
    filtered = filtered.filter(p => 
      p.nickname.includes(searchTerm) || 
      p.id.toString().includes(searchTerm) ||
      (p.character && p.character.includes(searchTerm))
    );
  }

  filtered.sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0));
  const top10 = filtered.slice(0, 10);

  return (
    <div className="space-y-6">
      
      {/* Search Toolbar */}
      <Card className="p-4 bg-panel border-border flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">بحث باسم الشخصية أو الهوية</label>
          <div className="relative">
            <Search className="absolute right-3 top-2.5 text-muted-foreground" size={18} />
            <Input 
              placeholder="ابحث هنا..." 
              className="pr-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-[150px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">ترتيب حسب</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as "cash" | "bank")}
          >
            <option value="cash">الكاش (Cash)</option>
            <option value="bank">البنك (Bank)</option>
          </select>
        </div>

        <Button className="gap-2">
          <SlidersHorizontal size={16} />
          فلترة
        </Button>
      </Card>

      {/* Results Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium">رقم الهوية</th>
                <th className="px-6 py-4 font-medium">اسم الشخصية</th>
                <th className="px-6 py-4 font-medium">القيمة ({sortBy === 'cash' ? 'كاش' : 'بنك'})</th>
                <th className="px-6 py-4 font-medium">الوظيفة</th>
                <th className="px-6 py-4 font-medium">العصابة</th>
                <th className="px-6 py-4 font-medium text-center">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {top10.map(p => (
                <tr key={p.id} className="hover:bg-secondary/30 transition">
                  <td className="px-6 py-4 font-bold text-primary">#{p.id}</td>
                  <td className="px-6 py-4 font-bold flex items-center gap-2">
                    <span className="text-lg">{p.avatar || '👤'}</span>
                    {p.nickname}
                  </td>
                  <td className="px-6 py-4 text-success font-mono font-bold">
                    ${(p[sortBy] || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary px-2 py-1 rounded text-xs">{p.job || 'عاطل'}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{p.gang || 'لا يوجد'}</td>
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
              {top10.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">لا يوجد نتائج للبحث</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
