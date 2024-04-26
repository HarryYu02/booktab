import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command";
import SearchListItem from "./SearchListItem";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import ThemeListItem from "./ThemeListItem";
import TabList from "./TabList";
import BookmarkList from "./BookmarkList";
import { IoIosReturnLeft } from "react-icons/io";
import { Separator } from "./ui/separator";
import useTabs from "@/hooks/useTabs";
import useBookmarks from "@/hooks/useBookmarks";
import CommandActions from "./CommandActions";

type ItemType = "tab" | "bookmark" | "command";

const SearchingList = () => {
    const [currentItem, setCurrentItem] = useState("");
    const [searchText, setSearchText] = useState("");
    const [openActions, setOpenActions] = useState(false);
    const [commands, setCommands] = useState<chrome.commands.Command[]>([]);
    const tabData = useTabs();
    const bookmarkData = useBookmarks();
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onCommandHandler = (command: string) => {
            console.log(`Command "${command}" triggered`);
            if (command === "command_actions") {
                setOpenActions((prev) => !prev);
            }
        };

        const getCommandShortcuts = async () => {
            const defaultCommands = await chrome.commands.getAll();
            setCommands(defaultCommands);
            return defaultCommands;
        };
        getCommandShortcuts().catch((error) => {
            console.log(error);
        });

        chrome.commands.onCommand.addListener(onCommandHandler);
        return () => {
            setOpenActions(false);
            chrome.commands.onCommand.removeListener(onCommandHandler);
        };
    }, []);

    useEffect(() => {
        const commandList = listRef.current;
        commandList?.scrollTo(0, 0);
    }, [searchText]);

    const item = currentItem.split("-");
    const itemType = item[0] as ItemType;
    const itemValue = item[1];

    return (
        <Command
            className="flex flex-col rounded-lg border shadow-md"
            label="BookTab"
            value={currentItem}
            onValueChange={setCurrentItem}
        >
            <CommandInput
                autoFocus
                className="h-12"
                placeholder="Search for tabs and bookmarks..."
                value={searchText}
                onValueChange={(value) => {
                    setSearchText(value);
                }}
            />
            <CommandList
                ref={listRef}
                className="h-full max-h-full [overflow-anchor:auto]"
                defaultValue={""}
            >
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup heading="Result">
                    <TabList tabData={tabData} />
                    <BookmarkList bookmarkData={bookmarkData} />
                    <ThemeListItem key="dark-theme" targetTheme="dark" />
                    <ThemeListItem key="light-theme" targetTheme="light" />
                    <ThemeListItem key="system-theme" targetTheme="system" />
                    <SearchListItem
                        key="search-google"
                        searchText={searchText}
                    />
                </CommandGroup>
            </CommandList>
            <div className="flex items-center justify-end border-t p-1">
                <Button
                    className="flex items-center gap-2 px-2 text-base hover:cursor-default"
                    variant={"ghost"}
                >
                    Open
                    <CommandShortcut className="size-8 rounded-lg bg-secondary p-2">
                        <IoIosReturnLeft className="size-4" />
                    </CommandShortcut>
                </Button>
                <Separator orientation="vertical" className="m-2 h-3/4" />
                <CommandActions
                    itemType={itemType}
                    itemName={itemValue}
                    openActions={openActions}
                    setOpenActions={setOpenActions}
                    command={
                        commands.find(
                            (command) => command.name === "command_actions"
                        ) ?? null
                    }
                    target={
                        (itemType === "tab"
                            ? tabData.find((tab) => tab.title === itemValue)
                            : itemType === "bookmark"
                              ? bookmarkData.find(
                                    (bookmark) => bookmark.title === itemValue
                                )
                              : "command") || "unknown"
                    }
                />
            </div>
        </Command>
    );
};

export default SearchingList;
