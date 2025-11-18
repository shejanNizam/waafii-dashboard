import baseApi from "../../api/baseApi";

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // session get all api endpoint
    getAllSession: builder.query({
      query: ({ page = 1, limit = 10, searchTerm }) => {
        return {
          url: `admin/sessions`,
          method: "GET",
          params: {
            searchTerm,
            page,
            limit,
          },
        };
      },
      providesTags: ["sessions", "parents"],
    }),
  }),
});

export const { useGetAllSessionQuery } = sessionApi;
