"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PomodoroSchema } from "@/schemas/schemas";
import { Pause, Play, TimerResetIcon } from "lucide-react";

const PomodoroTimerComponent = ({
  setCycleCount,
  setShortBreakMinutes,
  setLongBreakMinutes,
  setWorkMinutes,
  setIsWorkInterval,
  setTimerType,
  setTimeLeft,
  timeLeft,
  isRunning,
  setIsRunning,
}: {
  setTimerType: React.Dispatch<React.SetStateAction<any>>;
  setCycleCount: React.Dispatch<React.SetStateAction<number>>;
  setWorkMinutes: React.Dispatch<React.SetStateAction<number>>;
  setShortBreakMinutes: React.Dispatch<React.SetStateAction<number>>;
  setLongBreakMinutes: React.Dispatch<React.SetStateAction<number>>;
  setIsWorkInterval: React.Dispatch<React.SetStateAction<boolean>>;
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
  setTimeLeft: (val: any) => void;
  timeLeft: number;
}) => {
  const form = useForm<z.infer<typeof PomodoroSchema>>({
    resolver: zodResolver(PomodoroSchema),
    defaultValues: {
      workMinutes: "25",
      shortBreakMinutes: "05",
      longBreakMinutes: "15",
      cyclesBeforeLongBreak: "3",
    },
  });

  function onSubmit(data: z.infer<typeof PomodoroSchema>) {
    console.log("HEYO");
    const workMinutes = parseInt(data.workMinutes, 10) || 0;
    setTimerType("pomodoro");
    setTimeLeft(workMinutes * 60);
    setWorkMinutes(workMinutes);
    setShortBreakMinutes(parseInt(data.shortBreakMinutes, 10) || 0);
    setLongBreakMinutes(parseInt(data.longBreakMinutes, 10) || 0);
    setIsWorkInterval(true);
    setIsRunning(true);
    setCycleCount(0);

    toast({
      title: "Pomodoro Timer Started",
      description: `Study for ${workMinutes} minutes.`,
    });
  }

  const pauseTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setCycleCount(0);
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full mx-auto space-y-6"
        >
          <div className="grid-cols-2 grid gap-y-4">
            <FormField
              control={form.control}
              name="workMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Time</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={4} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot defaultValue={2} index={0} />
                        <InputOTPSlot defaultValue={5} index={1} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortBreakMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Break Minutes</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={2} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot defaultValue={0} index={0} />
                        <InputOTPSlot defaultValue={5} index={1} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longBreakMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Break Minutes</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={2} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot defaultValue={1} index={0} />
                        <InputOTPSlot defaultValue={5} index={1} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cyclesBeforeLongBreak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cycles Before Long Break</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={1} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot defaultValue={4} index={0} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
    </>
  );
};

export default PomodoroTimerComponent;
