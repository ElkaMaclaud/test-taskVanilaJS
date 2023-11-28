let values = [100, 900];
let isDraggingMin = false;
let isDraggingMax = false;
const WIDTH = 24;
const minSumRef = document.querySelector(".inputRoundFirst");
const maxSumRef = document.querySelector(".inputRoundSecond");
const inputRange = document.querySelector(".inputRange");
const inputMin = document.getElementById("inputMin");
const inputMax = document.getElementById("inputMax");
inputMin.value = currenciesFormatted(values[0])
inputMax.value = currenciesFormatted(values[1])
minSumRef.addEventListener("mousedown", () => {
  isDraggingMin = true;
  document.addEventListener("mousemove", handleMouseMove);
});
minSumRef.addEventListener("touchstart", () => {
  isDraggingMin = true;
  document.addEventListener("touchmove", handleMouseMove);
});
maxSumRef.addEventListener("mousedown", () => {
  isDraggingMax = true;
  document.addEventListener("mousemove", handleMouseMove);
});
maxSumRef.addEventListener("touchstart", () => {
  isDraggingMax = true;
  document.addEventListener("touchmove", handleMouseMove);
});

inputMin.addEventListener("input", onChangeMin);
inputMin.addEventListener("blur", handleBlurMin);
inputMax.addEventListener("input", onChangeMax);
inputMax.addEventListener("blur", handleBlurMax);
const maxValue = inputMax.getAttribute("data-valueMax");

minSumRef.style.left = `${values[0] / 9}px`;
maxSumRef.style.left = `${values[1] / 9}px`;
setBackgroundColor();

function handleMouseMove(event) {
  const rect = inputRange.getBoundingClientRect();
  const minSum = minSumRef.getBoundingClientRect();
  const maxSum = maxSumRef.getBoundingClientRect();
  const coordinateX =
    event.type === "mousemove" ? event.clientX : event.touches[0].clientX;
  if (isDraggingMin) {
    if (coordinateX >= rect.x && coordinateX <= maxSum.x - WIDTH) {
      let offsetX = coordinateX - rect.left;
      values = [offsetX * 9, values[1]];
      inputMin.value = currenciesFormatted(offsetX * 9);
      minSumRef.style.left = `${offsetX}px`;
      setBackgroundColor();
    } else if (coordinateX < rect.x) {
      values = [0, values[1]];
      inputMin.value = currenciesFormatted(0);
      minSumRef.style.left = `${0}px`;
      setBackgroundColor();
    } else if (coordinateX > maxSum.x - WIDTH) {
      let offsetX = maxSum.x - rect.left - WIDTH;
      values = [offsetX * 9, values[1]];
      inputMin.value = currenciesFormatted(offsetX * 9);
      minSumRef.style.left = `${offsetX}px`;
      setBackgroundColor();
    }
  } else if (isDraggingMax) {
    if (coordinateX >= minSum.x + WIDTH && coordinateX <= rect.right - WIDTH) {
      let offsetX = coordinateX - rect.left;
      values = [values[0], offsetX * 9];
      inputMax.value = currenciesFormatted(offsetX * 9);
      maxSumRef.style.left = `${offsetX}px`;
      setBackgroundColor();
    } else if (coordinateX < minSum.x + WIDTH) {
      let offsetX = minSum.x - rect.left + WIDTH;
      values = [values[0], offsetX * 9];
      inputMax.value = currenciesFormatted(offsetX * 9);
      maxSumRef.style.left = `${offsetX}px`;
      setBackgroundColor();
    } else if (coordinateX > rect.right - WIDTH) {
      let offsetX = rect.right - rect.left - WIDTH;
      values = [values[0], offsetX * 9];
      inputMax.value = currenciesFormatted(offsetX * 9);
      maxSumRef.style.left = `${offsetX}px`;
      setBackgroundColor();
    }
  }
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("touchend", handleMouseUp);
}

function handleMouseUp() {
  isDraggingMin = false;
  isDraggingMax = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("touchmove", handleMouseMove);
}

