import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  TestTube2,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Samples', href: '/samples', icon: TestTube2 },
  { name: 'Test Results', href: '/test-results', icon: FileSpreadsheet },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 border-r bg-background">
      <div className="flex flex-col flex-1 gap-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                'hover:bg-accent hover:text-accent-foreground',
                isActive ? 'bg-accent' : 'transparent'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
} 