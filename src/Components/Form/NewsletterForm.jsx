import React, { useState } from "react";

const NewsletterForm = () => {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(false);
        setError(false);

        if (validateEmail(email)) {
            setSuccess(true);
            setError(false);
        } else {
            setSuccess(false);
            setError(true);
        }

        setTimeout(() => {
            setSuccess(false);
            setError(false);
        }, 3000);
    };

    return (
        <div className="newsletter-bg no-light ">
            <div className="card newsletter-card ">
                <h2 className="secondary-accent">Subscribe Our Newsletter</h2>
                {/* <p className="secondary-accent">
                    A diam maecenas sed enim ut sem viverra. Vulputate ut pharetra
                    sit amet aliquam id diam maecenas ultricies. Ultricies mi quis
                    hendrerit dolor. Convallis a cras semper auctor neque vitae
                    tempus quam.
                </p> */}

                {success && (
                    <div id="newsletter-success" className="alert success">
                        <span className="check-icon">
                            <i className="fa-solid fa-2xl fa-check"></i>
                        </span>
                        <p className="accent-color-3 text-center">
                            Thank you! Form submitted successfully.
                        </p>
                    </div>
                )}

                {error && (
                    <div id="newsletter-error" className="alert error">
                        <span className="cross-icon">
                            <i className="fa-solid fa-2xl fa-xmark"></i>
                        </span>
                        <p className="accent-color-3 text-center">
                            Oops! Form submission failed. Please try again.
                        </p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    id="newsletterForm"
                    className="form gspace-2 needs-validation"
                    noValidate
                >
                    <div className="d-flex flex-column flex-md-row w-100 gspace-2">
                        <div className="d-flex w-100 flex-column gspace-2">
                            <input
                                type="email"
                                name="newsletter-email"
                                id="newsletter-email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {error && (
                                <p className="error-text">Message is required</p>
                            )}
                        </div>
                        <button className="btn btn-red-accent" type="submit">
                            Subscribe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewsletterForm;