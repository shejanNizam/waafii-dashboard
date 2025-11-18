import baseApi from "../../api/baseApi";

export const resourceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // grade get all api endpoint
    getAllGrade: builder.query({
      query: ({ page = 1, limit = 10, searchTerm }) => {
        return {
          url: `grades`,
          method: "GET",
          params: {
            searchTerm,
            page,
            limit,
          },
        };
      },
      providesTags: ["resource"],
    }),

    // create grade api endpoint
    createGrade: builder.mutation({
      query: (data) => {
        return {
          url: `grades/add-grade`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["resource"],
    }),
    // delete grade
    deleteGrade: builder.mutation({
      query: (id) => {
        return {
          url: `grades/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["resource"],
    }),

    // subject get all api endpoint
    getAllSubject: builder.query({
      query: ({ page = 1, limit = 10, searchTerm, id }) => {
        return {
          url: `subjects/${id}`,
          method: "GET",
          params: {
            searchTerm,
            page,
            limit,
          },
        };
      },
      providesTags: ["resource"],
    }),
    // create subject api endpoint
    createSubject: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `subjects/${id}/add-subject`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["resource"],
    }),

    // delete subject
    deleteSubject: builder.mutation({
      query: (id) => {
        return {
          url: `subjects/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["resource"],
    }),

    // materials get all api endpoint
    getAllMaterials: builder.query({
      query: ({ page = 1, limit = 10, searchTerm, id }) => {
        return {
          url: `materials/${id}`,
          method: "GET",
          params: {
            searchTerm,
            page,
            limit,
          },
        };
      },
      providesTags: ["resource"],
    }),

    // create subject api endpoint
    createMaterials: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `materials/add-material/${id}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["resource"],
    }),

    // delete subject
    deleteMaterial: builder.mutation({
      query: (id) => {
        return {
          url: `materials/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["resource"],
    }),
  }),
});

export const {
  // Grade
  useGetAllGradeQuery,
  useCreateGradeMutation,
  useDeleteGradeMutation,

  // Subject
  useGetAllSubjectQuery,
  useCreateSubjectMutation,
  useDeleteSubjectMutation,

  // Materials
  useGetAllMaterialsQuery,
  useCreateMaterialsMutation,
  useDeleteMaterialMutation,
} = resourceApi;
