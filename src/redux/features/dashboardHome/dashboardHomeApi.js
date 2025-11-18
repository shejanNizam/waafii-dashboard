import baseApi from "../../api/baseApi";

export const dashboardHomeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // DashboardHome page
    getAllStats: builder.query({
      query: (year) => ({
        url: `admin/session-stats?year=${year}`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),

    // Earning in DashboardHome page
    getEarnings: builder.query({
      query: (year) => ({
        url: `/dashboard/earning-chart?year=${year}`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const { useGetAllStatsQuery, useGetEarningsQuery } = dashboardHomeApi;
