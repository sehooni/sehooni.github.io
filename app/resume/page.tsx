export default function Resume() {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <main className="flex-1 w-full max-w-screen-2xl mx-auto p-4 md:p-8">
                <div className="w-full h-[calc(100vh-200px)] min-h-[800px]">
                    <iframe
                        src="https://drive.google.com/file/d/15THPIGCw65B2eOMRQuQvzoOb4fqbNLKc/preview"
                        className="w-full h-full border-none rounded-lg shadow-lg"
                        allow="autoplay"
                    ></iframe>
                </div>
            </main>
        </div>
    );
}
