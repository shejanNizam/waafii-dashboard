import { DatePicker } from "antd";
import dayjs from "dayjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardChart = ({ year, setYear }) => {
  // const DashboardChart = ({ monthlySessions, year, setYear }) => {
  // const [year, setYear] = useState(dayjs().year());
  // console.log(data);

  const demoData = [
    { month: "Jan", sessions: 150 },
    { month: "Feb", sessions: 120 },
    { month: "Mar", sessions: 180 },
    { month: "Apr", sessions: 165 },
    { month: "May", sessions: 220 },
    { month: "Jun", sessions: 190 },
    { month: "Jul", sessions: 250 },
    { month: "Aug", sessions: 210 },
    { month: "Sep", sessions: 170 },
    { month: "Oct", sessions: 270 },
    { month: "Nov", sessions: 200 },
    { month: "Dec", sessions: 300 },
  ];

  // const { data } = useGetEarningsQuery(year);
  // console.log(data?.data);

  const handleYearChange = (date) => {
    // if (data) {
    setYear(date.year());
    // }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg sm:text-xl font-bold text-gray-700">
          Monthly Sessions
        </h4>
        <DatePicker
          picker="year"
          value={dayjs().year(year)}
          onChange={handleYearChange}
          size="large"
        />
      </div>

      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={demoData}
          // data={monthlySessions}
          syncId="monthlyAnalytics"
          margin={{
            top: 20,
            right: 10,
            left: -10,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#03A188"
            vertical={false}
          />{" "}
          <XAxis
            tick={{ fill: "#03A188" }}
            style={{ fontSize: "12px" }}
            dataKey="month"
          />
          <YAxis />
          <Tooltip
            cursor={{ fill: "#f3f4f6" }}
            contentStyle={{
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />
          <Bar
            dataKey="sessions"
            name="Total Sessions"
            fill="#03A188"
            barSize={30}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
