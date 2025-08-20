import { Phone, Coins, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-user";

export function TopNavigation() {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-gray-900">Call</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-50 px-3 py-1.5 rounded-full flex items-center space-x-2">
            <Coins className="text-indigo-500" size={16} />
            <span className="text-sm font-semibold text-indigo-600">
              {isLoading ? "..." : (user?.tokenBalance || 0)}
            </span>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="text-gray-600" size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
