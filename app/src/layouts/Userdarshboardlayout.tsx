// src/layouts/AdminLayout.tsx
import { useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
    { label: "Bookings", path: "/admin/bookings" },
    { label: "Fleet", path: "/admin/fleet" },
    {label : 'Map view', path : "/mapview"}
];

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("customer-token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("customer-token");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Admin Navbar */}
            <div className="sticky top-0 bg-[#111] border-b border-gray-700 shadow-lg p-4 flex flex-col md:flex-row items-center justify-between gap-3 z-50">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-bold text-red-500">Customer Panel</h1>
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
