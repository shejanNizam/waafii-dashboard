import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserByTokenQuery } from "../../redux/features/user/userApi";
import { setUser } from "../../redux/slices/authSlice";
import ThemeProvider from "./ThemeProvider";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const { data, isLoading } = useGetUserByTokenQuery();
  // console.log(data?.data);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setUser({ user: data?.data || null }));
    }
  }, [data, isLoading, dispatch]);

  return <ThemeProvider>{children}</ThemeProvider>;
};

export default AuthProvider;
