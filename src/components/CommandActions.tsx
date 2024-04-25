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
  command,
}: {
  currentItem: string;
  openActions: boolean;
  setOpenActions: React.Dispatch<React.SetStateAction<boolean>>;
  command: chrome.commands.Command | null;
}) => {
  return (
    <Popover open={openActions} onOpenChange={setOpenActions}>
      <PopoverTrigger asChild>
        <Button
          className="flex items-center gap-2 px-2 text-base text-muted-foreground hover:cursor-default"
          variant={"ghost"}
        >
          Actions
          {command?.shortcut?.split("").map((key) => (
            <CommandShortcut
              key={`command_actions-key-${key}`}
              className="size-8 rounded-lg bg-secondary p-2"
            >
              <span className="size-4">{key}</span>
            </CommandShortcut>
          ))}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {currentItem.slice(0, currentItem.indexOf("-"))}
        <br />
        {currentItem.slice(currentItem.indexOf("-") + 1)}
      </PopoverContent>
    </Popover>
  );
};

export default CommandActions;
