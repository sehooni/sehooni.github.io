import SubPageLayout from '@/components/SubPageLayout';
import Image from 'next/image';

export default function About() {
    return (
        <SubPageLayout title="About Me">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative w-full md:w-1/3 aspect-square rounded-lg overflow-hidden">
                    <Image
                        src="/assets/img/Self.jpeg"
                        alt="Sehoon Park"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="md:w-2/3 space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    <p>
                        Hello! I'm Sehoon Park, a student at Hanyang University.
                        Welcome to my personal workspace where I share my learning journey and projects.
                    </p>
                    <p>
                        I am interested in [Add your interests here].
                    </p>
                </div>
            </div>
        </SubPageLayout>
    );
}
