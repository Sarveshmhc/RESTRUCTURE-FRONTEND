import React from "react";

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
    <div className="max-w-7xl mx-auto">{children}</div>
  </main>
);

export default MainContent;