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
import { capitalizeFirstLetter } from "@/lib/utils";

type TabTarget = {
    itemType: "tab";
    tab: chrome.tabs.Tab;
};

type BookmarkTarget = {
    itemType: "bookmark";
    bookmark: chrome.bookmarks.BookmarkTreeNode;
};

type CmdTarget = {
    itemType: "command";
    command: string;
};

const CommandActions = (
    props: (TabTarget | BookmarkTarget | CmdTarget) & {
        itemName: string;
        openActions: boolean;
        setOpenActions: React.Dispatch<React.SetStateAction<boolean>>;
        shortcut: chrome.commands.Command | null;
    }
) => {
    const { shortcut, itemName, itemType, openActions, setOpenActions } = props;

    return (
        <Popover open={openActions} onOpenChange={setOpenActions}>
            <PopoverTrigger asChild>
                <Button
                    className="flex items-center gap-2 px-2 text-base text-muted-foreground hover:cursor-default"
                    variant={"ghost"}
                >
                    Actions
                    {shortcut?.shortcut?.split("").map((key) => (
                        <CommandShortcut
                            key={`command_actions-key-${key}`}
                            className="size-8 rounded-lg bg-secondary p-2"
                        >
                            <span className="size-4">{key}</span>
                        </CommandShortcut>
                    ))}
                    {(!shortcut || !shortcut.shortcut) && " Not Set"}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Command className="flex flex-col gap-2">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            {capitalizeFirstLetter(itemType)}
                        </p>
                        <p className="w-full truncate text-base">{itemName}</p>
                    </div>
                    <CommandList>
                        {itemType === "tab" ? (
                            <>
                                <CommandItem
                                    onSelect={() => {
                                        chrome.tabs
                                            .remove(
                                                props.tab.id ??
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
                                                props.tab.id ??
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
                        ) : itemType === "bookmark" ? (
                            <>
                                <CommandItem
                                    onSelect={() => {
                                        chrome.tabs
                                            .update({ url: props.bookmark.url })
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
                        ) : itemType === "command" ? (
                            <>{props.command}</>
                        ) : null}
                    </CommandList>
                    <CommandInput
                        placeholder="Search for actions..."
                        autoFocus
                    />
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default CommandActions;
