import Svg, { Path } from 'react-native-svg';

const ArrowTopSvgComponent = ({width = 24, height = 24, color = "black"}) => (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none">
        <Path d="M5.43557 3.64506L1.83839 7.75612C1.41407 8.24106 1.75846 9 2.40283 9H9.59717C10.2415 9 10.5859 8.24106 10.1616 7.75612L6.56443 3.64507C6.26562 3.30357 5.73438 3.30357 5.43557 3.64506Z" fill={color}/>
    </Svg>
)

 export default ArrowTopSvgComponent