/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      Raleway: ["Raleway, sans-serif"],
      Josefin: ["Josefin Slab, serif"],
      Cormorant: ["Cormorant Garamond, serif"],
    },
    backgroundImage: {
      banner:
        "linear-gradient(#4c4b4b58, #4c4b4b58),url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80')",
      articles: "url('/assets/img/bgTree.png.jpg')",
      gallery:
        "url('https://images.unsplash.com/photo-1504870712357-65ea720d6078?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80/')",
    },
    animation: {
      circle: "circle .8s ease forwards",
      deerIcon: "deerIcon .5s ease forwards .6s",
      circleB: "circleB .8s ease forwards",
      deerIconB: "deerIconB .5s ease forwards",
      deerIconActive: "deerIconActive .8s ease-out forwards",
      line: "line 1.8s ease forwards",
      lineB: "lineB 1.2s ease forwards",
      slideInRight: "slideInRight .6s linear forwards",
      slideInLeft: "slideInLeft .6s linear forwards",
      slideInRightBack: "slideInRightBack .6s linear forwards",
      slideInLeftBack: "slideInLeftBack .6s linear forwards",
    },
    keyframes: {
      circle: {
        "0%": {
          width: "15rem",
          borderColor: "#fff",
          color: "#fff",
        },
        "40%": {
          fontSize: "1rem",
          color: "transparent",
          border: "3px solid white",
        },
        "100%": {
          width: "5rem",
          height: "5rem",
          borderColor: "#fff",
          color: "transparent",
          fontSize: "1rem",
          border: "4px solid #ffffffe2",
        },
      },
      deerIcon: {
        "0%": {
          opacity: "0%",
        },
        "50%": {
          opacity: "50%",
        },
        "100%": {
          opacity: "100%",
        },
      },
      circleB: {
        "0%": {
          width: "5rem",
          height: "5rem",
          borderColor: "#fff",
          color: "transparent",
          fontSize: "1rem",
          border: "4px solid #ffffffe2",
        },
        "60%": {
          fontSize: "1rem",
          color: "transparent",
          border: "3px solid white",
        },
        "100%": {
          width: "15rem",
          borderColor: "#fff",
          color: "#fff",
        },
      },
      deerIconB: {
        "0%": {
          opacity: "50%",
        },
        "30%": {
          opacity: "0%",
        },
        "100%": {
          opacity: "0%",
        },
      },
      deerIconActive: {
        "0%": {
          opacity: "100%",
          transform: "scale(1)",
        },
        "100%": {
          opacity: "0%",
          transform: "scale(5)",
        },
      },
      line: {
        "0%": {
          opacity: "0%",
          width: "50%",
        },
        "30%": {
          opacity: "0%",
          width: "50%",
        },
        "100%": {
          opacity: "100%",
          width: "50vw",
        },
      },
      lineB: {
        "0%": {
          opacity: "100%",
          width: "50vw",
        },
        "60%": {
          opacity: "100%",
          width: "50vw",
        },
        "100%": {
          opacity: "0%",
          width: "50%",
        },
      },
      slideInRight: {
        "0%": {
          transform: "translateX(100%)",
          opacity: "0",
        },
        "50%": {
          opacity: "0.2",
        },
        "100%": {
          transform: "translateX(0)",
          opacity: "1",
        }
      },
      slideInRightBack: {
        "0%": {
          transform: "translateX(0%)",
          opacity: "1",
        },
        "50%": {
          opacity: "0.8",
        },
        "100%": {
          transform: "translateX(100%)",
          opacity: "0",
        }
      },
      slideInLeft: {
        "0%": {
          transform: "translateX(-100%)",
          opacity: "0",
        },
        "50%": {
          opacity: "0.2",
        },
        "100%": {
          transform: "translateX(0)",
          opacity: "1",
        }
      },
      slideInLeftBack: {
        "0%": {
          transform: "translateX(0%)",
          opacity: "1",
        },
        "50%": {
          opacity: "0.8",
        },
        "100%": {
          transform: "translateX(-100%)",
          opacity: "0",
        }
      } 
    },
    plugins: [],
  },
};
