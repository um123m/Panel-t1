import { Bell, Search, Globe, ChevronDown, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Topbar() {
  const [location] = useLocation();
  
  const getPageTitle = () => {
    if (location === "/") return "الرئيسية";
    if (location.startsWith("/search")) return "كشف اللاعبين";
    if (location.startsWith("/characters")) return "جميع الشخصيات";
    if (location.startsWith("/vehicles")) return "جميع المركبات";
    if (location.startsWith("/player-admin")) return "إدارة اللاعبين";
    if (location.startsWith("/online")) return "اللاعبين المتصلين";
    if (location.startsWith("/gangs")) return "قائمة العصابات";
    if (location.startsWith("/reports")) return "الريبورتات";
    if (location.startsWith("/queue")) return "إدارة الإنتظار";
    if (location.startsWith("/bans")) return "الباندات";
    if (location.startsWith("/priority")) return "الأولوية";
    if (location.startsWith("/weapons")) return "قائمة الأسلحة المعدنية";
    if (location.startsWith("/settings")) return "الإعدادات العامة";
    return "لوحة التحكم";
  };

  return (
    <header className="h-[139px] bg-background border-b border-border sticky top-0 z-40 flex flex-col justify-center px-8">
      <div className="flex items-center justify-between">
        
        {/* Right side (RTL): Title & Breadcrumb */}
        <div>
          <h1 className="text-3xl font-black text-foreground">{getPageTitle()}</h1>
          <div className="flex items-center text-muted-foreground text-sm mt-2 gap-2">
            <span>لوحة التحكم</span>
            <ChevronRight size={14} />
            <span className="text-primary">{getPageTitle()}</span>
          </div>
        </div>

        {/* Center: Announcement marquee */}
        <div className="flex-1 max-w-lg mx-8 overflow-hidden rounded-full bg-secondary/50 border border-border px-4 py-2 flex items-center">
          <div className="w-full text-center text-sm font-medium text-warning whitespace-nowrap animate-pulse">
            لا يفوتك تحديثنا الجديد نزل 🚀
          </div>
        </div>

        {/* Left side: Icons and User info */}
        <div className="flex items-center gap-4 dir-ltr" dir="ltr">
          <div className="flex items-center gap-2 bg-secondary border border-border rounded-full px-3 py-1.5 cursor-pointer hover:bg-secondary/80 transition">
            <img src="https://flagcdn.com/w20/sa.png" alt="AR" className="w-5 h-5 rounded-full object-cover" />
            <span className="text-sm font-bold">AR</span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </div>

          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary border border-border text-foreground hover:text-primary transition cursor-pointer">
            <Search size={18} />
          </div>
          
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-secondary border border-border text-foreground hover:text-primary transition cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-destructive rounded-full"></span>
          </div>

          <div className="bg-success/20 text-success text-xs font-black px-2 py-1 rounded-md">
            37%
          </div>
        </div>

      </div>
    </header>
  );
}
