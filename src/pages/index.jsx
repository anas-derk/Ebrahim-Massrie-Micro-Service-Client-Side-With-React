import Head from 'next/head';
import Header from '../components/Header';
import { useEffect } from "react";
import Carousel from 'react-bootstrap/Carousel';

export default function Home() {
  useEffect(() => {
    let header = document.querySelector("#__next .global-header"),
      introduction = document.querySelector(".home .introduction");
    introduction.style.minHeight = `calc(100vh - ${header.clientHeight}px)`;
  }, []);

  return (
    <div className="home">
      <Head>
        <title>Image Creator By AI - Home</title>
      </Head>
      <Header />
      {/* Start Introduction Section */}
      <section className="introduction">
        {/* Start Carousel Component From Bootstrap */}
        <Carousel indicators={false}>
          {/* Start Carousel Item */}
          <Carousel.Item>
            <div className="overlay d-flex align-items-center justify-content-center">
              <Carousel.Caption>
                <h2>Welcome to the Image Creator By AI</h2>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
          {/* End Carousel Item */}
          {/* Start Carousel Item */}
          <Carousel.Item>
            <div className="overlay d-flex align-items-center justify-content-center">
              <Carousel.Caption>
                <h2>Welcome to the Image Creator By AI</h2>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
          {/* End Carousel Item */}
          {/* Start Carousel Item */}
          <Carousel.Item>
            <div className="overlay d-flex align-items-center justify-content-center">
              <Carousel.Caption>
                <h2>Welcome to the Image Creator By AI</h2>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
          {/* End Carousel Item */}
        </Carousel>
        {/* End Carousel Component From Bootstrap */}
      </section>
      {/* End Introduction Section */}
    </div>
  );
}