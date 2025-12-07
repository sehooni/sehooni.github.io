import SubPageLayout from '@/components/SubPageLayout';

export default function Resume() {
    return (
        <SubPageLayout title="Résumé">
            <div className="prose dark:prose-invert max-w-none">
                <h3>Education</h3>
                <ul>
                    <li><strong>Hanyang University</strong></li>
                </ul>

                <h3>Experience</h3>
                <p>Add your experience here...</p>

                <h3>Skills</h3>
                <p>Add your skills here...</p>
            </div>
        </SubPageLayout>
    );
}
