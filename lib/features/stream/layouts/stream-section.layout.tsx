interface StreamSectionLayoutProps {
    children: React.ReactNode;
    title: string;
}

export function StreamSectionLayout({
    children,
    title,
}: Readonly<StreamSectionLayoutProps>) {
    return (
        <div className="flex flex-col space-y-3">
            <h2 className="text-lg underline">{title}</h2>
            {children}
        </div>
    );
}
