import ListItem from "./ListItem";

interface SearchListItemProps {
    searchText: string;
}

const SearchListItem = ({ searchText }: SearchListItemProps) => {
    return (
        <ListItem
            type="custom"
            item={{
                name: `Search ${searchText}`,
                description: "Search in Google Chrome",
                func: () => {
                    if (searchText !== "") {
                        chrome.search
                            .query({ text: searchText, disposition: "NEW_TAB" })
                            .catch((error) => {
                                console.log(error);
                            });
                        window.close();
                    }
                },
            }}
            keywords={[]}
        />
    );
};

export default SearchListItem;
