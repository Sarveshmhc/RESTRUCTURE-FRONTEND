import React from "react";

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="main-content flex-1 p-4 md:p-6 lg:p-8 rounded-[16px] shadow-[0_1px_2px_var(--shadow)]">
    <div className="max-w-7xl mx-auto">{children}</div>
  </main>
);

export default MainContent;