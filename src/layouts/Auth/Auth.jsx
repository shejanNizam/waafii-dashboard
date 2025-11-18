import { Outlet } from "react-router";
import logo from "../../assets/main_logo/main_logo_waafii.svg";

export default function Auth() {
  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7 xl:gap-12 justity-center items-center min-h-[90vh] md:divide-x divide-slate-300 py-14">
      <div className="flex justify-center items-center h-full">
        <div className="max-w-32 sm:max-w-40 lg:max-w-80 w-full max-h-32 sm:max-h-40 lg:max-h-80 h-full">
          <img className="w-full h-full" src={logo} alt="logo" />
        </div>
      </div>
      <div className="max-w-xl px-[4%]">
        <Outlet />
      </div>
    </div>
  );
}
