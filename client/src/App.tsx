
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const isMobileDevice = (): boolean => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // User Agent checks
    const mobileUARegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|windows phone|kindle|silk|meego|bb10|playbook|palm|hpwos|blazer|bolt|dolfin|dorado|fennec|gobrowser|iris|maemo|midori|minimo|netfront|obigo|polaris|semc-browser|skyfire|teashark|teleca|uzard|xiino/i;
    const isMobileUA = mobileUARegex.test(userAgent.toLowerCase());

    // Screen size checks
    const isSmallScreen = window.innerWidth < 768;
    const isSmallHeight = window.innerHeight < 768;

    // Touch support checks
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Device pixel ratio (high DPI often indicates mobile)
    const isHighDPI = window.devicePixelRatio && window.devicePixelRatio > 1;

    // Orientation API support
    const hasOrientationAPI = 'orientation' in window;

    // Pointer type detection
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    // Hybrid checks (combining multiple indicators)
    const isProbablyMobile = (
        isMobileUA ||
        isSmallScreen ||
        (hasTouch && isSmallHeight) ||
        (hasTouch && isHighDPI) ||
        (hasTouch && hasOrientationAPI) ||
        hasCoarsePointer
    );

    // Additional checks for specific devices
    const isiPad = /Macintosh/i.test(userAgent) && hasTouch;
    const isWindowsTablet = /Windows NT/i.test(userAgent) && hasTouch;

    return isProbablyMobile || isiPad || isWindowsTablet;
};

const App = () => {
    if (isMobileDevice()) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 px-4 text-center">
                <div className="max-w-md">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">⚠️ Access Restricted</h1>
                    <p className="text-lg text-gray-700">
                        This application is only accessible on a laptop or desktop browser.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<AdminLogin />} />
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    )
};

export default App;
