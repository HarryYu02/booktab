import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { capitalizeFirstLetter } from "@/lib/utils";
import React from "react";
import BookmarkActions from "./BookmarkActions";
import TabActions from "./TabActions";
import { Button } from "./ui/button";
import {
    Command,
    CommandInput,
    CommandList,
    CommandShortcut,
} from "./ui/command";

type TabTarget = {
    itemType: "tab";
    tab: chrome.tabs.Tab | null;
};

type BookmarkTarget = {
    itemType: "bookmark";
    bookmark: chrome.bookmarks.BookmarkTreeNode | null;
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
                            <TabActions tab={props.tab} />
                        ) : itemType === "bookmark" ? (
                            <BookmarkActions bookmark={props.bookmark} />
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
