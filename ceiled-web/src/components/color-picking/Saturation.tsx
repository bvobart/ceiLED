import React, { useRef } from 'react';
import throttle from 'lodash.throttle';
import { grey } from '@material-ui/core/colors';
import { HSVColor } from './colors';

export interface SaturationProps {
  className?: string
  hsv: HSVColor
  onChange: (hsv: HSVColor) => void
}

const Saturation = (props: SaturationProps) => {
  const cssColor = `hsl(${props.hsv.h * 360}, 100%, 50%)`;
  const backgroundRef = useRef<HTMLDivElement>(null);

  const onPointerMove = throttle((pageX: number, pageY: number) => {
    if (backgroundRef.current) {
      const { width, height, left, top } = backgroundRef.current.getBoundingClientRect();
      const mouseX = pageX - left - window.pageXOffset;
      const mouseY = pageY - top - window.pageYOffset;
      const x = mouseX < 0 ? 0 : mouseX > width ? width : mouseX;
      const y = mouseY < 0 ? 0 : mouseY > height ? height : mouseY;
      
      props.onChange(new HSVColor({ 
        h: props.hsv.h, 
        s: x / width, 
        v: -y / height + 1,
      }));
    }
  }, 20, { leading: true, trailing: true });

  const onClick = (event: React.MouseEvent) => onPointerMove(event.pageX, event.pageY);
  const onMouseMove = (event: MouseEvent) => onPointerMove(event.pageX, event.pageY);
  const onTouchMove = (event: TouchEvent) => onPointerMove(event.touches[0].pageX, event.touches[0].pageY);
  
  const onMouseDown = () => {
    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
  }
  const onMouseUp = () => {
    document.onmousemove = null;
    document.onmouseup = null;
  }
  
  const onTouchStart = () => {
    document.ontouchmove = onTouchMove;
    document.ontouchend = onTouchEnd;
  }
  const onTouchEnd = () => {
    document.ontouchmove = null;
    document.ontouchend = null;
  }
    
  const { hsv } = props;

  return (
    <div className={props.className} style={{ background: cssColor }}>
      <div className={props.className} style={{ background: 'linear-gradient(to right, #fff, rgba(255, 255, 255, 0))'}}>
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
  )
}

export default Saturation;
