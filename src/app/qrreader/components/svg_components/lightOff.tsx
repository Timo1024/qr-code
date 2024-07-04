import Svg, { Path, Circle } from 'react-native-svg';

const LightOffSvgComponent = ({color = "white", size = 24}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M16 16V20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7893 14.5304 22 14 22H10C9.46957 22 8.96086 21.7893 8.58579 21.4142C8.21071 21.0391 8 20.5304 8 20V10C8 8 6 8 6 6" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M7 2H18V6C18 8 16 8 16 10V11" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M11 6H18" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M2 2L22 22" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </Svg>
)
export default LightOffSvgComponent