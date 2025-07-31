import { Home, Search, Wallet, Trophy, User } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

const navigationItems = [
  { icon: Home, label: "Feed", path: "/" },
  { icon: Search, label: "Explore", path: "/explore" },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
  { icon: Trophy, label: "Rankings", path: "/leaderboard" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {navigationItems.map(({ icon: Icon, label, path }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <button className={`flex flex-col items-center py-2 px-3 ${
                isActive ? "text-indigo-500" : "text-gray-400 hover:text-gray-600"
              }`}>
                <Icon size={20} className="mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
