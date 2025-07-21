import React from "react";

const Navbar = () => {
  return (
    <nav className="flex h-16 items-center justify-between px-6">
      <div className="text-2xl font-semibold">Employees</div>
      <div className="flex items-center gap-x-6">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.5 7.5a2.25 2.25 0 01-3.182 0l-7.5-7.5A2.25 2.25 0 012.25 6.993V6.75"
            />
          </svg>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </div>

        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 004.478-1.31A2.25 2.25 0 0021 13.685V11.25c0-3.591-2.366-6.71-5.813-7.591a2.25 2.25 0 00-4.374 0C5.366 4.54 3 7.659 3 11.25v2.436a2.25 2.25 0 001.665 2.087c1.4.47 2.91.936 4.478 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0v.668a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v-.668"
            />
          </svg>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </div>

        <img
          src="https://randomuser.me/api/portraits/women/68.jpg"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </nav>
  );
};

export default Navbar;
