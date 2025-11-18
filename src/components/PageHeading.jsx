import { FaArrowLeftLong } from "react-icons/fa6";

import { useNavigate } from "react-router";
// import { cn } from "../lib/utils";

const PageHeading = ({ title, backPath, disbaledBackBtn }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-1 ">
      {!disbaledBackBtn && (
        <button
          className="outline-none px-2"
          onClick={() => navigate(backPath || "/")}
        >
          <FaArrowLeftLong size={22} />
        </button>
      )}
      {!!title && <h1 className="text-2xl font-bold">{title}</h1>}
    </div>
  );
};

export default PageHeading;
