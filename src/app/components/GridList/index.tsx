import React from "react";

export function GridList({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="bg-[#fff] rounded-lg shadow-lg shadow-orange-300 pt-4"
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export default GridList;
