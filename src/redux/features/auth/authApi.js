import baseApi from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData) => {
        return {
          url: "auth/login",
          method: "POST",
          body: loginData,
        };
      },
    }),

    forgotPassword: builder.mutation({
      query: (data) => {
        return {
          url: `auth/forget-password`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),

    verifyEmail: builder.mutation({
      query: (payload) => {
        return {
          url: `auth/verify-otp`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["auth"],
    }),

    resendOtp: builder.query({
      query: (email) => ({
        url: `/dashboard/admin/resend-otp?email=${email}`,
        method: "POST",
      }),
      providesTags: ["auth"],
    }),

    resetPassword: builder.mutation({
      query: (payload) => {
        return {
          url: `auth/reset-password`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["auth"],
    }),

    changePassword: builder.mutation({
      query: (data) => {
        return {
          url: `auth/change-password`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  // useResendOtpQuery,
  useLazyResendOtpQuery,
  useChangePasswordMutation,
} = authApi;
