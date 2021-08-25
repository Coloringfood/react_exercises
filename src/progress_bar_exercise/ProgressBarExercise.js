import React, {useState, useEffect} from "react";
import Exercise from "../exercise/Exercise";

const ProgressBarExercise = () => {
  return (
    <div className="progress-bar-exercise">
      <Exercise
        solution={<Solution/>}
        specsUrl="https://github.com/SpiffInc/spiff_react_exercises/issues/1"
        title="Progress Bar Exercise"
      />
    </div>
  );
};

export default ProgressBarExercise;

// ----------------------------------------------------------------------------------
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

const Solution = () => {
  // states
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [finishingMilliseconds, setFinishingMilliseconds] = useState(150);

  // variables
  const fillerStyle = {
    ...barStyling,
    left: `${progress}%`
  }

  // Effects
  useEffect(() => {
    if (finishing) {
      if (progress === 100) return
      setTimeout(() => (setProgress(progress + 1)), finishingMilliseconds)
    } else if (progress < 90 && progress > 0) {
      setTimeout(() => (setProgress(progress + 1)), 150)
    }
  }, [progress, finishing, finishingMilliseconds])

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
    <div className={'bar_wrapper'} style={barWrapperStyling}>
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
    </div>
  </div>;
};
