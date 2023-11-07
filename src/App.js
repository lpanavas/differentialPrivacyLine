import React, { useState } from "react";
import LineChart from "./Components/LineChart";
import HistogramComponent from "./Components/HistogramComponent";
import SingleBarComponent from "./Components/SingleBarComponent";
import LaplaceBarChart from "./Components/LaplaceBarChart";
import Slider from "rc-slider";
import "./App.css";
import "rc-slider/assets/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const panelDetails = {
  epsilon:
    "Epsilon is a small positive number often used in algorithms to denote a small tolerance.",
  query:
    "A query is a request for data or information from a database or system.",
  algorithm: "An algorithm is a step-by-step procedure for calculations.",
  bounds:
    "Bounds are the limits within which a process or variable must operate.",
  delta: "Delta is a symbol typically used to represent change in a variable.",
  accuracyMetric:
    "An accuracy metric measures the correctness of a system, often used in machine learning.",

  sensitivity: "Sensitivity is how much a person can affect a dataset release",
};

function App() {
  const MIN_EPSILON = 0.1;
  const MAX_EPSILON = 2;
  // const scenarios = [
  //   {
  //     title: "Identifying Substance Abuse Cases in a School District",
  //     description:
  //       "You are a health official tasked with understanding substance abuse patterns within a school district. After running a confidential survey across high schools, you aim to disclose the number of positive cases to guide future preventive campaigns. Given the sensitive nature of the topic and potential repercussions for identified students, it's critical to maintain their privacy. Your goal is to release a count that provides a broad understanding of the scale of the issue without putting any individual student at risk. Specifically, the disclosed count shouldn't deviate by more than 2 from the actual figure. Through careful adjustment of ε, you intend to strike this delicate balance between data transparency and student confidentiality.",
  //   },
  //   {
  //     title: "Average Age in a High School",
  //     description:
  //       "You are an educational researcher studying the age distribution of high school students in a school with 967 students. The goal is to determine the average age of students. You need the average age to be accurate within 0.01 years of the true mean. Adjusting ε will help you understand how close you can get to the true mean without compromising individual student's data.",
  //   },
  //   {
  //     title: "Income Distribution in a Small Town",
  //     description:
  //       "As an economist, you're researching the economic health of a small town with a population of 5,000. Your focus is on the household income distribution, which is segmented into five distinct bands: <$20k, $20k-$40k, $40k-$60k, $60k-$80k, and >$80k. To provide an accurate economic picture without risking individual household privacy, it's vital that no bin value deviates by more than 5 from the actual count. By adjusting ε, you aim to maintain the integrity of the town's economic distribution while ensuring individual households remain anonymous.",
  //   },
  // ];
  // const [isScenarioVisible, setIsScenarioVisible] = useState(true);
  // const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);

  const [queryType, setQueryType] = useState("Count");
  const [trueValue, setTrueValue] = useState(100);
  const [numBins, setNumBins] = useState(1);
  const [releaseQueries, setReleaseQueries] = useState(1);
  const [datasetBounds, setDatasetBounds] = useState({ low: 0, high: 100 });
  const [datasetSize, setDatasetSize] = useState(100);
  const [selectedEpsilon, setSelectedEpsilon] = useState(1);
  const delta = 0.05;
  const delta_gaussian = 0.001;
  const k = queryType === "Histogram" ? numBins : 1;
  const sensitivity =
    queryType === "Sum"
      ? datasetBounds.high - datasetBounds.low
      : queryType === "Mean"
      ? (datasetBounds.high - datasetBounds.low) / datasetSize
      : 1;
  const errorForSelectedEpsilon =
    Math.log(k / delta) * (sensitivity / selectedEpsilon);

  // const handleScenarioChange = (scenarioTitle) => {
  //   const scenario = scenarios.find((s) => s.title === scenarioTitle);
  //   setSelectedScenario(scenario);
  // };

  const [activePanel, setActivePanel] = useState(null);

  const handlePanelClick = (panel) => {
    setActivePanel(panel); // Set the active panel to the one clicked
  };

  const handleClosePanel = () => {
    setActivePanel(null); // Close the active panel by setting it to null
  };
  return (
    <div className="dashboard">
      <header className="dashboard-header">Dashboard Header</header>
      <div className="container">
        <aside className={`side-panel ${activePanel ? "expanded" : ""}`}>
          <div className="side-panel-header">
            <h2 className="side-panel-title">Parameters</h2>
          </div>
          {!activePanel ? (
            <ul className="panel-list">
              {Object.keys(panelDetails).map((panel) => (
                <li
                  key={panel}
                  onClick={() => handlePanelClick(panel)}
                  className="panel-list-item"
                >
                  {panel.charAt(0).toUpperCase() + panel.slice(1)}
                </li>
              ))}
            </ul>
          ) : (
            <div className="panel-content">
              <button className="close-button" onClick={handleClosePanel}>
                &times;
              </button>
              <div className="content">
                <h2>
                  {activePanel.charAt(0).toUpperCase() + activePanel.slice(1)}
                </h2>
                <p>{panelDetails[activePanel]}</p>
              </div>
            </div>
          )}
        </aside>
        <main className={`main-content ${activePanel ? "shrink" : ""}`}>
          <h1>Main Content</h1>
          {/* <p>
            This is the main area of the dashboard. Click on the panels for more
            information.
          </p> */}
          <div className="layout-container">
            <div className="top-row">
              <div className="parameters-container">
                <div className="app-section">
                  <label>
                    Select query type:
                    <select
                      value={queryType}
                      onChange={(e) => setQueryType(e.target.value)}
                    >
                      <option value="Count">Count</option>
                      <option value="Sum">Sum</option>
                      <option value="Mean">Mean</option>
                      <option value="Histogram">Histogram</option>
                    </select>
                  </label>
                </div>
                <div className="app-section">
                  <label>
                    True value of query:
                    <input
                      type="number"
                      value={trueValue}
                      onChange={(e) => setTrueValue(parseInt(e.target.value))}
                    />
                  </label>
                </div>
                <div className="app-section">
                  <label>
                    What is the largest effect a person could have on the
                    statistical release:
                    <input
                      type="number"
                      value={releaseQueries}
                      onChange={(e) =>
                        setReleaseQueries(parseInt(e.target.value))
                      }
                    />
                    {/* Font Awesome question mark icon to open the sensitivity panel */}
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      className="question-mark-icon"
                      onClick={() => handlePanelClick("sensitivity")}
                    />
                  </label>
                </div>
                {queryType === "Histogram" && (
                  <div className="app-section">
                    <label>
                      Number of bins:
                      <input
                        type="number"
                        value={numBins}
                        onChange={(e) => setNumBins(parseInt(e.target.value))}
                      />
                    </label>
                  </div>
                )}
                {(queryType === "Sum" || queryType === "Mean") && (
                  <div className="app-section">
                    <label>
                      Estimated Low Value of Dataset:
                      <input
                        type="number"
                        value={datasetBounds.low}
                        onChange={(e) =>
                          setDatasetBounds((prev) => ({
                            ...prev,
                            low: parseInt(e.target.value),
                          }))
                        }
                      />
                    </label>
                    <br />
                    <label>
                      Estimated High Value of Dataset:
                      <input
                        type="number"
                        value={datasetBounds.high}
                        onChange={(e) =>
                          setDatasetBounds((prev) => ({
                            ...prev,
                            high: parseInt(e.target.value),
                          }))
                        }
                      />
                    </label>
                  </div>
                )}
                {queryType === "Mean" && (
                  <div className="app-section">
                    <label>
                      Dataset Size:
                      <br />
                      <input
                        type="number"
                        value={datasetSize}
                        onChange={(e) =>
                          setDatasetSize(Math.max(1, parseInt(e.target.value)))
                        }
                      />
                    </label>
                  </div>
                )}

                <div className="app-section">
                  {/* <div className="epsilon-display">
                    <span>Epsilon Range: {sliderValues[0].toFixed(2)}</span>
                    <span>Selected Epsilon: {sliderValues[1].toFixed(2)}</span>
                    <span>{sliderValues[2].toFixed(2)}</span>
                  </div> */}
                  {/* <Slider
                    range
                    min={MIN_EPSILON}
                    max={MAX_EPSILON}
                    step={0.01}
                    value={sliderValues}
                    onChange={(values) => setSliderValues(values)}
                    allowCross={false}
                  /> */}
                </div>
              </div>
              <div className="chart-container">
                <LineChart
                  width={400}
                  height={300}
                  trueValue={trueValue}
                  minEpsilon={MIN_EPSILON}
                  maxEpsilon={MAX_EPSILON}
                  selectedEpsilon={selectedEpsilon}
                  setSelectedEpsilon={setSelectedEpsilon}
                  releaseQueries={releaseQueries}
                  k={k}
                  sensitivity={sensitivity}
                />
                <div className="app-section">
                  Above is the accuracy vs epsilon curve tradeoff. To the right
                  is an example of the query with possible outcomes at the given
                  level of privacy. RIght now this is just for laplace.
                </div>
                <div className="app-section">
                  With a confidence level of {((1 - delta) * 100).toFixed(2)}%:
                  The error of the Laplace mechanism's private statistical
                  estimate is expected to be less than or equal to{" "}
                  {errorForSelectedEpsilon.toFixed(2)}.
                </div>
              </div>
              <div className="error-chart-container">
                <LaplaceBarChart
                  width={50}
                  height={500}
                  trueValue={trueValue}
                  releaseQueries={releaseQueries}
                  sensitivity={sensitivity}
                  epsilon={selectedEpsilon}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
