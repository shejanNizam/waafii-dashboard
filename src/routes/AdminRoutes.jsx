import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import CustomLoading from "../utils/CustomLoading";

const AdminRoutes = ({ children }) => {
  const location = useLocation();
  const { user, isLoading } = useSelector((state) => state.auth);
  // console.log(user);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900">
        <CustomLoading />
      </div>
    );
  }

  if (user?.role === "admin") {
    return children;
  }
  return <Navigate state={location.pathname} to="/auth" />;
};

export default AdminRoutes;
