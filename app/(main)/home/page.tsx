import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
    return (
        <ScrollArea className="h-[calc(100vh-5rem)] w-full">
            <div className="mx-auto p-6">
                <p className="mb-6 text-2xl font-bold text-white">
                    Welcome to Your Dashboard
                </p>
                {/* Placeholder content */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="mb-4 rounded-lg bg-white p-4 shadow"
                    >
                        <h3 className="mb-2 text-lg font-semibold">
                            Content Section {i + 1}
                        </h3>
                        <p className="text-gray-600">
                            This is some placeholder content to demonstrate
                            scrolling. You can replace this with your actual
                            content.
                        </p>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
