import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command";
import SearchListItem from "./SearchListItem";
import { ElementRef, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import ThemeListItem from "./ThemeListItem";
import TabList from "./TabList";
import BookmarkList from "./BookmarkList";
import { IoIosReturnLeft } from "react-icons/io";
import { Separator } from "./ui/separator";
import useTabs from "@/hooks/useTabs";
import useBookmarks from "@/hooks/useBookmarks";
import CommandActions from "./CommandActions";
import Loading from "./Loading";
import { Badge } from "./ui/badge";
import { capitalizeFirstLetter, cn } from "@/lib/utils";

const itemTypes = {
    tab: "tab",
    bookmark: "bookmark",
    command: "command",
} as const;

type ItemType = (typeof itemTypes)[keyof typeof itemTypes];

const SearchingList = () => {
    const [currentItem, setCurrentItem] = useState("");
    const [searchText, setSearchText] = useState("");
    const [openActions, setOpenActions] = useState(false);
    const [commands, setCommands] = useState<chrome.commands.Command[]>([]);
    const [mode, setMode] = useState<ItemType | "all">("all");
    const tabData = useTabs();
    const bookmarkData = useBookmarks();
    const listRef = useRef<ElementRef<typeof CommandList>>(null);
    const inputRef = useRef<ElementRef<typeof CommandInput>>(null);

    useEffect(() => {
        const onCommandHandler = (command: string) => {
            // console.log(`Command "${command}" triggered`);
            switch (command) {
                case "command_actions":
                    setOpenActions((prev) => !prev);
                    break;

                case "cycle_mode":
                    setMode((prev) => {
                        switch (prev) {
                            case "all":
                                return "tab";
                            case "tab":
                                return "bookmark";
                            case "bookmark":
                                return "command";
                            case "command":
                                return "all";
                        }
                    });
                    break;

                default:
                    break;
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

    useEffect(() => {
        if (openActions === false) {
            // console.log(inputRef);
            inputRef.current?.focus();
        }
    }, [openActions]);

    const prefixIndex = currentItem.indexOf("-");
    const suffixIndex = currentItem.lastIndexOf("-");
    const itemType = currentItem.slice(0, prefixIndex) as ItemType;
    const itemValue = currentItem.slice(prefixIndex + 1, suffixIndex);
    // const itemIdentifier = currentItem.slice(suffixIndex + 1);

    if (bookmarkData.length === 0 || tabData.length === 0) return <Loading />;

    return (
        <Command
            className="flex flex-col rounded-lg border shadow-md"
            label="BookTab"
            value={currentItem}
            onValueChange={setCurrentItem}
            vimBindings
        >
            <CommandInput
                autoFocus
                id="command-input"
                ref={inputRef}
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
                <CommandGroup heading="Result">
                    <CommandEmpty>No results found</CommandEmpty>
                    {(mode === "all" || mode === "tab") && (
                        <TabList tabData={tabData} />
                    )}
                    {(mode === "all" || mode === "bookmark") && (
                        <BookmarkList bookmarkData={bookmarkData} />
                    )}
                    {(mode === "all" || mode === "command") && (
                        <>
                            <ThemeListItem
                                key="dark-theme"
                                targetTheme="dark"
                            />
                            <ThemeListItem
                                key="light-theme"
                                targetTheme="light"
                            />
                            <SearchListItem
                                key="search-google"
                                searchText={searchText}
                            />
                        </>
                    )}
                </CommandGroup>
            </CommandList>
            <div className="flex items-center justify-between border-t p-1">
                <div className="flex px-2">
                    <Badge
                        className={cn(
                            mode === "tab" && "bg-teal-600 dark:bg-teal-400",
                            mode === "bookmark" &&
                                "bg-cyan-700 dark:bg-cyan-400",
                            mode === "command" &&
                                "bg-amber-600 dark:bg-amber-400"
                        )}
                    >
                        {capitalizeFirstLetter(mode) + " Mode"}
                    </Badge>
                    <Button
                        className="flex items-center gap-2 px-2 text-base hover:cursor-default"
                        variant={"ghost"}
                    >
                        {commands
                            .find((command) => command.name === "cycle_mode")
                            ?.shortcut?.split("")
                            .map((key) => {
                                return (
                                    <CommandShortcut className="size-8 rounded-lg bg-secondary p-2">
                                        {key}
                                    </CommandShortcut>
                                );
                            }) ?? "Not Set"}
                    </Button>
                </div>
                <div className="flex">
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
                        itemName={itemValue}
                        openActions={openActions}
                        setOpenActions={setOpenActions}
                        shortcut={
                            commands.find(
                                (command) => command.name === "command_actions"
                            ) ?? null
                        }
                        {...(itemType === "tab"
                            ? {
                                  itemType,
                                  tab: tabData.find(
                                      (tab) => tab.title === itemValue
                                  ),
                              }
                            : itemType === "bookmark"
                              ? {
                                    itemType,
                                    bookmark: bookmarkData.find(
                                        (bookmark) =>
                                            bookmark.bookmark.title ===
                                            itemValue
                                    ),
                                }
                              : { itemType, command: "command" })}
                    />
                </div>
            </div>
        </Command>
    );
};

export default SearchingList;
