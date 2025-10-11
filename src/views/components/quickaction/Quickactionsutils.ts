// Utility to flatten sidebar menu items for quick actions
import { hrSidebarItems , employeeSidebarItems } from "../../partials/sidebar/sidebarcontent";

export interface QuickAction {
  title: string;
  icon: React.ComponentType<any>;
  path: string;
}



export function getQuickActions(): QuickAction[] {
  const actions: QuickAction[] = [];
  function traverse(items: any[]) {
    for (const item of items) {
      if (item.path && item.label && item.icon) {
        actions.push({ title: item.label, icon: item.icon, path: item.path });
      }
      if (item.children) traverse(item.children);
    }
  }
  traverse(employeeSidebarItems);
  traverse(hrSidebarItems);
  return actions;
}
