import React, { createContext, useState, useContext } from "react";

const ModalVideoContext = createContext();

export const useModalVideo = () => useContext(ModalVideoContext);

export const ModalVideoProvider = ({ children }) => {
    const [videoUrl, setVideoUrl] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const openModal = (url) => {
        setVideoUrl(url);
        setIsOpen(true);
    };

    const closeModal = () => {
        setVideoUrl("");
        setIsOpen(false);
    };

    return (
        <ModalVideoContext.Provider value={{ videoUrl, isOpen, openModal, closeModal }}>
            {children}
        </ModalVideoContext.Provider>
    );
};
