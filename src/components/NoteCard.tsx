import { useState } from "react";
import { Ellipsis } from "lucide-react";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { auth_api } from "@/lib/api";

const NoteCard = ({
  note,
  jumpToTimestamp,
  onDeleteNote,
}: {
  note: Note;
  jumpToTimestamp: (seconds: number) => void;
  onDeleteNote: (id: number) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onNoteClick = () => {
    setIsExpanded((isExpanded) => !isExpanded);
    jumpToTimestamp(note.timestamp);
  };

  return (
    <Card
      onClick={onNoteClick}
      className="border-b border-t-0 border-x-0 border-separate w-full cursor-pointer rounded-none max-w-md p-6 bg-white hover:bg-slate-100 shadow-sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="line-clamp-1 text-md font-bold">{note.title}</h3>
            <p className="text-xs text-muted-foreground">
              {note.timestampDisplay}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className="size-4 outline-none cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="-translate-x-8">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuItem>Jump to Timestamp</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onDeleteNote(note.id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          className={`overflow-hidden cursor-text transition-all duration-500 ${
            isExpanded ? "max-h-screen" : "max-h-11 line-clamp-2"
          }`}
        >
          <p className="text-sm text-foreground">{note.note_text}</p>
        </div>
      </div>
    </Card>
  );
};

export default NoteCard;
