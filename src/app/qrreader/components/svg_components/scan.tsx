import Svg, { Path, Circle } from 'react-native-svg';

const ScanSvgComponent = ({color = "black", width = 24, height=24}) => (
    <Svg width={width} height={height} viewBox="0 0 34 29" fill="none">
        <Path d="M5.21875 1.8125C4.71824 1.8125 4.3125 2.21824 4.3125 2.71875V8.15625C4.3125 8.65676 3.90676 9.0625 3.40625 9.0625C2.90574 9.0625 2.5 8.65676 2.5 8.15625V2.71875C2.5 1.21723 3.71723 0 5.21875 0H10.6562C11.1568 0 11.5625 0.405742 11.5625 0.90625C11.5625 1.40676 11.1568 1.8125 10.6562 1.8125H5.21875ZM22.4375 0.90625C22.4375 0.405742 22.8432 0 23.3438 0H28.7812C30.2828 0 31.5 1.21723 31.5 2.71875V8.15625C31.5 8.65676 31.0943 9.0625 30.5938 9.0625C30.0932 9.0625 29.6875 8.65676 29.6875 8.15625V2.71875C29.6875 2.21824 29.2818 1.8125 28.7812 1.8125H23.3438C22.8432 1.8125 22.4375 1.40676 22.4375 0.90625ZM3.40625 19.9375C3.90676 19.9375 4.3125 20.3432 4.3125 20.8438V26.2812C4.3125 26.7818 4.71824 27.1875 5.21875 27.1875H10.6562C11.1568 27.1875 11.5625 27.5932 11.5625 28.0938C11.5625 28.5943 11.1568 29 10.6562 29H5.21875C3.71723 29 2.5 27.7828 2.5 26.2812V20.8438C2.5 20.3432 2.90574 19.9375 3.40625 19.9375ZM30.5938 19.9375C31.0943 19.9375 31.5 20.3432 31.5 20.8438V26.2812C31.5 27.7828 30.2828 29 28.7812 29H23.3438C22.8432 29 22.4375 28.5943 22.4375 28.0938C22.4375 27.5932 22.8432 27.1875 23.3438 27.1875H28.7812C29.2818 27.1875 29.6875 26.7818 29.6875 26.2812V20.8438C29.6875 20.3432 30.0932 19.9375 30.5938 19.9375Z" fill={color}/>
        <Path d="M0.999999,14.25 
         A0.75,0.75 0 0,0 0.999999,15.75 
         L33,15.75 
         A0.75,0.75 0 0,0 33,14.25 
         L0.999999,14.25 
         Z" fill={color}/>
    </Svg>
)
export default ScanSvgComponent