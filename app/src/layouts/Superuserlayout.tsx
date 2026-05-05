// src/layouts/Superuserlayout.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
    { label: "Customers booking", path: "/superuser/bookings" },
    { label: "Driver Payments", path: "/superuser/payments" },
    { label: 'Scanner', path: '/superuser/scanner' }
];

export default function Superuserlayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    // 🔐 Protect admin routes
    useEffect(() => {
        const token = localStorage.getItem("Superuser_token");
        if (!token) {
            navigate("/superuser/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("Superuser_token"); // Fix: Cleaned up the correct token
        window.location.href = "/superuser/login";
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Superuser Header */}
            <header className="sticky top-0 bg-[#111] border-b border-gray-800 shadow-lg p-4 flex items-center justify-between z-50">
                <div className="flex items-center gap-4">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-300">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        
                        {/* Mobile & Desktop Side Menu */}
                        <SheetContent side="left" className="bg-[#111] border-r border-gray-800 text-white w-[300px] flex flex-col p-0">
                            
                            <SheetHeader className="p-6 text-left border-b border-gray-800">
                                <SheetTitle className="text-red-500 text-2xl font-bold">Menu</SheetTitle>
                            </SheetHeader>

                            {/* Scrollable Navigation Area */}
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
                                                        ? "bg-red-600 text-white shadow-lg"
                                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                                }`}
                                            >
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </nav>

                            {/* Fixed Logout at Bottom */}
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
                    
                    <h1 className="text-xl font-bold text-red-500 tracking-tight">Head Captain Panel</h1>
                </div>

                <div className="hidden md:block">
                    <span className="text-gray-500 text-sm italic">Superuser Session Active</span>
                </div>
            </header>

            {/* Page Content */}
            <main className="p-6 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}