import React from "react";

const Board = async (props) => {
  const { id } = await props.params;
  console.log("id: ", id);

  return <div>page</div>;
};

export default Board;
