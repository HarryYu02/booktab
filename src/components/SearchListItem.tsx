import ListItem from "./ListItem";

interface SearchListItemProps {
  searchText: string;
}

const SearchListItem = ({ searchText }: SearchListItemProps) => {
  return (
    <ListItem
      type="custom"
      item={{
        labels: [],
        name: `Search ${searchText}`,
        description: "Search in Google Chrome",
        func: () => {
          if (searchText !== "") {
            chrome.search.query({ text: searchText }).catch((error) => {
              console.log(error);
            });
            window.close();
          }
        },
      }}
    />
  );
};

export default SearchListItem;
