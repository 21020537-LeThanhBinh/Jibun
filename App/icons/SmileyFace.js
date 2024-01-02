import * as React from "react"
import Svg, { Defs, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style, title */
const SmileyFace = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 122.88 122.88"
    {...props}
  >
    <Defs></Defs>
    <Path
      d="M45.54 2.11A61.42 61.42 0 1 1 2.11 77.34 61.42 61.42 0 0 1 45.54 2.11Z"
      style={{
        fillRule: "evenodd",
        fill: "#fbd433",
      }}
    />
    <Path
      d="M45.78 32.27c4.3 0 7.79 5 7.79 11.27s-3.49 11.27-7.79 11.27S38 49.77 38 43.54s3.48-11.27 7.78-11.27ZM77.1 32.27c4.3 0 7.78 5 7.78 11.27S81.4 54.81 77.1 54.81s-7.79-5-7.79-11.27 3.49-11.27 7.79-11.27Z"
      className="cls-2"
    />
    <Path d="M28.8 70.82a39.65 39.65 0 0 0 8.83 8.41 42.72 42.72 0 0 0 25 7.53 40.44 40.44 0 0 0 24.12-8.12 35.75 35.75 0 0 0 7.49-7.87.22.22 0 0 1 .31 0L97 73.14a.21.21 0 0 1 0 .29 45.87 45.87 0 0 1-14.11 15.15A37.67 37.67 0 0 1 62.83 95a39 39 0 0 1-20.68-5.55A50.52 50.52 0 0 1 25.9 73.57a.23.23 0 0 1 0-.28l2.52-2.5a.22.22 0 0 1 .32 0Z" />
  </Svg>
)
export default SmileyFace
