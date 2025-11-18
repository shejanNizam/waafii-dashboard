import baseApi from "../../api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserByToken: builder.query({
      query: () => {
        return {
          url: `users/me`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),

    updateUser: builder.mutation({
      query: (data) => {
        return {
          url: `/users/edit-profile`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["user"],
    }),

    getAllUser: builder.query({
      query: ({ page = 1, limit = 10, name }) => ({
        url: `/dashboard/user-list`,
        method: "GET",
        params: {
          page,
          limit,
          name,
        },
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetUserByTokenQuery,
  useUpdateUserMutation,
  useGetAllUserQuery,
} = userApi;
