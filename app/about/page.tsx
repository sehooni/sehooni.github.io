import TopNav from '@/components/TopNav';
import Image from 'next/image';

export default function About() {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <TopNav title="About" />
            <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 prose prose-slate dark:prose-invert">
                <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                    <div className="relative w-48 h-48 shrink-0 overflow-hidden rounded-full border-4 border-gray-100 dark:border-gray-800 shadow-lg">
                        <Image
                            src="/assets/img/Self.jpeg"
                            alt="Sehoon Park"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-2 !mt-0">Sehoon Park</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                            AI Engineer & Developer
                        </p>
                        <p className="text-lg">
                            Hello! I'm a developer passionate about Artificial Intelligence and building useful services.
                        </p>
                    </div>
                </div>

                <h3>Contact</h3>
                <ul>
                    <li>Email: <a href="mailto:74sehoon@gmail.com">74sehoon@gmail.com</a></li>
                    <li>GitHub: <a href="https://github.com/sehooni">github.com/sehooni</a></li>
                </ul>
            </main>
        </div>
    );
}
