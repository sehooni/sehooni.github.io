import TopNav from '@/components/TopNav';

export default function Resume() {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <TopNav title="Résumé" />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 prose prose-slate dark:prose-invert">
                <h3>Education</h3>
                <ul>
                    <li><strong>Hanyang University</strong></li>
                </ul>

                <h3>Experience</h3>
                <p>Add your experience here...</p>

                <h3>Skills</h3>
                <p>Add your skills here...</p>
            </main>
        </div>
    );
}
