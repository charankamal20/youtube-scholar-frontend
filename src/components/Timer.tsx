"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MutableRefObject, useEffect } from "react";
import { z } from "zod";
import { TimerSchema } from "@/schemas/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Pause, Play, TimerResetIcon } from "lucide-react";

const TimerComponent = ({
  setTimerType,
  setTimeLeft,
  timeLeft,
  isRunning,
  setIsRunning,
}: {
  setTimerType: (value: any) => void;
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
  setTimeLeft: (val: any) => void;
  timeLeft: number;
}) => {
  // const [timeLeft, setTimeLeft] = useState(0);
  // const [isRunning, setIsRunning] = useState(false);
  // const intervalRef = useRef<any>(null);

  const form = useForm<z.infer<typeof TimerSchema>>({
    resolver: zodResolver(TimerSchema),
    defaultValues: {
      pin: "0025",
    },
  });

  function onSubmit(data: z.infer<typeof TimerSchema>) {
    const timeString = data.pin || "0000"; // HHMM format
    const hours = parseInt(timeString.slice(0, 2), 10);
    const minutes = parseInt(timeString.slice(2, 4), 10);
    setTimerType("timer")

    const totalSeconds = hours * 3600 + minutes * 60;
    setTimeLeft(totalSeconds);

    toast({
      title: "Timer set to:",
      description: `${hours} hours and ${minutes} minutes`,
    });

    setIsRunning(true);
  }
  const pauseTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mx-auto space-y-6"
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Time in HH : MM</FormLabel>
              <FormControl>
                <InputOTP maxLength={4} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot defaultValue={0} index={0} />
                    <InputOTPSlot defaultValue={0} index={1} />
                  </InputOTPGroup>
                  :
                  <InputOTPGroup>
                    <InputOTPSlot defaultValue={0} index={2} />
                    <InputOTPSlot defaultValue={0} index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-x-2">
          <Button type="submit">Start Timer</Button>
          <Button
            disabled={timeLeft <= 0}
            type="button"
            variant="outline"
            onClick={pauseTimer}
          >
            {isRunning ? (
              <>
                <Pause className="size-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="size-4 mr-1" />
                Play
              </>
            )}
          </Button>
          <Button
            disabled={timeLeft <= 0}
            type="button"
            variant="outline"
            onClick={resetTimer}
          >
            <TimerResetIcon className="size-4 mr-1" />
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TimerComponent;
