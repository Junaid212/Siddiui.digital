import { useEffect } from "react";

const HeadTitle = ({ title, description }) => {
    useEffect(() => {
        if (title) document.title = title;
        if (description) {
            let meta = document.querySelector('meta[name="description"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'description';
                document.head.appendChild(meta);
            }
            meta.content = description;
        }
    }, [title, description]);

    return null;
}

export default HeadTitle;
