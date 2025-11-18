import baseApi from "../api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `notifications`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["notification"],
    }),
  }),
});

export const { useGetAllNotificationsQuery } = notificationApi;
