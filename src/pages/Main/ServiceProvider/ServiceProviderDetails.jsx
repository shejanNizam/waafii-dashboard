import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import image from "../../../assets/main_logo/main_logo_waafii.svg";

const DetailRow = ({ label, value }) => (
  <div className="py-2 border-b border-gray-200">
    <div className="text-sm text-gray-500 font-normal">{label}</div>
    <div className="text-base text-gray-800 mt-0.5">{value}</div>
  </div>
);

export default function ServiceProviderDetails() {
  const navigate = useNavigate();

  const providerData = {
    name: "Darlene Robertson",
    phone: "+966 24574566",
    email: "ahgakihgal@gamil.com",
    address: "34/2A, titan road, City, country",
    imageUrl: image,
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4 cursor-pointer"
      >
        <FaArrowLeft />
        Service Provider details
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3 p-4 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden mb-2">
              <img
                src={providerData.imageUrl}
                alt={providerData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center text-base font-medium text-gray-800 mt-2">
              {providerData.name}
            </div>
          </div>

          <div className="w-full sm:w-2/3 space-y-2">
            <DetailRow label="Phone" value={providerData.phone} />
            <DetailRow label="E-mail" value={providerData.email} />
            <DetailRow label="Address" value={providerData.address} />
            <div className="mt-4">
              <div className="text-sm text-gray-500 font-normal mb-3">
                Service License
              </div>
              <button
                className="w-full sm:w-auto px-4 py-2 text-base font-medium rounded-lg text-green-700 bg-green-100 border border-green-300 hover:bg-green-200 transition duration-150"
                onClick={() => alert("Viewing License")}
              >
                View license
              </button>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />
      </div>
    </div>
  );
}
