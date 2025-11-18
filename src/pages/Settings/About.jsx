import { Button, Spin } from "antd";
import { useNavigate } from "react-router";
import PageHeading from "../../components/PageHeading";
import { useGetAboutQuery } from "../../redux/features/setting/settingApi";

const About = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetAboutQuery();

  return (
    <div className="min-h-[80vh] flex flex-col justify-between">
      <div className="space-y-4">
        <PageHeading title={"About Us"} disbaledBackBtn={true} />
        <div className="w-full bg-white rounded-2xl min-h-[60vh] p-5">
          {isLoading ? (
            <div className="h-[60vh] w-full flex justify-center items-center">
              <Spin size="large" />
            </div>
          ) : (
            <div
              className="no-tailwind"
              dangerouslySetInnerHTML={{ __html: data?.data[0]?.content }}
            />
          )}
        </div>

        <div className="flex justify-end pt-5">
          <Button
            onClick={() => navigate("edit")}
            size="large"
            htmlType="submit"
            type="primary"
            className="px-8 w-[250px]"
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
