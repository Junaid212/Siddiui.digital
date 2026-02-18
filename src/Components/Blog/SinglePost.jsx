import React from "react";

const SinglePostSection = () => {
    return (
        <div className="section">
            <div className="hero-container">
                <div className="d-flex flex-column gspace-2">
                    <div className="blog-container">
                        <div className="row row-cols-md-3 row-cols-1 grid-spacer-2">
                            <div className="col">
                                <div className="card writer-detail">
                                <p className="accent-color">Author</p>
                                <span className="description">Jhon Doe</span>
                                </div>
                            </div>
                        <div className="col">
                            <div className="card writer-detail">
                            <p className="accent-color">Date</p>
                            <span className="description">Aug 11, 2024</span>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card writer-detail">
                                <p className="accent-color">Comment</p>
                                <span className="description">0 Comment</span>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="image-container">
                        <img
                        src="/assets/images/dummy-img-600x400.jpg"
                        alt="Post Banner"
                        className="post-detail-img"
                        />
                    </div>

                    <div className="blog-container">
                        <div className="d-flex flex-column gspace-2">
                        <h3>Description</h3>
                        <div>
                            <p>
                                Elit class porta interdum commodo nisi sociosqu maecenas curae. Ad in nullam libero commodo
                                magnis tristique, accumsan etiam viverra. Massa arcu sociosqu nascetur magna parturient morbi
                                ultrices senectus. Consectetur venenatis penatibus primis tristique ac ultrices cras suscipit!
                                Porta auctor laoreet dui nisl tempor.
                            </p>
                            <p>
                                Eu netus turpis himenaeos congue urna, volutpat laoreet dignissim. Natoque bibendum ante
                                tempor sem vestibulum tortor urna potenti. Vulputate augue porta elementum eget; ut imperdiet.
                                Velit himenaeos etiam eu est egestas dis nullam fringilla sit.
                            </p>
                        </div>

                        <div className="row row-cols-md-2 row-cols-1 grid-spacer-2">
                            <div className="col">
                                <div className="image-container">
                                    <img
                                    src="/assets/images/dummy-img-600x400.jpg"
                                    alt="Post Image"
                                    className="img-fluid"
                                    />
                                </div>
                            </div>
                            <div className="col">
                            <p>
                                Quam maximus cras augue suspendisse cubilia sed vulputate congue sagittis. Turpis commodo
                                fermentum aliquam facilisis rutrum senectus maximus. Ut donec natoque ac finibus senectus
                                faucibus ante. Facilisi risus auctor ex lacus scelerisque mauris, nostra sed orci.
                            </p>
                            <p>
                                Iaculis est rutrum vulputate nisi erat nullam sed. Consequat orci maecenas purus cursus
                                pellentesque rutrum hac. Proin parturient dignissim elementum magnis aptent fusce curae.
                                Accumsan vestibulum vel laoreet dui at tellus nisi dolor.
                            </p>
                            <p>
                                Parturient nunc montes, habitasse ligula habitant facilisi. Luctus dis penatibus ad augue
                                rutrum. Non gravida sociosqu pellentesque cursus dictum.
                            </p>
                            </div>
                        </div>

                        <h3>Understand Your Audience</h3>
                        <p>
                            Ipsum urna donec pellentesque molestie posuere aliquet. Fusce fermentum risus varius, rhoncus
                            dis erat placerat. Enim semper fames nam nunc, phasellus ipsum mauris. Aliquam diam netus nec,
                            pellentesque ultricies sollicitudin morbi. Dignissim ligula et velit integer ultricies
                            tristique. Imperdiet a mattis finibus nibh suspendisse auctor rutrum. Fames fermentum iaculis
                            lacinia proin diam vitae.
                        </p>
                        <p>
                            Lorem ipsum odor amet, consectetuer adipiscing elit. Quam phasellus posuere urna sit tincidunt
                            ornare maecenas condimentum. Euismod id nibh velit aenean platea.
                        </p>

                        <h3 className="accent-color-2">Optimize for SEO</h3>
                        <p>
                            Elit class porta interdum commodo nisi sociosqu maecenas curae. Ad in nullam libero commodo
                            magnis tristique, accumsan etiam viverra. Massa arcu sociosqu nascetur magna parturient morbi
                            ultrices senectus.
                        </p>

                        <div className="row row-cols-md-2 row-cols-1 grid-spacer-2">
                            <div className="col">
                            <ul className="circle-notch-list">
                                <li>Quam maximus cras augue suspendisse cubilia sed</li>
                                <li>Vulputate augue porta elementum eget ut imperdiet</li>
                                <li>Natoque bibendum ante tempor sem vestibulum tortor</li>
                                <li>Consectetur venenatis penatibus primis tristique ac ultrices</li>
                            </ul>
                            </div>
                            <div className="col">
                            <ul className="circle-notch-list">
                                <li>Quam maximus cras augue suspendisse cubilia sed</li>
                                <li>Vulputate augue porta elementum eget ut imperdiet</li>
                                <li>Natoque bibendum ante tempor sem vestibulum tortor</li>
                                <li>Consectetur venenatis penatibus primis tristique ac ultrices</li>
                            </ul>
                            </div>
                        </div>

                        <p>
                            Iaculis est rutrum vulputate nisi erat nullam sed. Consequat orci maecenas purus cursus
                            pellentesque rutrum hac. Proin parturient dignissim elementum magnis aptent fusce curae.
                            Accumsan vestibulum vel laoreet dui at tellus nisi dolor.
                        </p>

                        <hr />

                        <div className="d-flex justify-content-between">
                            <h4>Share to</h4>
                            <div className="d-flex flex-row gspace-2">
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </a>
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SinglePostSection;