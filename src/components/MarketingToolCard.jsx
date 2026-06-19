import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmPopup, showInfoPopup, showSuccessPopup } from "../utils/popups";

const MarketingToolCard = ({
  name,
  placeholder,
  hook,
  onSave,
  howItWorksContent,
}) => {
  const {
    toolId,
    isOn,
    accordionOpen,
    toggleAccordion,
    toggleAction,
    handleChange,
    handleSlideClick,
    handleConfirmToggle,
  } = hook;

  // sweetalert handler (How it works)
  const handleHowItWorks = () => {
    showInfoPopup(`How ${name} works`, howItWorksContent);
  };

  // sweetalert handler (Confirm toggle)
  const handleToggleConfirm = async () => {
    const confirmed = await confirmPopup({
      title: toggleAction === "on" ? `Turn on ${name}?` : `Turn off ${name}?`,
      text:
        toggleAction === "on"
          ? `Are you sure you want to turn on ${name}?`
          : `Are you sure you want to turn off ${name}?`,
      confirmButtonText: "Yes",
    });

    if (!confirmed) return;

    handleConfirmToggle();
    showSuccessPopup(
      "Done",
      toggleAction === "on"
        ? `${name} has been turned on.`
        : `${name} has been turned off.`
    );
  };

  // save handler with validation
  const handleSave = () => {
    if (!toolId || toolId.trim() === "") {
      toast.error(`${name} ID cannot be empty!`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    onSave(toolId);
    toast.success(`${name} ID saved successfully!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <h1 className="text-lg font-bold">{name}</h1>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-700">
          To know more{" "}
          <span
            className="text-[#258ce6] underline cursor-pointer"
            onClick={handleHowItWorks}
          >
            How it works.
          </span>
        </p>
        <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
          <div className="flex" onClick={toggleAccordion}>
            <p className="text-sm text-[#258ce6]">
              {accordionOpen ? "Hide" : "View"}
            </p>
            <img
              src="https://img.icons8.com/?size=100&id=7801&format=png&color=228BE6"
              alt="arrow"
              className={`w-5 transform transition-transform ${
                accordionOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <input
            type="checkbox"
            className="toggle"
            checked={isOn}
            onChange={handleSlideClick}
            onClick={(e) => {
              e.preventDefault(); 
              handleToggleConfirm(); 
            }}
          />
        </div>
      </div>

      {accordionOpen && (
        <div className="mt-4 rounded-xl bg-[#ebf0f0] p-3 sm:p-4">
          <label className="block font-semibold mb-2">{name} ID</label>
          <input
            type="text"
            value={toolId}
            onChange={handleChange}
            placeholder={placeholder}
            className="input input-bordered w-full"
          />
          <button
            onClick={handleSave}
            className="btn mt-4 w-full rounded-lg border-[#1455ac] bg-[#1455ac] px-6 py-2 text-white sm:mt-6 sm:w-auto"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketingToolCard;
