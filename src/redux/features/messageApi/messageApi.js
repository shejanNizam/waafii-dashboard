import baseApi from "../../api/baseApi";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get all conmversations
    getAllConversations: builder.query({
      query: ({ page = 1, limit = 10, type }) => {
        return {
          url: `conversations`,
          method: "GET",
          params: {
            type,
            page,
            limit,
          },
        };
      },
      providesTags: ["message"],
    }),

    //  get conversation by id
    getConversationById: builder.query({
      query: (id) => {
        return {
          url: `conversations/${id}`,
          method: "GET",
        };
      },
      providesTags: ["message"],
    }),

    // get all messages
    getAllMessages: builder.query({
      query: ({ page = 1, limit = 10, conversionId }) => {
        return {
          url: `messages/${conversionId}`,
          method: "GET",
          params: {
            page,
            limit,
          },
        };
      },
      providesTags: ["message"],
    }),

    //  send message
    sendMessage: builder.mutation({
      query: ({ conversionId, data }) => {
        return {
          url: `messages/${conversionId}/send-message`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["message"],
    }),

    // send file
    sendFile: builder.mutation({
      query: ({ conversionId, formData }) => {
        return {
          url: `attachments/${conversionId}/send-attachment`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["message"],
    }),
  }),
});

export const {
  useGetAllConversationsQuery,
  useGetConversationByIdQuery,
  useGetAllMessagesQuery,
  useSendMessageMutation,
  useSendFileMutation,
} = messageApi;
