import React, {useEffect, useState} from "react";
import Exercise from "../exercise/Exercise";

const ProgressBarExercise = () => {
  return (
    <div className="progress-bar-exercise">
      <Exercise
        solution={<Solution breakpoints={[30, 60, 70, 75, 80]}/>}
        specsUrl="https://github.com/SpiffInc/spiff_react_exercises/issues/1"
        title="Progress Bar Exercise"
      />
    </div>
  );
};

export default ProgressBarExercise;

// ----------------------------------------------------------------------------------

// Constants
const BREAKPOINT_DELAY = 500;

// Styles
const barWrapperStyling = {
  height: '6px',
  width: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  background: 'linear-gradient(90deg, rgba(255,156,0,1) 35%, rgba(255,0,0,1) 100%)',
  overflow: 'hidden',
}
const barStyling = {
  height: '6px',
  width: '100%',
  background: 'white',
  position: 'relative',
  transition: '150ms linear',
}
const buttonStyle = {
  border: '1px solid #42C9B1',
  color: '#42C9B1',
  fontWeight: '400',
  borderRadius: '20px',
  padding: '10px 20px',
  margin: '5px',
}
const stopButtonStyle = {
  color: 'red',
  borderColor: 'red',
}

const switchStyle = {
  position: 'relative',
  display: 'inline-block',
  width: '60px',
  height: '34px',
}

const checkboxStyle = {
  opacity: 0,
  width: 0,
  height: 0,
}

const sliderStyle = {
  position: 'absolute',
  cursor: 'pointer',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#ccc',
  transition: '.4s',
  borderRadius: '34px',
}

const sliderInnerStyle = {
  position: 'absolute',
  height: '26px',
  width: '26px',
  left: '4px',
  bottom: '4px',
  backgroundColor: 'white',
  transition: '.4s',
  borderRadius: '50%',
}

const sliderLabelStyle = {
  position: 'relative',
  top: 11,
  marginLeft: 8,
}

const CustomButton = ({className, id, onClick, children, style = {}}) => {
  const [hovering, setHovering] = useState(false);
  const [active, setActive] = useState(false);
  const customStyle = {
    ...buttonStyle,
    ...style,
  }
  if (active) {
    customStyle.borderWidth = '3px';
  } else if (hovering) {
    customStyle.borderWidth = '2px';
  } else {
    customStyle.borderWidth = '1px';
  }

  return <button
    type={'button'}
    className={'action_button ' + className}
    id={id}
    key={id}
    onClick={onClick}
    style={customStyle}
    onMouseOver={() => (setHovering(true))}
    onMouseOut={() => (setHovering(false))}
    onMouseUp={() => (setActive(false))}
    onMouseDown={() => (setActive(true))}
  >
    {children}
  </button>
}

const CustomToggle = ({onToggleChange, label}) => {
  // state
  const [enabled, setEnabled] = useState(false);

  // constants
  const currentSliderInnerStyle = {...sliderInnerStyle};
  const currentSliderStyle = {...sliderStyle};

  if (enabled) {
    currentSliderInnerStyle.transform = 'translateX(26px)';
    currentSliderStyle.backgroundColor = '#42C9B1';
  }

  // functions
  const onClick = () => {
    onToggleChange(!enabled);
    setEnabled(!enabled);
  }
  return <div>
    <label style={switchStyle}>
      <input type="checkbox" style={checkboxStyle}/>
      <span className={'slider'} style={currentSliderStyle} onClick={onClick}>
      <span style={currentSliderInnerStyle}/>
    </span>
    </label>
    <span className={"sliderLabel"} style={sliderLabelStyle}>{label}</span>
  </div>
}

const Solution = ({breakpoints = []}) => {
  // states
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [finishingMilliseconds, setFinishingMilliseconds] = useState(150);
  const [respectBreakpoints, setRespectBreakpoints] = useState(false);

  // variables
  let delay = !respectBreakpoints ? 150 : ((15000 * .9) - (breakpoints.length * BREAKPOINT_DELAY)) / 90;
  if (respectBreakpoints && breakpoints.indexOf(progress) !== -1) {
    delay = BREAKPOINT_DELAY;
  }
  const fillerStyle = {
    ...barStyling,
    left: `${progress}%`,
    transition: `${!finishing ? delay : finishingMilliseconds}ms linear`,
  }
  const wrapperStyle = {
    ...barWrapperStyling,
    transition: `${progress === 100 ? 1 : 0}s ease-in`,
    opacity: progress === 100 ? 0 : 1,
  }

  // Effects
  useEffect(() => {
    if (finishing) {
      if (progress === 100) {
        setTimeout(() => {
          setFinishing(false);
          setProgress(0);
          setStarted(false);
        }, 2000)
        return;
      }
      setTimeout(() => (setProgress(progress + 1)), finishingMilliseconds)
    } else if (progress < 90 && progress > 0) {
      setTimeout(() => (setProgress(progress + 1)), delay)
    }
  }, [delay, progress, finishing, finishingMilliseconds])

  // Functions
  const actionClicked = () => {
    if (!started) {
      setProgress(1);
    }
    setStarted(true);

  }
  const finishRequest = () => {
    if (finishing) return;
    setFinishing(true);
    setFinishingMilliseconds(1000 / (100 - progress))
  }

  return <div>
    <div className={'bar_wrapper'} style={wrapperStyle}>
      <div className={'Bar'} style={fillerStyle}/>
    </div>
    <div className={'action_bar'}>
      <CustomButton onClick={actionClicked}>
        {started ? 'Loading...' : 'Start Request'}
      </CustomButton>
      {
        started && <CustomButton onClick={finishRequest} style={stopButtonStyle}>
          Finish Request
        </CustomButton>
      }
      <br/>
      <CustomToggle onToggleChange={() => {setRespectBreakpoints(!respectBreakpoints)}} label={"Respect Breakpoints"}/>
    </div>
  </div>;
};
