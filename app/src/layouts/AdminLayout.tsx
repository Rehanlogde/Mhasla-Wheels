import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
    { label: "Bookings", path: "/admin/bookings" },
    { label: "Fleet", path: "/admin/fleet" },
    { label: "Metadata", path: "/admin/metadata" },
    { label: "Settings", path: "/admin/settings" },
    { label: "Add driver", path: "/admin/adddriver" },
    { label: 'Add vehicles', path: "/admin/addvehicle" },
    { label: 'Superuser management', path: '/admin/addsuperuser' },
    { label: "Map View", path: "/mapview" },
    { label: 'Show current Drivers', path: "/admin/showdrivers" },
    { label: 'Mail', path: "/admin/mailsomeone" },
    {label  : "Loyalty_program", path : "/admin/loyaltyProgram"},
    {label : "Users", path : "/admin/getusers"}
];

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("ADMIN_TOKEN");
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("ADMIN_TOKEN");
        window.location.href = "/admin/login";
    };

   return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <header className="sticky top-0 bg-[#111] border-b border-gray-800 shadow-lg p-4 flex items-center justify-between z-50">
                <div className="flex items-center gap-4">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-300">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        
                        {/* 🟢 Added flex and flex-col to the Content to manage space */}
                        <SheetContent side="left" className="bg-[#111] border-r border-gray-800 text-white w-[300px] flex flex-col p-0">
                            
                            <SheetHeader className="p-6 text-left border-b border-gray-800">
                                <SheetTitle className="text-red-500 text-2xl font-bold">Menu</SheetTitle>
                            </SheetHeader>

                            {/* 🟢 This container handles the scrolling */}
                            <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <div className="flex flex-col gap-2">
                                    {navItems.map((item) => {
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setOpen(false)}
                                                className={`px-4 py-3 rounded-md font-medium transition flex items-center gap-3 ${
                                                    isActive
                                                        ? "bg-red-600 text-white"
                                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                                }`}
                                            >
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </nav>

                            {/* 🟢 Fixed Logout button at the bottom */}
                            <div className="p-4 border-t border-gray-800 bg-[#111]">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 rounded-md font-medium text-red-400 hover:bg-red-950/30 flex items-center gap-3 transition"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </SheetContent>
                    </Sheet>
                    
                    <h1 className="text-xl font-bold text-red-500 tracking-tight">Admin Panel</h1>
                </div>

                <div className="hidden md:block">
                    <span className="text-gray-500 text-sm">Logged in as Administrator</span>
                </div>
            </header>

            <main className="p-6 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}