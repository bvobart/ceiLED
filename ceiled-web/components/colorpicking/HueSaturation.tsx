import React, {
  CSSProperties,
  FC,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { HSVColor } from '../../api/colors';
import { isBrowser } from '../../config';
import useBrightness from '../../hooks/api/useBrightness';
import { inRange } from './utils';

/**
 * Styles
 */
const rootStyles: CSSProperties = {
  position: 'relative',
  display: 'inline-grid',
  width: '100%',
  height: '256px',
};

const previewStyle: CSSProperties = {
  boxShadow: '0px 2px 3px rgba(0,0,0,.5)',
};

const spacerHeight = 8;
const spacerStyle: CSSProperties = {
  minHeight: `${spacerHeight}px`,
  width: '100%',
};

const pickerStyle = previewStyle;

const pointerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  borderRadius: '50%',
  pointerEvents: 'none',
};

//-----------------------------------

export interface HueSaturationProps {
  className?: string;
  hue: number;
  saturation: number;
  value: number;
  onChange: (newHSV: HSVColor) => void;
}

/**
 * Component for picking Hue and Saturation of a colour.
 * Horizontal axis: hue
 * Vertical axis: saturation
 * @param props props
 */
const HueSaturation: FC<HueSaturationProps> = props => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<HTMLCanvasElement>(null);
  const moverRef = useRef<PointerMover>(new PointerMover(pickerRef));

  // assume 250 x 200 viewpoint on first render, afterwards the offsetWidth and offsetHeight will be set.
  const [rootWidth, setRootWidth] = useState(rootRef.current?.offsetWidth || 250);
  const [rootHeight, setRootHeight] = useState(rootRef.current?.offsetHeight || 200);
  const setCurrentSize = useCallback(() => {
    if (!rootRef.current) return;
    setRootWidth(rootRef.current.offsetWidth);
    setRootHeight(rootRef.current.offsetHeight);
  }, [rootRef]);
  useLayoutEffect(() => {
    setCurrentSize();
    window.addEventListener('resize', setCurrentSize);
    return () => window.removeEventListener('resize', setCurrentSize);
  }, [setCurrentSize]);

  const dpi = isBrowser() ? window.devicePixelRatio || 1 : 1;
  const width = rootWidth * dpi;
  const totalHeight = rootHeight * dpi;
  const previewHeight = 0.2 * totalHeight;
  const pickerHeight = totalHeight - previewHeight;
  const pointerSize = 8; // px

  // calculate pointer { x, y } position on picker canvas
  const { hue, saturation, value, onChange } = props;
  const x = width * hue;
  const y = previewHeight + spacerHeight + pickerHeight * (1 - saturation);

  // make colour picker apply global brightness level.
  const [brightness] = useBrightness();
  const currentColor = useMemo(
    () => new HSVColor({ h: hue, s: saturation, v: value }).withBrightness(brightness),
    [hue, saturation, value, brightness],
  );

  // redraw the hue and saturation gradients on the canvas when canvas size changes.
  useEffect(() => {
    const context = pickerRef.current?.getContext('2d');
    if (!context) return;

    // draw horizontal rainbow for hue selection
    const hueGradient = context.createLinearGradient(0, 0, width, 0);
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      hueGradient.addColorStop(i / steps, new HSVColor({ h: i / steps, s: 1, v: 1 }).toCSS());
    }
    context.fillStyle = hueGradient;
    context.fillRect(0, 0, width, pickerHeight);

    // draw vertical saturation gradient with value as shade of white.
    const satGradient = context.createLinearGradient(0, 0, 0, pickerHeight);
    satGradient.addColorStop(0, HSVColor.WHITE.toCSS(0));
    satGradient.addColorStop(1, HSVColor.WHITE.toCSS(1));
    context.fillStyle = satGradient;
    context.fillRect(0, 0, width, pickerHeight);

    // draw a brightness mask from black (value == 0) to transparant (value == 1)
    const valueMask = context.createLinearGradient(0, 0, 0, pickerHeight);
    valueMask.addColorStop(0, HSVColor.BLACK.toCSS(1 - value * (brightness / 100)));
    context.fillStyle = valueMask;
    context.fillRect(0, 0, width, pickerHeight);
  }, [width, pickerHeight, value, brightness]);

  // redraw the preview on the canvas when chosen colour changes
  useEffect(() => {
    const context = previewRef.current?.getContext('2d');
    if (!context) return;

    // draw preview
    context.fillStyle = currentColor.toCSS();
    context.fillRect(0, 0, width, previewHeight);
  }, [previewHeight, width, currentColor]);

  /**
   * Handles how hue and saturation changes when moving the pointer across the canvas
   */
  useEffect(() => {
    moverRef.current.onChange = (newX: number, newY: number): void => {
      const newHue = newX / width;
      const newSat = 1 - newY / pickerHeight;

      if (newHue !== hue || newSat !== saturation) {
        onChange(new HSVColor({ h: newHue, s: newSat, v: value }));
      }
    };
  }, [hue, saturation, value, onChange, pickerHeight, width]);

  // upon component mount and unmount, also mount / unmount the listener for when pointer is moved.
  useLayoutEffect(() => {
    moverRef.current.mount();
    return moverRef.current.unmount.bind(moverRef.current);
  }, []);

  return (
    <div ref={rootRef} className={props.className} style={rootStyles}>
      {/* preview */}
      <canvas
        ref={previewRef}
        width={width}
        height={previewHeight}
        style={{ ...previewStyle, width: `${width / dpi}px`, height: `${previewHeight / dpi}px` }}
      />
      <div style={spacerStyle} />
      {/* picker */}
      <canvas
        ref={pickerRef}
        width={width}
        height={pickerHeight}
        style={{ ...pickerStyle, width: `${width / dpi}px`, height: `${pickerHeight / dpi}px` }}
      />
      {/* pointer */}
      <canvas
        ref={pointerRef}
        width={pointerSize}
        height={pointerSize}
        style={{
          ...pointerStyle,
          border: `2px solid ${currentColor.textCSS()}`,
          width: `${pointerSize / dpi}px`,
          height: `${pointerSize / dpi}px`,
          transform: `translate(-50%, -50%) translate(${x / dpi}px, ${y / dpi}px)`,
        }}
      />
    </div>
  );
};

