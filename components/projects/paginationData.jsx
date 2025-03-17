import { Pagination } from "antd";
import { useState } from "react";

const PaginationData = ({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center my-5">
      <Pagination
        size="small"
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </div>
  );
};

export default PaginationData;
