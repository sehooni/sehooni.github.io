import SubPageLayout from '@/components/SubPageLayout';
import ProjectCard, { ProjectLink } from '@/components/ProjectCard';

interface Project {
    title: string;
    date: string;
    description: string;
    details: React.ReactNode;
    links: ProjectLink[];
}

const PROJECTS: Project[] = [
    {
        title: "Display Toggler",
        date: "2025.12",
        description: "macOS menu bar app to quickly toggle display mirroring and manage screen arrangements.",
        details: (
            <div className="space-y-4">
                <p>
                    macOS 사용 중 발표나 회의 시 디스플레이 미러링을 자주 켜고 꺼야 하는 불편함을 해소하기 위해 개발한 메뉴바 앱입니다.
                    복잡한 시스템 설정 패널에 진입하지 않고도 상단 바에서 한 번의 클릭으로 디스플레이 모드를 전환할 수 있습니다.
                </p>

                <div>
                    <h4 className="font-bold mb-2">Key Features</h4>
                    <ul className="list-disc list-inside space-y-1 ml-1">
                        <li><strong>One-Click Toggle:</strong> 미러링(Mirroring)과 확장(Extend) 모드를 즉시 전환합니다.</li>
                        <li><strong>Global Hotkey:</strong> <code>Cmd+Opt+D</code> 단축키를 통해 어떤 앱에서든 즉시 전환 가능합니다.</li>
                        <li><strong>Display Arrangement:</strong> 듀얼 모니터 사용 시 보조 모니터의 위치(Left, Right, Top, Bottom)를 손쉽게 변경할 수 있습니다.</li>
                        <li><strong>Native Performance:</strong> SwiftUI와 AppKit을 활용하여 매우 가볍고 빠르며, 시스템 리소스를 거의 차지하지 않습니다.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-2">Tech Stack</h4>
                    <ul className="list-disc list-inside space-y-1 ml-1">
                        <li>Language: Swift</li>
                        <li>UI Framework: SwiftUI</li>
                        <li>System Framework: AppKit (CoreGraphics)</li>
                    </ul>
                </div>
            </div>
        ),
        links: [
            { label: "GitHub Repository", url: "https://github.com/sehooni/DisplayToggler", icon: 'github' }
        ]
    }
    // Future projects can be added here
];

export default function Projects() {
    return (
        <SubPageLayout title="Projects">
            <div className="space-y-6">
                {PROJECTS.map((project) => (
                    <ProjectCard
                        key={project.title}
                        {...project}
                    />
                ))}
            </div>
        </SubPageLayout>
    );
}
