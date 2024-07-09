import Svg, { Path } from 'react-native-svg';

const ArrowBottomSvgComponent = ({width = 24, height = 24, color = "black"}) => (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none">
        <Path d="M5.43557 8.35494L1.83839 4.24388C1.41407 3.75894 1.75846 3 2.40283 3H9.59717C10.2415 3 10.5859 3.75894 10.1616 4.24388L6.56443 8.35493C6.26562 8.69643 5.73438 8.69643 5.43557 8.35494Z" fill={color}/>
    </Svg>
)

 export default ArrowBottomSvgComponent

