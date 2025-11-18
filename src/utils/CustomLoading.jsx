import { FaServer } from "react-icons/fa";

export default function CustomLoading() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* 1. Static Outer Ring */}
        <div className="absolute w-full h-full border-4 border-gray-700 rounded-full"></div>

        {/* 2. Rotating Inner Ring (CSS animation required) */}
        <div
          className="absolute w-20 h-20 border-4 border-dashed border-cyan-400 rounded-full"
          style={{ animation: "spin-fast 2s linear infinite" }}
        ></div>

        {/* 3. Central Fingerprint Icon (Simulated with text/icon placeholder) */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <span
            className="text-6xl font-sans text-cyan-500"
            style={{
              filter: "drop-shadow(0 0 5px cyan)", // Creates the glow
              fontFamily: "Material Icons", // Use a font/icon library like Material Icons or Font Awesome for a real fingerprint icon
            }}
          >
            <FaServer size={32} />
            {/* <FiShield size={40} /> */}
          </span>

          {/* 4. Scanning Line (CSS animation required) */}
          <div
            className="absolute h-[80%] w-0.5 bg-cyan-400 origin-bottom"
            style={{
              animation: "scan-sweep 2s ease-in-out infinite alternate",
            }}
          ></div>
        </div>
      </div>

      <div className="text-center">
        <p className="font-sans text-xl font-semibold text-cyan-400 animate-pulse">
          PROCESSING...
        </p>
        {/* <p className="font-mono text-gray-500 text-sm mt-1">
          Connecting to server...
        </p> */}
      </div>
    </div>
  );
}
