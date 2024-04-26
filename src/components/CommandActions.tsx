import { Button } from "./ui/button";
import { MdDelete, MdFolderCopy } from "react-icons/md";
import {
    Command,
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
import { LuReplace } from "react-icons/lu";

type TabTarget = {
    itemType: "tab";
    target: chrome.tabs.Tab | null;
};

type BookmarkTarget = {
    itemType: "bookmark";
    target: chrome.bookmarks.BookmarkTreeNode | null;
};

type CmdTarget = {
    itemType: "command";
    target: string | null;
};

const CommandActions = ({
    itemType,
    itemName,
    openActions,
    setOpenActions,
    command,
    target,
}: (TabTarget | BookmarkTarget | CmdTarget) & {
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
                <Command className="flex flex-col gap-2">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            {itemType}
                        </p>
                        <p className="w-full truncate text-base">{itemName}</p>
                    </div>
                    <CommandList>
                        {target && itemType === "tab" ? (
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
                                    className="flex items-center gap-2"
                                >
                                    <MdDelete className="size-4 p-0" />
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
                                    className="flex items-center gap-2"
                                >
                                    <MdFolderCopy className="size-4 p-0" />
                                    Copy Tab
                                </CommandItem>
                            </>
                        ) : target && itemType === "bookmark" ? (
                            <>
                                <CommandItem
                                    onSelect={() => {
                                        chrome.tabs
                                            .update({ url: target.url })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                        window.close();
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <LuReplace className="size-4" />
                                    Open in current tab
                                </CommandItem>
                            </>
                        ) : target && itemType === "command" ? (
                            <>{target}</>
                        ) : null}
                    </CommandList>
                    <CommandInput autoFocus />
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default CommandActions;
