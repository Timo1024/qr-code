import Svg, { Path } from 'react-native-svg';

const LinkSvgComponent = ({width, height, color}: {width: number, height: number, color: string}) => (
    <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
        <Path d="M9.42982 13.0849L6.68631 15.8284C4.34316 18.1715 4.34316 21.9705 6.68631 24.3137C9.02945 26.6568 12.8284 26.6568 15.1716 24.3137L18.8284 20.6568C21.1716 18.3137 21.1716 14.5147 18.8284 12.1715C18.3326 11.6757 17.7715 11.2847 17.1728 10.9988L16 12.1716C15.8781 12.2935 15.7751 12.4273 15.6913 12.5692C16.3221 12.75 16.9173 13.0888 17.4142 13.5858C18.9763 15.1479 18.9763 17.6805 17.4142 19.2426L13.7574 22.8995C12.1953 24.4616 9.66262 24.4616 8.10052 22.8995C6.53842 21.3374 6.53842 18.8047 8.10052 17.2426L9.68573 15.6574C9.46134 14.8172 9.37604 13.9475 9.42982 13.0849Z" fill={color}/>
        <Path d="M13.1716 9.34312C10.8284 11.6863 10.8284 15.4853 13.1716 17.8284C13.6675 18.3243 14.2285 18.7152 14.8272 19.0012L16.3784 17.45C15.7217 17.2746 15.101 16.9294 14.5858 16.4142C13.0237 14.8521 13.0237 12.3194 14.5858 10.7573L18.2427 7.10048C19.8048 5.53838 22.3374 5.53838 23.8995 7.10048C25.4616 8.66258 25.4616 11.1952 23.8995 12.7573L22.3143 14.3426C22.5387 15.1828 22.624 16.0525 22.5702 16.9151L25.3137 14.1715C27.6569 11.8284 27.6569 8.02941 25.3137 5.68627C22.9706 3.34312 19.1716 3.34312 16.8284 5.68627L13.1716 9.34312Z" fill={color}/>
    </Svg>
)

export default LinkSvgComponent