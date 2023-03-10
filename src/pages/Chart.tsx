import { useQuery } from "@tanstack/react-query";
import { forwardRef, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import styled from "styled-components";
import { getFiveMonths, getHours } from "../APIs/chartApi";
import Footer from "../components/footer/Footer";
import LayOut from "../components/layout/LayOut";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const data = {
  thisMonth: {
    labels: ["카페", "영화관", "찜질방"],
    colors: ["#5FCE80", "#6290F0", "#ab51b9d7"],
    series: [44, 70, 20],
  },
  fiveMonth: {
    series: [
      {
        name: "카페",
        data: [31, 40, 28, 52, 100],
      },
      {
        name: "영화관",
        data: [11, 32, 55, 45, 60],
      },
    ],
    colors: ["#6290F0", "#5FCE80"],
    categories: ["2022-09", "2022-10", "2022-11", "2022-12", "2023-01"],
  },
};

const Chart = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("is_login");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));
  const [startDate, setStartDate] = useState(new Date());
  // let date = new Date().toISOString().slice(0, 7);
  const { data, isLoading, refetch } = useQuery(["getHours"], () =>
    getHours(format(startDate, "yyyyMM"))
  );

  const { data: fiveMthsData, isLoading: fiveMthsLoading } = useQuery(
    ["getFiveMonths"],
    () => getFiveMonths()
  );

  let totalHours = 0;

  if (!isLoading) {
    for (const hour of data.series) {
      totalHours += hour;
    }
  }

  useEffect(() => {
    refetch();
  }, [startDate]);

  const ExampleCustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <Button className="example-custom-input" onClick={onClick} ref={ref}>
      {value}
      <img src="/image/iconCalendarInput.png" />
    </Button>
  ));

  return (
    <LayOut padding="0 17px 50px 17px" height="100vh">
      {/* <DatePicker
        selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
        dateFormat="yyyy년 M월"
        showMonthYearPicker
        locale={ko}
        className="selectedMonth"
        customInput={<ExampleCustomInput />}
      /> */}

      <ChartBar>
        <div>나의 근무 통계</div>
        <img src="image/iconMypage.svg" onClick={() => navigate("/mypage")} />
      </ChartBar>

      {isLoading ? null : (
        <>
          <SelectMonth>
            <WorkingHours>
              <div>{data?.nickname}님의 일한 시간</div>
              <div>{totalHours}시간</div>
            </WorkingHours>
            <div>
              <DatePicker
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                dateFormat="yyyy년 M월"
                showMonthYearPicker
                locale={ko}
                className="selectedMonth"
                customInput={<ExampleCustomInput />}
              />
            </div>
          </SelectMonth>

          <ReactApexChart
            options={{
              chart: {
                type: "donut",
              },
              plotOptions: {
                pie: {
                  startAngle: -90,
                  endAngle: 270,
                  expandOnClick: false,
                  donut: {
                    size: "50%",
                    // labels: {
                    //   show: true,
                    //   total: {
                    //     showAlways: true,
                    //     show: true,
                    //     label: "총 일한 시간",
                    //     fontSize: "10px",
                    //     color: "black",
                    //   },
                    //   value: {
                    //     fontSize: "15px",
                    //     show: true,
                    //     color: "black",
                    //     offsetY: 0,
                    //   },
                    // },
                  },
                },
              },
              labels: data.labels,
              dataLabels: {
                enabled: false,
              },
              fill: {
                colors: data.colors,
              },
              legend: {
                markers: {
                  fillColors: data.colors,
                },
              },
              responsive: [
                {
                  breakpoint: 600,
                  options: {
                    chart: {
                      width: 250,
                    },
                    legend: {
                      position: "bottom",
                    },
                  },
                },
              ],
            }}
            series={data.series}
            type="donut"
            style={{ width: "250px", margin: "0 auto" }}
          />
        </>
      )}

      {fiveMthsLoading ? null : fiveMthsData?.categories.length <= 1 ? null : (
        <>
          <ChartText marginTop="40px">
            최근 {fiveMthsData?.categories.length}개월 소득을 확인하세요!
          </ChartText>

          <ReactApexChart
            options={{
              chart: {
                height: 350,
                type: "area",
                toolbar: {
                  show: false,
                },
              },
              grid: { show: false },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "smooth",
              },
              xaxis: {
                axisBorder: { show: false },
                axisTicks: { show: true },
                labels: { show: false },
                type: "datetime",
                categories: fiveMthsData?.categories,
              },
              yaxis: {
                show: false,
              },
              tooltip: {
                x: {
                  format: "yyyy/MM",
                },
              },
              colors: fiveMthsData?.colors,
              legend: {
                markers: {
                  fillColors: fiveMthsData?.colors,
                },
              },
            }}
            series={fiveMthsData?.series}
            type="area"
            height={250}
            width={340}
          />
        </>
      )}
    </LayOut>
  );
};
const ChartBar = styled.div`
  width: 100%;
  min-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
  font-weight: 500;

  img {
    cursor: pointer;
  }
`;

const ChartText = styled.div<{ marginTop: string }>`
  width: 100%;
  height: 50px;
  font-size: 19px;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : "0px")};
`;

const WorkingHours = styled.div`
  font-weight: 400;

  div:first-child {
    font-size: 13px;
    margin-bottom: 5px;
  }
  div:last-child {
    font-size: 24px;
    font-weight: 600;
  }
`;

const SelectMonth = styled.div`
  width: 340px;
  display: flex;
  justify-content: space-between;
  margin: 15px 0px 15px 0px;
`;

const Button = styled.button`
  width: 140px;
  height: 44px;
  font-family: "Noto Sans KR";
  font-weight: 500;
  font-size: 15px;
  border: none;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
    margin-left: 7px;
  }
`;

export default Chart;
