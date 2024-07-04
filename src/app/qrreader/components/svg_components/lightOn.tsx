import Svg, { Path, Circle } from 'react-native-svg';

const LightOnSvgComponent = ({color = "black", size = 24}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M18 6C18 8 16 8 16 10V20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7893 14.5304 22 14 22H10C9.46957 22 8.96086 21.7893 8.58579 21.4142C8.21071 21.0391 8 20.5304 8 20V10C8 8 6 8 6 6V2H18V6Z" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M6 6H18" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <Circle cx="12" cy="12" r="1" fill={color}/>
    </Svg>
)
export default LightOnSvgComponent