import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

const AlarmComponent = () => {
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [alarmMessage, setAlarmMessage] = useState("");

  useEffect(() => {
    const checkAlarm = setInterval(() => {
      if (isAlarmSet) {
        const now = new Date();
        const currentTime = `${now.getHours()}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`;

        if (currentTime === alarmTime) {
          toast({
            title: "Its " + currentTime + "!",
            description: "Your alarm is ringing! Time to take a break."
          })
          setIsAlarmSet(false);
        }
      }
    }, 1000);

    return () => clearInterval(checkAlarm);
  }, [alarmTime, isAlarmSet]);

  const handleSetAlarm = () => {
    if (alarmTime) {
      setIsAlarmSet(true);
      setAlarmMessage(`Alarm set for ${alarmTime}`);
    }
  };

  const handleAlarmChange = (event: any) => {
    setAlarmTime(event.target.value);
  };

  return (
    <div className="mx-auto">
      <div className="justify-center flex gap-x-2 items-center my-4 pt-2">
      <h1 className="font-semibold mr-4">Set an Alarm</h1>
        <Input className="w-fit " type="time" value={alarmTime} onChange={handleAlarmChange} />
        <Button variant={"default"} className="px-8" onClick={handleSetAlarm}>Set Alarm</Button>
      </div>
    </div>
  );
};

export default AlarmComponent;