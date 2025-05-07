
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";

interface CalendarCardProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function CalendarCard({ date, setDate }: CalendarCardProps) {
  return (
    <Card className="shadow-md border-cyrela-gray-lighter h-full flex flex-col">
      <CardHeader className="pb-2 border-b border-cyrela-gray-lighter">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Calendário
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-0">
        <div className="w-full flex justify-center items-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="mx-auto border-none shadow-none"
            showOutsideDays
          />
        </div>
      </CardContent>
      <CardFooter className="bg-cyrela-gray-lightest/50 py-3 px-4 border-t border-cyrela-gray-lighter flex justify-between items-center">
        <div className="text-sm font-medium text-cyrela-gray-dark">
          {date && (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {format(date, "dd/MM/yyyy")}
            </span>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs bg-white"
          onClick={() => setDate(new Date())}
        >
          Hoje
        </Button>
      </CardFooter>
    </Card>
  );
}
