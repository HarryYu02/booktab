import SearchingList from "./components/SearchingList";
import { ThemeProvider } from "./providers/ThemeProvider";

const App = () => {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <div className="flex h-screen flex-col items-center justify-center p-2">
                <SearchingList />
            </div>
        </ThemeProvider>
    );
};

export default App;
