let array = [];

// Ensure elements exist before trying to access them
const algoSelect = document.getElementById("algorithm");
if (algoSelect) {
    const algo = algoSelect.value;
    updateAlgorithmInfo(algo);
}

const arrayContainer = document.getElementById("array-container");
if (!arrayContainer) {
    console.error("Array container element not found!");
}

function generateArray() {
    console.log("Generating array...");
    const sizeInput = document.getElementById("size");
    if (!sizeInput) {
        console.error("Size input element not found!");
        return;
    }
    
    const size = Math.min(parseInt(sizeInput.value) || 30, 100);
    console.log(`Generating array of size: ${size}`);
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 200) + 20);
    console.log(`Generated array: ${array}`);
    renderArray();
}

function renderArray() {
  const container = document.getElementById("array-container");
  container.innerHTML = "";
  const max = Math.max(...array);

  array.forEach(value => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${value}px`;

    const hue = (value / max) * 240;
    bar.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

    container.appendChild(bar);
  });
}
  
async function startSort() {
  const algo = document.getElementById("algorithm").value;
  if (algo === "bubble") await bubbleSort();
  else if (algo === "insertion") await insertionSort();
  else if (algo === "quick") await quickSort(0, array.length - 1);
  else if (algo === "merge") await mergeSort(0, array.length - 1);
  renderArray();
}

async function bubbleSort() {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j +  1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        renderArray();
        await sleep(50);
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function quickSort(low, high) {
    if (low < high) {
      const pivotIndex = await partition(low, high);
      await quickSort(low, pivotIndex - 1);
      await quickSort(pivotIndex + 1, high);
    }
  }
  
  async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;
  
    for (let j = low; j < high; j++) {
      highlightBars([j, high], 'yellow');
  
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        renderArray();
        await sleep(200);
      }
  
      resetHighlight([j, high]);
    }
  
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    renderArray();
    await sleep(200);
  
    return i + 1;
  }
  
  function highlightBars(indices, color) {
    const bars = document.getElementsByClassName("bar");
    indices.forEach(index => {
      if (bars[index]) bars[index].style.backgroundColor = color;
    });
  }
  
  function resetHighlight(indices) {
    const max = Math.max(...array);
    const bars = document.getElementsByClassName("bar");
    indices.forEach(index => {
      if (bars[index]) {
        const hue = (array[index] / max) * 240;
        bars[index].style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
      }
    });
  }
  
  function updateAlgorithmInfo(algo) {
    const info = document.getElementById("info");
    let name = "", complexity = "";
  
    switch (algo) {
      case "bubble":
        name = "Bubble Sort";
        complexity = "Best: O(n), Average/Worst: O(n²)";
        break;
      case "insertion":
        name = "Insertion Sort";
        complexity = "Best: O(n), Average/Worst: O(n²)";
        break;
      case "quick":
        name = "Quick Sort";
        complexity = "Best/Average: O(n log n), Worst: O(n²)";
        break;
      case "merge":
        name = "Merge Sort";
        complexity = "Best/Average/Worst: O(n log n)";
        break;
      default:
        name = "Unknown";
        complexity = "-";
    }
  
    info.innerText = `🔍 Algorithm: ${name} | ⏱ Time Complexity: ${complexity}`;
  }
  
  async function startSort() {
    const algo = document.getElementById("algorithm").value;
    updateAlgorithmInfo(algo); // <== MAKE SURE THIS LINE EXISTS
  
    if (algo === "bubble") await bubbleSort();
    else if (algo === "insertion") await insertionSort();
    else if (algo === "quick") await quickSort(0, array.length - 1);
    else if (algo === "merge") await mergeSort(0, array.length - 1);
  }
  
  async function mergeSort(start, end) {
    if (start >= end) return;
  
    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
  }
  
  async function merge(start, mid, end) {
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
  
    while (i < left.length && j < right.length) {
      highlightBars([k], "yellow");
  
      if (left[i] <= right[j]) {
        array[k] = left[i];
        i++;
      } else {
        array[k] = right[j];
        j++;
      }
  
      renderArray();
      await sleep(200);
      resetHighlight([k]);
      k++;
    }
  
    while (i < left.length) {
      array[k] = left[i];
      renderArray();
      highlightBars([k], "yellow");
      await sleep(200);
      resetHighlight([k]);
      i++;
      k++;
    }
  
    while (j < right.length) {
      array[k] = right[j];
      renderArray();
      highlightBars([k], "yellow");
      await sleep(200);
      resetHighlight([k]);
      j++;
      k++;
    }
  }
  
  async function insertionSort() {
    const n = array.length;
  
    for (let i = 1; i < n; i++) {
      let key = array[i];
      let j = i - 1;
  
      // Highlight the current key being inserted
      highlightBars([i], "orange");
  
      while (j >= 0 && array[j] > key) {
        array[j + 1] = array[j];
        highlightBars([j], "yellow");
        renderArray();
        await sleep(200);
        resetHighlight([j]);
        j--;
      }
  
      array[j + 1] = key;
      renderArray();
      await sleep(200);
      resetHighlight([i]);
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  function highlightBars(indices, color) {
    const bars = document.getElementsByClassName("bar");
    indices.forEach(index => {
      if (bars[index]) bars[index].style.backgroundColor = color;
    });
  }
  
  function resetHighlight(indices) {
    const bars = document.getElementsByClassName("bar");
    const max = Math.max(...array);
    indices.forEach(index => {
      if (bars[index]) {
        const hue = (array[index] / max) * 240;
        bars[index].style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
      }
    });
  }
  