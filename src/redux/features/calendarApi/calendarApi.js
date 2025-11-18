import baseApi from "../../api/baseApi";

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // event get all api endpoint
    getAllEvents: builder.query({
      query: ({ page = 1, limit = 10, eventDate }) => {
        return {
          url: `events/?eventDate=${eventDate}`,
          method: "GET",
          params: {
            page,
            limit,
          },
        };
      },
      providesTags: ["calendar"],
    }),

    // create event api endpoint
    createEvent: builder.mutation({
      query: (data) => {
        return {
          url: `events/add-event`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["calendar"],
    }),

    // delete api
    deleteEvent: builder.mutation({
      query: (id) => {
        return {
          url: `events/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["calendar"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useCreateEventMutation,
  useDeleteEventMutation,
} = calendarApi;
