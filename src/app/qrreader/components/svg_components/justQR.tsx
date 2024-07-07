import Svg, { Path } from 'react-native-svg';

const JustQRSvgComponent = ({width = 24, height = 24, color = "black"}) => (
    <Svg width={width} height={height} viewBox="0 0 29 29" fill="none">
        <Path d="M3.625 3.625H7.25V7.25H3.625V3.625Z" fill={color}/>
        <Path d="M10.875 0V10.875H0V0H10.875ZM9.0625 1.8125H1.8125V9.0625H9.0625V1.8125Z" fill={color}/>
        <Path d="M7.25 21.75H3.625V25.375H7.25V21.75Z" fill={color}/>
        <Path d="M10.875 18.125V29H0V18.125H10.875ZM1.8125 19.9375V27.1875H9.0625V19.9375H1.8125Z" fill={color}/>
        <Path d="M21.75 3.625H25.375V7.25H21.75V3.625Z" fill={color}/>
        <Path d="M18.125 0V10.875H29V0H18.125ZM27.1875 1.8125V9.0625H19.9375V1.8125H27.1875Z" fill={color}/>
        <Path d="M14.5 1.8125V0H16.3125V3.625H14.5V7.25H12.6875V1.8125H14.5Z" fill={color}/>
        <Path d="M14.5 10.875V7.25H16.3125V10.875H14.5Z" fill={color}/>
        <Path d="M10.875 14.5V12.6875H12.6875V10.875H14.5V14.5H16.3125V12.6875H25.375V14.5H18.125V16.3125H12.6875V14.5H10.875Z" fill={color}/>
        <Path d="M10.875 14.5V16.3125H3.625V14.5H1.8125V16.3125H0V12.6875H5.4375V14.5H10.875Z" fill={color}/>
        <Path d="M29 16.3125H27.1875V12.6875H29V16.3125Z" fill={color}/>
        <Path d="M27.1875 16.3125H25.375V19.9375H29V18.125H27.1875V16.3125Z" fill={color}/>
        <Path d="M19.9375 16.3125H23.5625V18.125H21.75V19.9375H19.9375V16.3125Z" fill={color}/>
        <Path d="M23.5625 21.75V19.9375H21.75V21.75H19.9375V23.5625H16.3125V25.375H21.75V21.75H23.5625Z" fill={color}/>
        <Path d="M23.5625 21.75H29V23.5625H25.375V25.375H23.5625V21.75Z" fill={color}/>
        <Path d="M16.3125 19.9375V21.75H18.125V18.125H12.6875V19.9375H16.3125Z" fill={color}/>
        <Path d="M12.6875 21.75H14.5V27.1875H21.75V29H12.6875V21.75Z" fill={color}/>
        <Path d="M29 25.375V29H23.5625V27.1875H27.1875V25.375H29Z" fill={color}/>
    </Svg>
  )
  export default JustQRSvgComponent