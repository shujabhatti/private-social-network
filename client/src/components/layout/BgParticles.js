import React from "react";
import Particles from "react-particles-js";
import Color from "../constants/Colors";

const BgParticles = (props) => {
  return (
    <Particles
      params={{
        particles: {
          color: {
            value: `${Color.primaryColor}`,
          },
          number: {
            value: `${30}`,
          },
          line_linked: {
            shadow: {
              enable: false,
              color: `${Color.primaryColor}`,
            },
          },
          size: {
            value: `${3}`,
          },
          move: {
            speed: `${3}`,
          },
          opacity: {
            anim: {
              enable: true,
              opacity_min: 0.5,
              speed: `${3}`,
              sync: false,
            },
            value: 0.4,
          },
        },
        interactivity: {
          events: {
            onhover: {
              enable: false,
              mode: "repulse",
            },
          },
          modes: {
            bubble: {
              size: 5,
              speed: `${3}`,
              distance: `${50}`,
            },
          },
        },
      }}
      style={{ position: "absolute", backgroundColor: `${props.backcolor}` }}
    />
  );
};

export default BgParticles;
