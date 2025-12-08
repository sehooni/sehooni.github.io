import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import { getCategories, getSortedPostsData } from '@/lib/posts';

export default function About() {
    const categories = getCategories();
    const recentPosts = getSortedPostsData().slice(0, 5);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar categories={categories} recentPosts={recentPosts} />
            <main className="flex-1 w-full lg:max-w-4xl mx-auto p-4 md:p-8">
                <div className="mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        About Me
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative w-full md:w-1/3 aspect-square rounded-lg overflow-hidden border-4 border-white shadow-md">
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
            </main>
        </div>
    );
}
