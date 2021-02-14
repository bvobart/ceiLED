import React, { useCallback, useContext, useRef } from 'react';
import throttle from 'lodash.throttle';
import { grey } from '@material-ui/core/colors';
import { HSVColor } from './colors';
import { ColorContext } from '../../hooks/context/ColorContext';

export interface SaturationProps {
  className?: string;
}

/**
 * This Saturation box's background is the hue of the current color in ColorContext,
 * and has two gradients on top to simulate saturation and value.
 * The pointer also moves.
 * Sadly though, on Chrome / Chromium on Linux (at least on mine, Nvidia GPU), the onPointerMove gets throttled,
 * which causes the pointer and previews to lag quite a lot. This problem doesn't happen on Android,
 * Chrome on Windows, or Firefox on Linux.
 * Maybe only solvable with canvas, idk.
 * @param props props
 */
const Saturation = (props: SaturationProps) => {
  const [hsv, setHSV] = useContext(ColorContext);
  const cssColor = `hsl(${hsv.h * 360}, 100%, 50%)`;
  const backgroundRef = useRef<HTMLDivElement>(null);

  /**
   * Calculates the resulting HSVColor based on the pointer position on the saturation canvas.
   * @param mousePageX mouse position X coordinate
   * @param mousePageY mouse position Y coordinate
   */
  const getHSVfromPointerPosition = useCallback(
    (mousePageX: number, mousePageY: number, bg: HTMLDivElement): HSVColor => {
      const { width, height, left, top } = bg.getBoundingClientRect();
      const mouseX = mousePageX - left - window.pageXOffset;
      const mouseY = mousePageY - top - window.pageYOffset;
      const x = mouseX < 0 ? 0 : mouseX > width ? width : mouseX;
      const y = mouseY < 0 ? 0 : mouseY > height ? height : mouseY;

      return new HSVColor({
        h: hsv.h, // hue remains the same
        s: x / width, // saturation is based on horizontal position
        v: -y / height + 1, // value is based on vertical position
      });
    },
    [hsv.h],
  );

  const onPointerMove = throttle((pageX: number, pageY: number) => {
    if (backgroundRef.current) {
      const newColor = getHSVfromPointerPosition(pageX, pageY, backgroundRef.current);
      setHSV(newColor);
    }
  }, 16);

  const onClick = (event: React.MouseEvent) => onPointerMove(event.pageX, event.pageY);
  const onMouseMove = (event: MouseEvent) => onPointerMove(event.pageX, event.pageY);
  const onTouchMove = (event: TouchEvent) => onPointerMove(event.touches[0].pageX, event.touches[0].pageY);

  const onMouseDown = () => {
    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
  };
  const onMouseUp = () => {
    document.onmousemove = null;
    document.onmouseup = null;
  };

  const onTouchStart = () => {
    document.ontouchmove = onTouchMove;
    document.ontouchend = onTouchEnd;
  };
  const onTouchEnd = () => {
    document.ontouchmove = null;
    document.ontouchend = null;
  };

  return (
    <div className={props.className} style={{ background: cssColor }}>
      <div
        className={props.className}
        style={{ background: 'linear-gradient(to right, #fff, rgba(255, 255, 255, 0))' }}
      >
        <div
          className={props.className}
          ref={backgroundRef}
          onClick={onClick}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          style={{
            background: 'linear-gradient(to top, #000, rgba(0, 0, 0, 0))',
            position: 'relative',
            touchAction: 'none',
          }}
        >
          <div
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            style={{
              height: '8px',
              width: '8px',
              background: hsv.toCSS(),
              border: `2px solid ${hsv.v > 0.5 ? 'black' : grey[400]}`,
              borderRadius: '50%',
              position: 'absolute',
              top: `${-100 * hsv.v + 100}%`,
              left: `${100 * hsv.s}%`,
              transform: 'translate(-6px, -6px)',
              touchAction: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Saturation;
