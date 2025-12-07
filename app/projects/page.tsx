import SubPageLayout from '@/components/SubPageLayout';

export default function Projects() {
    return (
        <SubPageLayout title="Projects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold mb-2">Display Toggler</h3>
                    <p className="text-gray-600 dark:text-gray-400">macOS menu bar app to quickly toggle display mirroring.</p>
                </div>
                {/* Add more projects here */}
            </div>
        </SubPageLayout>
    );
}
