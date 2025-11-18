// Functional component for the detail rows (Phone, E-mail, Address)
const DetailRow = ({ label, value }) => (
  <div className="py-2 border-b border-gray-200">
    <div className="text-sm text-gray-500 font-normal">{label}</div>
    <div className="text-base text-gray-800 mt-0.5">{value}</div>
  </div>
);

export default function ServiceProviderDetails() {
  // Mock data based on the image
  const providerData = {
    name: "Darlene Robertson",
    phone: "+966 24574566",
    email: "ahgakihgal@gamil.com",
    address: "34/2A, titan road, City, country",
    imageUrl: "/placeholder-profile-image.jpg", // Use a real path or imported image
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="flex items-center text-lg font-medium text-gray-900 mb-4 cursor-pointer">
        {/* Back Arrow - Using a simple text arrow for demonstration */}
        <span className="mr-2">&lt;</span>
        Service Provider details
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-2xl mx-auto">
        {/* Profile and Contact Details Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Profile Card */}
          <div className="w-full sm:w-1/3 p-4 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
            {/* Image placeholder */}
            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden mb-2">
              {/* Replace with actual image tag */}
              {/* Note: The image in the example is inside a larger rounded shape */}
              <img
                src={providerData.imageUrl}
                alt={providerData.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Name inside the profile card */}
            <div className="text-center text-base font-medium text-gray-800 mt-2">
              {providerData.name}
            </div>
          </div>

          {/* Details List */}
          <div className="w-full sm:w-2/3 space-y-2">
            <DetailRow label="Phone" value={providerData.phone} />
            <DetailRow label="E-mail" value={providerData.email} />
            <DetailRow label="Address" value={providerData.address} />
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Service License Section */}
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
  );
}
