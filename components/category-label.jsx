export const CategoryLabel = ({ name }) => {
  const getColor = (categoryName) => {
    switch (categoryName.trim()) {
      case "Dự án phần mềm":
        return "text-purple-600 bg-purple-200 ";
      case "Dự án web":
        return "text-yellow-600 bg-yellow-200";
      case "Dự án di động":
        return "text-pink-500 bg-pink-200 ";
      default:
        return "text-gray-600";
    }
  };

  return (
    <span className={`text-[13px] rounded px-2 py-1 ${getColor(name)}`}>
      {name}
    </span>
  );
};
