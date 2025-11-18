import baseApi from "../../api/baseApi";

export const parentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // session get all api endpoint
    getAllParents: builder.query({
      query: ({ page = 1, limit = 10, searchTerm }) => {
        return {
          url: `admin/parents`,
          method: "GET",
          params: {
            searchTerm,
            page,
            limit,
          },
        };
      },
      providesTags: ["parents"],
    }),
    // session get all api endpoint
    getParentProfessionals: builder.query({
      query: ({ page = 1, limit = 10, searchTerm, id }) => {
        return {
          url: `admin/parent-assigned-professionals/${id}`,
          method: "GET",
          params: {
            searchTerm,
            page,
            limit,
          },
        };
      },
      providesTags: ["parents"],
    }),

    // assigned profession post api
    assignedProfessional: builder.mutation({
      query: ({ parentId, professionalId, data }) => {
        return {
          url: `admin/${parentId}/${professionalId}/assign-professional`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["parents"],
    }),

    // remove professionals
    removeProfessional: builder.mutation({
      query: (id) => {
        return {
          url: `admin/session/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["parents"],
    }),
  }),
});

export const {
  useGetAllParentsQuery,
  useGetParentProfessionalsQuery,
  useAssignedProfessionalMutation,
  useRemoveProfessionalMutation,
} = parentsApi;
