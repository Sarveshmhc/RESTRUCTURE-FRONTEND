import React from "react";
type Tab = { id: string; label: string };
type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
};
const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex space-x-2 border-b mb-4">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={`px-4 py-2 font-semibold ${
          activeTab === tab.id
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-600"
        }`}
        onClick={() => onTabChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
export default Tabs;