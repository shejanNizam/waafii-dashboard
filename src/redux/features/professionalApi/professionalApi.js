import baseApi from "../../api/baseApi";

export const professionalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // profession get all api endpoint
    getAllProfessional: builder.query({
      query: ({ page = 1, limit = 10, searchTerm }) => {
        return {
          // url: `admin/professionals`,
          url: `admin/professionals`,
          method: "GET",
          params: {
            searchTerm,
            page,
            limit,
          },
        };
      },
      providesTags: ["professional"],
    }),
  }),
});

export const { useGetAllProfessionalQuery } = professionalApi;
