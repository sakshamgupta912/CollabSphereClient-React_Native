import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import PropTypes from 'prop-types';

const AnnoucementIcon = ({ width, height, fillColor, ...rest }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" {...rest}>
      <Path
        fill={fillColor}
        d="M49.4,11.7L24.2,18H9.4v3h-6v14h1h5v3h1H13l2.7,14h0.8h6.5l-2.7-14h3.8l25.1,6.3V43v-8h3.3V21h-3.3V11.7z M9.4,33h-4V23h4V33z M20.7,50h-3.3l-2.3-12h3.3L20.7,50z M23.4,36H20h-7.4h-1.3v-1V21v-1h12V36z M47.4,21L47.4,21l0,14h0v6.7l-22-5.5V19.8l22-5.5V21z M50.6,23v10h-1.3V23H50.6z"
      />
      <Rect fill="#EA386E" x={54.9} y={27} width={4.8} height={2} />
      <Rect
        fill="#7065AD"
        transform="matrix(0.9126 -0.4088 0.4088 0.9126 -3.5859 25.19)"
        x={54.7}
        y={20}
        width={5}
        height={2}
      />
      <Rect
        fill="#FDBE57"
        transform="matrix(0.4088 -0.9126 0.9126 0.4088 1.827 72.8513)"
        x={56.1}
        y={32.5}
        width={2}
        height={5}
      />
    </Svg>
  );
};

AnnoucementIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fillColor: PropTypes.string,
};

AnnoucementIcon.defaultProps = {
  width: 64,
  height: 64,
  fillColor: '#35C6F4',
};

export default AnnoucementIcon;
