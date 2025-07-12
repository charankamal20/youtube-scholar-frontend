import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserAvatar = () => {
  return (
    <Avatar className="outline-none focus:outline-none active:outline-none">
      <AvatarImage src="https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Random" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
