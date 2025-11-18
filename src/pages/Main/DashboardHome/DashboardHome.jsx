import dayjs from "dayjs";
import { useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { useGetAllStatsQuery } from "../../../redux/features/dashboardHome/dashboardHomeApi";
import { StatCard } from "../../../utils/utils";
import DashboardChart from "./DashboardChart";

export default function DashboardHome() {
  const [year, setYear] = useState(dayjs().year());
  const { data } = useGetAllStatsQuery(year);
  // console.log(data?.data);

  const totalParents = data?.data?.totalParents || "N/A";
  const totalTutors = data?.data?.totalTutors || "N/A";
  const totalSessions = data?.data?.totalSessions || "N/A";
  const monthlySessions = data?.data?.monthlySessions || [];

  return (
    <div className="space-y-6 p-2 md:p-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Earnings"
          value={totalParents}
          icon={FaMoneyBillWave}
          colorClass="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Total Clients"
          value={totalTutors}
          icon={FaUsers}
          colorClass="bg-green-100 text-green-600"
        />

        <StatCard
          title="Total Providers"
          value={totalSessions}
          icon={FaUsers}
          colorClass="bg-yellow-100 text-yellow-600"
        />
      </div>

      <div>
        <DashboardChart
          monthlySessions={monthlySessions}
          year={year}
          setYear={setYear}
        />
      </div>
    </div>
  );
}
