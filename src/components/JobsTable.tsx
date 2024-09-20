import { Table } from "antd";

type JobsTableProps = {
  data: { jobTitle: string; count: number }[];
};

export default function   JobsTable(props: JobsTableProps) {
  const columns = [
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      sorter: (a: { count: number }, b: { count: number }) => a.count - b.count,
    },
  ];

  return (
    <Table
      dataSource={props.data}
      columns={columns}
      rowKey="jobTitle"
      className="w-[500px] h-[300px]"
      scroll={{ y: 450 }} 
    />
  );
}
