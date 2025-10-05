import React from "react";

const TabPanel= ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex w-full">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 text-center py-2 text-sm font-medium border-b-2 transition-colors duration-200
            ${
              activeTab === tab
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-purple-500"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabPanel;