class PointerMover {
  private canvas: RefObject<HTMLCanvasElement>;
  private dpi = isBrowser() ? window.devicePixelRatio || 1 : 1;
  private isMoving = false;
  private bounds?: DOMRect;

  public onChange?: (newX: number, newY: number) => void;

  constructor(canvasRef: RefObject<HTMLCanvasElement>) {
    this.canvas = canvasRef;
  }

  mount() {
    if (!this.canvas.current) return;
    this.canvas.current.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    window.addEventListener('pointermove', this.handlePointerMove.bind(this));
    window.addEventListener('pointerup', this.handlePointerUp.bind(this));
  }

  unmount() {
    this.canvas.current?.removeEventListener('pointerdown', this.handlePointerDown.bind(this));
    window.removeEventListener('pointermove', this.handlePointerMove.bind(this));
    window.removeEventListener('pointerup', this.handlePointerUp.bind(this));
  }

  handlePointerDown(event: PointerEvent) {
    event.stopPropagation();
    this.isMoving = true;

    if (this.canvas.current && this.onChange) {
      this.bounds = this.canvas.current.getBoundingClientRect();
      const { x, y } = getNewPointerPosition(event, this.bounds, this.dpi);
      this.onChange(x, y);
    }
  }

  handlePointerMove(event: PointerEvent) {
    event.stopPropagation();

    if (this.isMoving && this.bounds && this.onChange) {
      const { x, y } = getNewPointerPosition(event, this.bounds, this.dpi);
      this.onChange(x, y);
    }
  }

  handlePointerUp(event: PointerEvent) {
    event.stopPropagation();

    if (this.isMoving && this.bounds && this.onChange) {
      const { x, y } = getNewPointerPosition(event, this.bounds, this.dpi);
      this.onChange(x, y);
    }

    this.isMoving = false;
    this.bounds = undefined;
  }
}

const getNewPointerPosition = (event: PointerEvent, bounds: DOMRect, dpi: number): { x: number; y: number } => {
  const { clientX, clientY } = event;
  const { top, left, width, height } = bounds;
  return {
    x: inRange((clientX - left) * dpi, 0, width),
    y: inRange((clientY - top) * dpi, 0, height),
  };
};

export default React.memo(HueSaturation);
