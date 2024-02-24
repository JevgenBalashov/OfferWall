import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import styles from "./MainPage.module.css";

function MainPage() {
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null);
  const [log, setLog] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const logContainerRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://demo3005513.mockable.io/web/modes")
      .then((response) => {
        setModes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching modes:", error);
      });
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [log]);

  const handleModeSelect = (selectedOption) => {
    setSelectedMode(selectedOption);
    setLog([]);
    setShowGrid(false);
  };

  const handleStartClick = () => {
    setShowGrid(true);
  };

  const handleSquareHover = (event) => {
    const squareId = event.target.id;
    const [row, col] = squareId.split("-").map(Number);
    let message = `row ${row + 1} col ${col + 1}`;
    if (!event.target.classList.contains(styles.blue)) {
      event.target.classList.add(styles.blue);
      addLog(message);
    } else {
      event.target.classList.remove(styles.blue);
      removeLog(message);
    }
  };

  const addLog = (message) => {
    setLog((prevLog) => {
      return [...prevLog, message];
    });
  };

  const removeLog = (message) => {
    setLog((prevLog) => {
      return prevLog.filter((logMessage) => logMessage !== message);
    });
  };

  const generateSquareGrid = () => {
    if (selectedMode && showGrid) {
      const size = selectedMode.field;
      const rows = [];
      const squareSize = size >= 20 ? 7 : 35;
      for (let i = 0; i < size; i++) {
        const squares = [];
        for (let j = 0; j < size; j++) {
          const squareId = `${i}-${j}`;
          squares.push(
            <div
              key={squareId}
              id={squareId}
              className={`${styles.square} ${styles.white}`}
              onMouseEnter={handleSquareHover}
              style={{
                width: squareSize + 'px',
                height: squareSize + 'px'
            }}
            ></div>
          );
        }
        rows.push(
          <div key={i} className={styles.row}>
            {squares}
          </div>
        );
      }
      return <div className={styles.gridContainer}>{rows}</div>;
    }
    return null;
  };
  
  return (
    <div className={styles.mainSection}>
      <h1>Choose Mode:</h1>
      <div className={styles.SelectBtnContainer}>
        <div className={styles.modeSelector}>
          <Select
            onChange={handleModeSelect}
            options={modes}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => JSON.stringify(option)}
            placeholder="pick mode..."
            styles={{
              control: (provided) => ({
                ...provided,
                width: 200,
              }),
              menu: (provided) => ({
                ...provided,
                width: 200,
              }),
            }}
          />
        </div>
        <button
          className={styles.StartBtn}
          onClick={handleStartClick}
          disabled={!selectedMode}
        >
          Start
        </button>
      </div>
      <div className={styles.SquareLogContainer}>
        {selectedMode && showGrid && (
          <div className={styles.squareGrid}>{generateSquareGrid()}</div>
        )}
        <div className={styles.log} ref={logContainerRef}>
          {log.map((message, index) => (
            <div className={styles.logMessage} key={index}>
              {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;