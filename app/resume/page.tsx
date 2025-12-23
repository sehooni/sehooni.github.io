import TopNav from '@/components/TopNav';

export default function Resume() {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <TopNav title="Résumé" />
            <main className="flex-1 w-full max-w-screen-2xl mx-auto p-4 md:p-8">
                <div className="w-full h-[calc(100vh-200px)] min-h-[800px]">
                    <iframe
                        src="https://drive.google.com/file/d/182BKpahYqTzXWf8sY1Z_XA64vx8guOzA/preview"
                        className="w-full h-full border-none rounded-lg shadow-lg"
                        allow="autoplay"
                    ></iframe>
                </div>
            </main>
        </div>
    );
}
