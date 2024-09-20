import { Table } from "antd";
import { TableData } from "../types";

type MainTableProps = {
  data: TableData[];
  onRowClick: (year: string) => void;
};

export default function MainTable(props: MainTableProps) {
  const columns = [
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: (a: TableData, b: TableData) => Number(a.year) - Number(b.year),
    },
    {
      title: "Number of total jobs",
      dataIndex: "totalJobs",
      key: "totalJobs",
      sorter: (a: TableData, b: TableData) => a.totalJobs - b.totalJobs,
    },
    {
      title: "Average salary (in USD)",
      dataIndex: "avgSalary",
      key: "avgSalary",
      sorter: (a: TableData, b: TableData) => a.avgSalary - b.avgSalary,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
  ];

  return (
    <Table
      dataSource={props.data}
      columns={columns}
      pagination={false}
      bordered
      className="w-[500px] h-fit overflow-hidden rounded-lg"
      onRow={(record) => ({
        onClick: () => props.onRowClick(record.year),
      })}
    />
  );
}
