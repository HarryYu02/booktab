import { ImCtrl } from "react-icons/im";
import { Button } from "./ui/button";
import { CommandShortcut } from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";

const CommandActions = ({
  currentItem,
  openActions,
  setOpenActions,
}: {
  currentItem: string;
  openActions: boolean;
  setOpenActions: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Popover open={openActions} onOpenChange={setOpenActions}>
      <PopoverTrigger asChild>
        <Button
          className="flex items-center gap-2 px-2 text-base text-muted-foreground hover:cursor-default"
          variant={"ghost"}
        >
          Actions
          <CommandShortcut className="size-8 rounded-lg bg-secondary p-2">
            <ImCtrl className="size-4" />
          </CommandShortcut>
          <CommandShortcut className="size-8 rounded-lg bg-secondary p-2">
            <span className="size-4">L</span>
          </CommandShortcut>
        </Button>
      </PopoverTrigger>
      <PopoverContent>{currentItem}</PopoverContent>
    </Popover>
  );
};

export default CommandActions;
