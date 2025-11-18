import baseApi from "../../api/baseApi";

export const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // about  start
    getAbout: builder.query({
      query: () => ({
        url: "/rules/aboutus",
        method: "GET",
      }),
      providesTags: ["settings"],
    }),

    updateAbout: builder.mutation({
      query: ({ data, id }) => ({
        url: `/rules/aboutus/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
    // about  end

    //  terms start
    getTerms: builder.query({
      query: () => ({
        url: "/rules/terms",
        method: "GET",
      }),
      providesTags: ["settings"],
    }),

    updateTerms: builder.mutation({
      query: ({ data, id }) => ({
        url: `/rules/terms/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
    //  terms end

    // privacy start
    getPrivacy: builder.query({
      query: () => ({
        url: "/rules/privacy",
        method: "GET",
      }),
      providesTags: ["settings"],
    }),

    updatePrivacy: builder.mutation({
      query: ({ data, id }) => ({
        url: `/rules/privacy/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
    // privacy end
  }),
});

export const {
  useGetAboutQuery,
  useUpdateAboutMutation,
  useGetTermsQuery,
  useUpdateTermsMutation,
  useGetPrivacyQuery,
  useUpdatePrivacyMutation,
} = settingApi;
