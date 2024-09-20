import { useEffect, useState } from "react";
import Papa from "papaparse";
import JobsTable from "./components/JobsTable";
import LineGraph from "./components/LineGraph";
import MainTable from "./components/MainTable";
import { SalaryData, TableData } from "./types";
import { Modal } from "antd";

type JobCountData = {
  jobTitle: string;
  count: number;
};

function App() {
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [jobCountData, setJobCountData] = useState<JobCountData[]>([]);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
  const [isBotModalOpen, setIsBotModalOpen] = useState(false);

  const handleJobsModalClose = () => {
    setIsJobsModalOpen(false);
  };

  const handleBotModalClose = () => {
    setIsBotModalOpen(false);
  };

  const rowClickHandler = (year: string) => {
    setSelectedYear(year);

    const filteredData = salaryData.filter((row) => row.work_year === year);
    const jobTitlesWithCount: { [key: string]: number } = {};

    filteredData.forEach((row) => {
      if (!jobTitlesWithCount[row.job_title]) {
        jobTitlesWithCount[row.job_title] = 0;
      }
      jobTitlesWithCount[row.job_title] += 1;
    });

    const jobCountData = Object.keys(jobTitlesWithCount).map((jobTitle) => ({
      jobTitle,
      count: jobTitlesWithCount[jobTitle],
    }));

    setJobCountData(jobCountData);
    setIsJobsModalOpen(true);
  };

  useEffect(() => {
    fetch("/salaries.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse<SalaryData>(csvData, {
          header: true,
          complete: (result) => {
            setSalaryData(result.data);
          },
          skipEmptyLines: true,
        });
      });
  }, []);

  useEffect(() => {
    const yearWiseData: {
      [key: string]: { totalJobs: number; totalSalary: number };
    } = {};

    salaryData.forEach((row) => {
      const { work_year, salary_in_usd } = row;

      const salaryInUsd = Number(salary_in_usd);
      if (isNaN(salaryInUsd)) return;

      if (!yearWiseData[work_year]) {
        yearWiseData[work_year] = { totalJobs: 0, totalSalary: 0 };
      }

      yearWiseData[work_year].totalJobs += 1;
      yearWiseData[work_year].totalSalary += salaryInUsd;
    });

    const processedData = Object.keys(yearWiseData).map((year) => ({
      year,
      totalJobs: yearWiseData[year].totalJobs,
      avgSalary: Math.round(
        yearWiseData[year].totalSalary / yearWiseData[year].totalJobs
      ),
    }));

    setTableData(processedData);
  }, [salaryData]);

  return (
    <div className="App">
      <div className="bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#7e18c2,#ffffff_100%)]">
        <div className="container p-[86px]">
          <div className="flex justify-between">
            <div className="w-[478px]">
              <h1 className="text-7xl font-bold tracking-tighter mt-6 py-1 bg-gradient-to-b from-black to-[#23082f] text-transparent bg-clip-text">
                Annual Job Trends and Salary Overview (2020-2024)
              </h1>
              <p className="text-xl text-[#25013e] tracking-tight mt-6">
                Chat with our AI bot to explore trends and insights from salary
                data between 2020 and 2024. Instantly analyze job market trends,
                salary distributions, and more.
              </p>
              <div className="mt-[30px]">
                <button
                  onClick={() => setIsBotModalOpen(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tighter"
                >
                  Get insights
                </button>
              </div>
            </div>
            <div className="relative w-[700px]">
              <div className="bg-white z-10 w-fit rounded shadow p-2 absolute -top-[60px] -left-[100px]">
                <MainTable data={tableData} onRowClick={rowClickHandler} />
              </div>
              <div className="bg-white z-10 w-fit rounded shadow p-2 absolute -bottom-[50px] right-[100px]">
                <LineGraph data={tableData} />
              </div>
              <img
                src="string.png"
                alt="string-image"
                className="absolute h-40 w-40 right-40 top-40"
              />
            </div>
          </div>
        </div>
        <Modal
          title={`Jobs in ${selectedYear}`}
          open={isJobsModalOpen}
          onCancel={handleJobsModalClose}
          footer={null}
          centered
          width={600}
          styles={{
            body: {
              height: "600px",
              padding: 10,
              display: "flex",
              justifyContent: "center",
            },
          }}
        >
          <JobsTable data={jobCountData} />
        </Modal>
        <Modal
          open={isBotModalOpen}
          onCancel={handleBotModalClose}
          footer={null}
          centered
          width={600}
          styles={{
            body: {
              height: "600px",
              padding: 20,
              display: "flex",
              justifyContent: "center",
            },
          }}
        >
          <iframe
            src="https://app.relevanceai.com/form/d7b62b/82038672-8532-44c5-80f2-0936c61ee389?version=latest"
            className="w-full h-full rounded"
          ></iframe>
        </Modal>
      </div>
    </div>
  );
}

export default App;
