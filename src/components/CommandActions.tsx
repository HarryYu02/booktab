import { Button } from "./ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "./ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";

type TabTarget = {
    itemType: "tab";
    target: chrome.tabs.Tab;
};

type BookmarkTarget = {
    itemType: "bookmark";
    target: chrome.bookmarks.BookmarkTreeNode;
};

type CmdTarget = {
    itemType: "command";
    target: string;
};

type Target = TabTarget | BookmarkTarget | CmdTarget;

const CommandActions = ({
    itemType,
    itemName,
    openActions,
    setOpenActions,
    command,
    target,
}: Target & {
    itemName: string;
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
                    {(!command || !command.shortcut) && " Not Set"}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Command className="">
                    <p className="text-xs text-muted-foreground">{itemType}</p>
                    <p className="w-full truncate text-base">{itemName}</p>
                    <CommandList>
                        <CommandGroup heading={"Actions"} forceMount>
                            {itemType === "tab" ? (
                                <>
                                    <CommandItem
                                        onSelect={() => {
                                            chrome.tabs
                                                .remove(
                                                    target.id ??
                                                        chrome.tabs.TAB_ID_NONE
                                                )
                                                .catch((error) => {
                                                    console.log(error);
                                                });
                                            window.close();
                                        }}
                                    >
                                        Close Tab
                                    </CommandItem>
                                    <CommandItem
                                        onSelect={() => {
                                            chrome.tabs
                                                .duplicate(
                                                    target.id ??
                                                        chrome.tabs.TAB_ID_NONE
                                                )
                                                .catch((error) => {
                                                    console.log(error);
                                                });
                                            window.close();
                                        }}
                                    >
                                        Copy Tab
                                    </CommandItem>
                                </>
                            ) : itemType === "bookmark" ? (
                                <></>
                            ) : itemType === "command" ? (
                                <></>
                            ) : null}
                        </CommandGroup>
                    </CommandList>
                    <CommandInput />
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default CommandActions;
