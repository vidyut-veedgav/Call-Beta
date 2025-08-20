import { Home, FileStack, Plus, Trophy, User } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {/* Feed */}
        <Link href="/">
          <button className={`flex flex-col items-center py-2 px-3 ${
            location === "/" ? "text-indigo-500" : "text-gray-400 hover:text-gray-600"
          }`}>
            <Home size={20} className="mb-1" />
            <span className="text-xs font-medium">Feed</span>
          </button>
        </Link>

        {/* My Bets */}
        <Link href="/my-bets">
          <button className={`flex flex-col items-center py-2 px-3 ${
            location === "/my-bets" ? "text-indigo-500" : "text-gray-400 hover:text-gray-600"
          }`}>
            <FileStack size={20} className="mb-1" />
            <span className="text-xs font-medium">My Bets</span>
          </button>
        </Link>
        
        {/* Create Button */}
        <Link href="/create-claim">
          <button className={`flex flex-col items-center py-2 px-3 ${
            location === "/create-claim" ? "text-indigo-500" : "text-gray-400 hover:text-gray-600"
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              location === "/create-claim" ? "bg-indigo-500" : "bg-indigo-500"
            }`}>
              <Plus size={18} className="text-white" />
            </div>
            <span className="text-xs font-medium">Create</span>
          </button>
        </Link>

        {/* Rankings */}
        <Link href="/leaderboard">
          <button className={`flex flex-col items-center py-2 px-3 ${
            location === "/leaderboard" ? "text-indigo-500" : "text-gray-400 hover:text-gray-600"
          }`}>
            <Trophy size={20} className="mb-1" />
            <span className="text-xs font-medium">Rankings</span>
          </button>
        </Link>

        {/* Profile */}
        <Link href="/profile">
          <button className={`flex flex-col items-center py-2 px-3 ${
            location === "/profile" ? "text-indigo-500" : "text-gray-400 hover:text-gray-600"
          }`}>
            <User size={20} className="mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </Link>
      </div>
    </nav>
  );
}