const PATTERN = /[^0-9]/g;
const PATTERN_STARTSWITH = /^0+/;
const getInputNumbersValue = (value) => {
  if (value) {
    const newValue = value.replace(PATTERN, "").replace(PATTERN_STARTSWITH, "");
    return newValue;
  }
  return "";
};

function currenciesFormatted(value) {
  if (value !== null) {
    return value + " ₽";
  }
  return "";
};

function setBackgroundColor() {
  inputRange.style.background = `linear-gradient(to right, #FFECBB ${
    values[0] / 9 + 12
  }px, #FDC840 ${values[0] / 9}px ${values[1] / 9 + 12}px, #FFECBB ${
    values[1] / 9
  }px)`;
}

function handleBlurMin() {
  if (values[0] <= 0 && values[0] !== null) {
    values = [0, values[1]];
    inputMin.value = currenciesFormatted(0);
    minSumRef.style.left = `${0 / 9}px`;
    setBackgroundColor();
  } else if (values[0] >= values[1]) {
    values = [values[1] - WIDTH * 9, values[1]];
    inputMin.value = currenciesFormatted(values[1] - WIDTH * 9);
    minSumRef.style.left = `${(values[1] - WIDTH * 9) / 9}px`;
    setBackgroundColor();
  } else {
    values = [values[0], values[1]];
    inputMin.value = currenciesFormatted(values[0]);
    minSumRef.style.left = `${values[0] / 9}px`;
    setBackgroundColor();
  }
}

function handleBlurMax() {
  if (values[1] <= values[0] && values[1] !== null) {
    values = [values[0], values[0] + WIDTH * 9];
    inputMax.value = currenciesFormatted(values[0] + WIDTH * 9);
    maxSumRef.style.left = `${(values[0] + WIDTH * 9) / 9}px`;
    setBackgroundColor();
  } else if (values[1] > Number(maxValue)) {
    values = [values[0], Number(maxValue)];
    inputMax.value = currenciesFormatted(maxValue);
    maxSumRef.style.left = `${Number(maxValue) / 9}px`;
    setBackgroundColor();
  } else {
    values = [values[0], values[1]];
    inputMax.value = currenciesFormatted(values[1]);
    maxSumRef.style.left = `${values[1] / 9}px`;
    setBackgroundColor();
  }
}

function onChangeMin(e) {
  const value = getInputNumbersValue(e.target.value);
  const max = values[1];
  const thumbWidth = WIDTH * 9;
  if (value >= 0 && value <= max - thumbWidth) {
    values = [value, values[1]];
    inputMin.value = currenciesFormatted(value);
    minSumRef.style.left = `${value / 9}px`;
    setBackgroundColor();
  } else if (value < 0) {
    values = [0, values[1]];
    inputMin.value = currenciesFormatted(0);
    minSumRef.style.left = `${0}px`;
    setBackgroundColor();
  } else if (value > max - thumbWidth) {
    values = [max - thumbWidth, values[1]];
    inputMin.value = currenciesFormatted(max - thumbWidth);
    minSumRef.style.left = `${(max - thumbWidth) / 9}px`;
    setBackgroundColor();
  }
}

function onChangeMax(e) {
  const value = getInputNumbersValue(e.target.value);
  const min = values[0];
  const thumbWidth = WIDTH * 9;
  if (value >= min + thumbWidth && value <= Number(maxValue)) {
    values = [values[0], value];
    inputMax.value = currenciesFormatted(value);
    maxSumRef.style.left = `${value / 9}px`;
    setBackgroundColor();
  } else if (value < min + thumbWidth) {
    values = [values[0], min + thumbWidth];
    inputMax.value = currenciesFormatted(min + thumbWidth);
    maxSumRef.style.left = `${(min + thumbWidth) / 9}px`;
    setBackgroundColor();
  } else if (value > Number(maxValue)) {
    values = [values[0], Number(maxValue)];
    maxSumRef.style.left = `${Number(maxValue) / 9}px`;
    inputMax.value = currenciesFormatted(maxValue);
    setBackgroundColor();
  }
}
