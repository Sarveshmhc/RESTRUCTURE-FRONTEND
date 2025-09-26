import React, { useState } from "react";
type AccordionProps = {
  title: string;
  children: React.ReactNode;
};
const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded mb-2">
      <button
        className="w-full px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-800"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
      </button>
      {open && <div className="px-4 py-2">{children}</div>}
    </div>
  );
};
export default Accordion;