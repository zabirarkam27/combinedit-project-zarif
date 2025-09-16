import { useState } from "react";
import { loadScript, removeScript } from "../utils/scriptLoader";

export default function useMarketingTool(initialId = "", scriptConfig = null) {
  const [toolId, setToolId] = useState(initialId);
  const [isOn, setIsOn] = useState(!!initialId);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [showConfirmToggle, setShowConfirmToggle] = useState(false);
  const [toggleAction, setToggleAction] = useState("on");

  const handleChange = (e) => {
    setToolId(e.target.value);
  };

  const toggleAccordion = () => {
    setAccordionOpen((prev) => !prev);
  };

  const handleSlideClick = () => {
    setToggleAction(isOn ? "off" : "on");
    setShowConfirmToggle(true);
  };

  const handleConfirmToggle = async () => {
    if (toggleAction === "on") {
      setIsOn(true);
      if (scriptConfig && toolId) {
        await loadScript(scriptConfig.id, scriptConfig.src(toolId));
        if (scriptConfig.init) scriptConfig.init(toolId);
      }
    } else {
      setIsOn(false);
      if (scriptConfig) {
        removeScript(scriptConfig.id);
      }
    }
    setShowConfirmToggle(false);
  };

  return {
    toolId,
    setToolId,
    isOn,
    setIsOn,
    accordionOpen,
    toggleAccordion,
    showConfirmToggle,
    setShowConfirmToggle,
    toggleAction,
    handleChange,
    handleSlideClick,
    handleConfirmToggle,
  };
}
