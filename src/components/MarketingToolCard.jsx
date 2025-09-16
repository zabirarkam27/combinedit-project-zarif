import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    Swal.fire({
      title: `How ${name} works`,
      text: howItWorksContent,
      icon: "info",
      confirmButtonText: "Got it!",
    });
  };

  // sweetalert handler (Confirm toggle)
  const handleToggleConfirm = () => {
    Swal.fire({
      title: toggleAction === "on" ? `Turn on ${name}?` : `Turn off ${name}?`,
      text:
        toggleAction === "on"
          ? `Are you sure you want to turn on ${name}?`
          : `Are you sure you want to turn off ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1455ac",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmToggle();
        Swal.fire({
          title: "Done!",
          text:
            toggleAction === "on"
              ? `${name} has been turned on.`
              : `${name} has been turned off.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
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
    <div className="bg-white p-4 rounded-lg">
      <h1 className="text-lg font-bold">{name}</h1>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-700">
          To know more{" "}
          <span
            className="text-[#258ce6] underline cursor-pointer"
            onClick={handleHowItWorks}
          >
            How it works.
          </span>
        </p>
        <div className="flex gap-6 items-center cursor-pointer">
          <div className="flex" onClick={toggleAccordion}>
            <p className="text-sm text-[#258ce6]">
              {accordionOpen ? "Hide" : "View"}
            </p>
            <img
              src="https://img.icons8.com/?size=100&id=7801&format=png&color=228BE6"
              alt="arrow"
              className={`w-6 transform transition-transform ${
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
              e.preventDefault(); // default toggle আটকাচ্ছি
              handleToggleConfirm(); // sweetalert চালু
            }}
          />
        </div>
      </div>

      {accordionOpen && (
        <div className="mt-4 p-4 bg-[#ebf0f0] rounded">
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
            className="btn bg-[#1455ac] border-[#1455ac] text-white px-6 py-2 rounded-lg mt-6"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketingToolCard;
