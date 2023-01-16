import { format, isSameDay, isSameMonth, toDate } from "date-fns";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { calendarDayList } from "../../atoms";

interface ITest {
  day: Date;
  monthStart: Date;
  currentMonth: Date;
  selectedDate: Date;
  onDateClick: (day: Date) => Date;
  cloneDay: Date;
  formattedDate: string;
  // dayList: string[];
}

const CalendarTest = ({
  day,
  monthStart,
  currentMonth,
  selectedDate,
  onDateClick,
  cloneDay,
  formattedDate,
}: ITest) => {
  const [isActive, setIsActive] = useState(false);
  const [dayList, setDayList] = useRecoilState(calendarDayList);
  let currentDay = new Date();
  console.log(dayList);

  // useEffect(() => {
  //   for (const d of dayList) {
  //     if (String(day) === d) {
  //       console.log("같을 때", d);
  //       setIsActive(true);
  //     } else {
  //       console.log("다를 때", d);
  //       setIsActive(false);
  //     }
  //   }
  // }, [currentMonth]);

  const onClickCellHandler = () => {
    onDateClick(toDate(cloneDay));
    setIsActive((pre) => !pre);

    if (isActive) {
      const copy = dayList.filter((days) => {
        return days !== String(day);
      });
      setDayList([...copy]);
    } else {
      setDayList([...dayList, String(day)]);
    }
  };

  return (
    <Cells
      key={String(day)}
      color={
        !isSameMonth(day, monthStart)
          ? "#adb5bd"
          : format(currentMonth, "M") !== format(day, "M")
          ? "#adb5bd"
          : "black"
      }
      onClick={onClickCellHandler}
      backgroundColor={
        // dayList와 같은 날이라면......skyblue로....

        isActive
          ? "skyblue"
          : isSameDay(day, currentDay)
          ? "#EDE1E3"
          : "transparent"
      }
    >
      <CellsNum
        color={
          format(currentMonth, "M") !== format(day, "M") ? "#adb5bd" : "black"
        }
      >
        {formattedDate}
      </CellsNum>
    </Cells>
  );
};

const Cells = styled.div<{ color: string; backgroundColor: string }>`
  width: 40px;
  height: 40px;
  padding-top: 3px;
  border-radius: 15px;
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CellsNum = styled.span<{ color: string }>`
  color: ${(props) => props.color};
`;

export default CalendarTest;
