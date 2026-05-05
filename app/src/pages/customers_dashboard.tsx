// src/layouts/AdminLayout.tsx
import { useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
    { label: "Bookings", path: "/bookings" },
    { label: "Fleet", path: "/fleet" },
];

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // 🔐 Protect admin routes
    useEffect(() => {
        const token = localStorage.getItem("ADMIN_TOKEN");
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);
    const getbookingsdata= async () => {
        const result = await fetch("/api/functions/getbookingsdata",{
            headers: {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                        
            })
        })
    }
    useEffect(()=>{
        getbookingsdata
    })

    const handleLogout = () => {
        localStorage.removeItem("ADMIN_TOKEN");
        window.location.href = "/admin/login";
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Admin Navbar */}
            <div className="sticky top-0 bg-[#111] border-b border-gray-700 shadow-lg p-4 flex flex-col md:flex-row items-center justify-between gap-3 z-50">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-bold text-red-500">Admin Panel</h1>
                    <nav className="flex gap-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-3 py-1 rounded-md font-medium transition ${isActive
                                            ? "bg-red-600 text-white hover:bg-red-700"
                                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                    Logout
                </Button>
            </div>

            {/* Page Content */}
            <div className="p-6">
                <Outlet />
            </div>
        </div>
    );
}
