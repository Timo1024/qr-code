import Svg, { Path } from 'react-native-svg';

const HomeSvgComponent = ({width, height, color}: {width: number, height: number, color: string}) => (
    <Svg width={width} height={height} viewBox="0 0 33 33" fill="none">
        <Path d="M17.9584 3.09384C17.153 2.28838 15.8471 2.28838 15.0416 3.09384L1.3333 16.8021C0.930568 17.2049 0.930568 17.8578 1.3333 18.2605C1.73602 18.6633 2.38898 18.6633 2.7917 18.2605L4.125 16.9272V27.8438C4.125 29.5525 5.51012 30.9376 7.21875 30.9376H25.7812C27.4899 30.9376 28.875 29.5525 28.875 27.8438V16.9272L30.2083 18.2605C30.611 18.6633 31.264 18.6633 31.6667 18.2605C32.0694 17.8578 32.0694 17.2049 31.6667 16.8021L26.8125 11.9479V5.15634C26.8125 4.5868 26.3508 4.12509 25.7812 4.12509H23.7188C23.1492 4.12509 22.6875 4.5868 22.6875 5.15634V7.82293L17.9584 3.09384ZM26.8125 14.8647V27.8438C26.8125 28.4134 26.3508 28.8751 25.7812 28.8751H7.21875C6.64921 28.8751 6.1875 28.4134 6.1875 27.8438V14.8647L16.5 4.55225L26.8125 14.8647Z" fill={color}/>
    </Svg>
)

 export default HomeSvgComponent