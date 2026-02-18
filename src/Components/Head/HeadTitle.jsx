import { useEffect } from "react";

const HeadTitle = ({ title }) => {
    useEffect(() => {
        if (title) document.title = title;
    }, [title]);

    return null;
}

export default HeadTitle;
