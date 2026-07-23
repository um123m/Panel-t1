import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users, 
  Search, 
  Car, 
  UserCog, 
  SignalHigh, 
  ShieldAlert, 
  Flag, 
  ListOrdered, 
  Ban, 
  Star,
  FileText,
  MonitorCheck,
  BookOpen,
  LayoutTemplate,
  Settings,
  Swords
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetMe } from "@workspace/api-client-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { data: me } = useGetMe();

  const navGroups = [
    {
      title: "عام",
      items: [
        { label: "الرئيسية", path: "/", icon: Home },
        { label: "المستخدمين", path: "/users", icon: Users },
      ]
    },
    {
      title: "السيرفر",
      items: [
        { label: "كشف اللاعبين", path: "/search", icon: Search, badge: "جديد" },
        { label: "جميع الشخصيات", path: "/characters", icon: Users, badge: "جديد" },
        { label: "جميع المركبات", path: "/vehicles", icon: Car, badge: "جديد" },
        { label: "إدارة اللاعبين", path: "/player-admin", icon: UserCog },
        { label: "اللاعبين المتصلين", path: "/online", icon: SignalHigh },
        { label: "قائمة العصابات", path: "/gangs", icon: Swords },
        { label: "الريبورتات", path: "/reports", icon: Flag },
        { label: "إدارة الإنتظار", path: "/queue", icon: ListOrdered },
        { label: "الباندات", path: "/bans", icon: Ban },
        { label: "الأولوية", path: "/priority", icon: Star },
        { label: "قائمة الأسلحة المعدنية", path: "/weapons", icon: ShieldAlert },
      ]
    },
    {
      title: "الإعدادات",
      items: [
        { label: "التقديمات", path: "/applications", icon: FileText },
        { label: "الإختبار الإلكتروني", path: "/test", icon: MonitorCheck },
        { label: "القوانين", path: "/rules", icon: BookOpen },
        { label: "تصميم الموقع", path: "/design", icon: LayoutTemplate },
        { label: "الإعدادات العامة", path: "/settings", icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-[282px] bg-sidebar fixed right-0 top-0 bottom-0 border-l border-border flex flex-col z-50">
      <div className="p-6 flex items-center justify-center border-b border-border h-[139px]">
        <img src="/ms_logo.png" alt="MS Logo" className="h-16 object-contain" />
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {navGroups.map((group, i) => (
          <div key={i}>
            <h4 className="text-muted-foreground text-xs font-bold mb-4 px-4 uppercase tracking-wider">{group.title}</h4>
            <div className="space-y-1">
              {group.items.map((item, j) => {
                const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
                return (
                  <Link key={j} href={item.path} className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-md transition-colors text-sm font-medium",
                    isActive 
                      ? "bg-primary/10 text-primary border-r-4 border-primary" 
                      : "text-foreground hover:bg-secondary hover:text-white border-r-4 border-transparent"
                  )}>
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border bg-sidebar mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
            {me?.user?.avatar ? (
               <img src={me.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserCog size={20} />
            )}
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">{me?.user?.name || "abadykhaled"}</div>
            <div className="text-xs text-muted-foreground">{me?.user?.role || "owner"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
