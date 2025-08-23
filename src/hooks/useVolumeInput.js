import { useState } from "react";

const useVolumeInput = (initialVolume = "") => {
  let initialAmount = "";
  let initialUnit = "";

  if (initialVolume) {
    const [amount, unit] = initialVolume.split(" ");
    initialAmount = amount;
    initialUnit = unit;
  }

  const [volumeAmount, setVolumeAmount] = useState(initialAmount);
  const [volumeUnit, setVolumeUnit] = useState(initialUnit);

  const getCombinedVolume = () => `${volumeAmount} ${volumeUnit}`;

  return {
    volumeAmount,
    volumeUnit,
    setVolumeAmount,
    setVolumeUnit,
    getCombinedVolume,
  };
};

export default useVolumeInput;
