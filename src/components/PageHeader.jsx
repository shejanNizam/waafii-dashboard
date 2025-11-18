const PageHeader = ({ title }) => {
  return (
    <div className="flex justify-between items-center px-4 py-1.5 rounded-md drop-shadow-xs shadow-inherit ">
      <h3 className="font-semibold text-brand text-2xl">{title}</h3>
      <div className=""></div>
    </div>
  );
};

export default PageHeader;
