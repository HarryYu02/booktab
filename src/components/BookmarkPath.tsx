import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BookmarkPath = ({
    path,
    identifier,
}: {
    path: string[];
    identifier: string;
}) => {
    return (
        <Breadcrumb>
            <BreadcrumbList className="">
                {path.map((folder, index) => {
                    return (
                        <BreadcrumbItem
                            key={`${identifier}-breadcrumb-item-${index}`}
                            className="text-inherit"
                        >
                            {folder}
                            {index !== path.length - 1 && (
                                <BreadcrumbSeparator className="" />
                            )}
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BookmarkPath;
