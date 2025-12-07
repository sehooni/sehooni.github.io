"use client";

import Giscus from '@giscus/react';

export default function Comments() {
    return (
        <div className="mt-10 border-t pt-10">
            <Giscus
                id="comments"
                repo="sehooni/sehooni.github.io"
                repoId="R_kgDOG_3x1w"
                category="General"
                categoryId="DIC_kwDOG_3x184CA_3-"
                mapping="pathname"
                term="Welcome to @giscus/react component!"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="bottom"
                theme="preferred_color_scheme"
                lang="en"
                loading="lazy"
            />
        </div>
    );
}
